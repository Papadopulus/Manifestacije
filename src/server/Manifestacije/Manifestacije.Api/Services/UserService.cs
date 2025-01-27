﻿using Manifestacije.Api.Exceptions;
using Manifestacije.Api.Extensions;
using Manifestacije.Api.Mappers;
using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services;

public sealed class UserService : IUserService
{
    private readonly IMailService _mailService;
    private readonly IOrganizationService _organizationService;
    private readonly IEventRepository _eventRepository;
    private readonly string _secret;
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository,
        IConfiguration configuration,
        IMailService mailService,
        IOrganizationService organizationService,
        IEventRepository eventRepository)
    {
        _userRepository = userRepository;
        _secret = configuration["Authorization:Secret"]!;
        _mailService = mailService;
        _organizationService = organizationService;
        _eventRepository = eventRepository;
    }

    public async Task<List<User>> GetAllUsersAsync(UserQueryFilter userQueryFilter)
    {
        return await _userRepository.GetAllUsersAsync(userQueryFilter);
    }

    public async Task<User?> GetUserByIdAsync(string id)
    {
        return await _userRepository.GetUserByIdAsync(id);
    }

    public async Task<User> CreateUserAsync(UserCreateRequest userCreateRequest)
    {
        var existingUser = await _userRepository.GetUserWithEmailAsync(userCreateRequest.Email);
        if (existingUser is not null)
        {
            throw new InvalidInputException("User with given email already exists");
        }

        var user = UserMapper.UserCreateRequestToUser(userCreateRequest);
        (user.PasswordSalt, user.PasswordHash) = AuthHelpers.HashPassword(userCreateRequest.Password);

        if (userCreateRequest.Organization is not null)
        {
            var organization = await _organizationService.CreateOrganizationAsync(
                OrganizationMapper.OrganizationCreateRequestToOrganization(userCreateRequest.Organization));
            user.Roles.Add("Organization");
            user.Organization = OrganizationMapper.OrganizationToOrganizationPartial(organization);
        }
        else
        {
            user.Roles.Add("User");
        }

        var success = await _userRepository.CreateUserAsync(user);
        if (!success)
        {
            throw new DatabaseException("Failed to create user");
        }

        return user;
    }

    public async Task<User?> UpdateUserAsync(string id, UserUpdateRequest userUpdateRequest)
    {
        var existingUser = await _userRepository.GetUserByIdAsync(id);
        if (existingUser is null)
        {
            return null;
        }

        existingUser.FirstName = userUpdateRequest.FirstName;
        existingUser.LastName = userUpdateRequest.LastName;
        existingUser.UpdatedAtUtc = DateTime.UtcNow;
        var success = await _userRepository.UpdateUserAsync(existingUser);
        if (!success)
        {
            throw new DatabaseException("Failed to update the user");
        }

        return existingUser;
    }

    public async Task<bool> DeleteUserAsync(string id)
    {
        var existingUser = await _userRepository.GetUserByIdAsync(id);
        if (existingUser is null)
        {
            return false;
        }

        existingUser.IsDeleted = true;
        existingUser.DeletedAtUtc = DateTime.UtcNow;
        return await _userRepository.UpdateUserAsync(existingUser);
    }

    public async Task<TokenResponse> AuthenticateAsync(AuthenticateRequest authenticateRequest)
    {
        var user = await _userRepository.GetUserWithEmailAsync(authenticateRequest.Email);

        if (user is null)
        {
            throw new InvalidInputException("Incorrect email");
        }

        if (!user.ValidatePassword(authenticateRequest.Password))
        {
            throw new InvalidInputException("Incorrect password");
        }

        var (token, refreshToken) = user.GenerateTokens(_secret);
        user.RefreshTokens.Add(new RefreshToken { Token = refreshToken, ExpireDate = DateTime.UtcNow.AddDays(7) });
        await _userRepository.UpdateUserAsync(user);
        return new TokenResponse { Token = token, RefreshToken = refreshToken };
    }

    public async Task<TokenResponse> RefreshTokenAsync(RefreshTokenRequest refreshTokenRequest)
    {
        var user = await _userRepository.GetUserWithRefreshTokenAsync(refreshTokenRequest.Token);

        if (user is null)
        {
            throw new InvalidInputException("Invalid token");
        }

        var oldToken = user.RefreshTokens.FirstOrDefault(x => x.Token == refreshTokenRequest.Token)!;
        if (oldToken.ExpireDate < DateTime.UtcNow)
        {
            throw new InvalidInputException("Token expired");
        }

        var (token, refreshToken) = user.GenerateTokens(_secret);
        user.RefreshTokens.Remove(oldToken);
        user.RefreshTokens.Add(new RefreshToken { Token = refreshToken, ExpireDate = DateTime.UtcNow.AddDays(7) });
        await _userRepository.UpdateUserAsync(user);
        return new TokenResponse { Token = token, RefreshToken = refreshToken };
    }

    public async Task<bool> SendEmailResetPasswordAsync(string email)
    {
        var user = await _userRepository.GetUserWithEmailAsync(email);
        if (user is null)
        {
            return false;
        }

        var (_, token) = user.GenerateTokens(_secret);
        user.RefreshTokens.Add(new RefreshToken
            { Token = token, ExpireDate = DateTime.UtcNow.AddDays(1), IsPasswordReset = true });
        await _userRepository.UpdateUserAsync(user);
        await _mailService.SendEmailAsync(email, "Password reset", token);
        return true;
    }

    public async Task<bool> ResetPasswordAsync(string token, string newPassword)
    {
        var user = await _userRepository.GetUserWithRefreshTokenAsync(token);
        if (user is null)
        {
            return false;
        }

        var oldToken = user.RefreshTokens.FirstOrDefault(x => x.Token == token && x.IsPasswordReset);
        if (oldToken is null)
        {
            return false;
        }

        if (oldToken.ExpireDate < DateTime.UtcNow)
        {
            throw new InvalidInputException("Token expired");
        }

        user.RefreshTokens = new List<RefreshToken>();
        (user.PasswordSalt, user.PasswordHash) = AuthHelpers.HashPassword(newPassword);
        await _userRepository.UpdateUserAsync(user);
        return true;
    }

    public async Task<bool> AddEventToFavouritesAsync(string userId,
        string eventId,
        CancellationToken ct)
    {
        var user = await _userRepository.GetUserByIdAsync(userId);
        if (user is null)
        {
            throw new NotFoundException($"There is no user with the id of {userId}");
        }

        var eventFromDb = await _eventRepository.GetEventByIdAsync(eventId);
        if (eventFromDb is null)
        {
            throw new NotFoundException($"There is no event with the id of {eventId}");
        }
        
        if(user.FavouriteEvents.Contains(EventMapper.EventToEventPartial(eventFromDb)))
        {
            throw new InvalidInputException("You are already going to this event");
        }

        user.FavouriteEvents.Add(EventMapper.EventToEventPartial(eventFromDb));
        eventFromDb.Favourites++;
        var updateEventTask = _eventRepository.UpdateEventAsync(eventFromDb);
        var updateUserTask = _userRepository.UpdateUserAsync(user);

        Task.WaitAll(new Task[] { updateEventTask, updateUserTask }, cancellationToken: ct);

        return true;
    }

    public async Task<bool> RemoveEventFromFavouritesAsync(string userId,
        string eventId,
        CancellationToken ct)
    {
        var user = await _userRepository.GetUserByIdAsync(userId);
        if (user is null)
        {
            throw new NotFoundException($"There is no user with the id of {userId}");
        }

        var eventFromDb = await _eventRepository.GetEventByIdAsync(eventId);
        if (eventFromDb is null)
        {
            throw new NotFoundException($"There is no event with the id of {eventId}");
        }
        
        if(user.GoingEvents.Contains(EventMapper.EventToEventPartial(eventFromDb)))
        {
            throw new InvalidInputException("You are already going to this event");
        }

        user.GoingEvents.Add(EventMapper.EventToEventPartial(eventFromDb));
        eventFromDb.Going++;
        var updateEventTask = _eventRepository.UpdateEventAsync(eventFromDb);
        var updateUserTask = _userRepository.UpdateUserAsync(user);

        Task.WaitAll(new Task[] { updateEventTask, updateUserTask }, cancellationToken: ct);

        return true;
    }

    public async Task<bool> AddEventToGoingAsync(string userId,
        string eventId,
        CancellationToken ct)
    {
        var user = await _userRepository.GetUserByIdAsync(userId);
        if (user is null)
        {
            throw new NotFoundException($"There is no user with the id of {userId}");
        }

        var eventFromDb = await _eventRepository.GetEventByIdAsync(eventId);
        if (eventFromDb is null)
        {
            throw new NotFoundException($"There is no event with the id of {eventId}");
        }
        
        if(!user.FavouriteEvents.Contains(EventMapper.EventToEventPartial(eventFromDb)))
        {
            throw new InvalidInputException("You are already going to this event");
        }

        user.FavouriteEvents.Remove(EventMapper.EventToEventPartial(eventFromDb));
        eventFromDb.Favourites--;
        var updateEventTask = _eventRepository.UpdateEventAsync(eventFromDb);
        var updateUserTask = _userRepository.UpdateUserAsync(user);

        Task.WaitAll(new Task[] { updateEventTask, updateUserTask }, cancellationToken: ct);

        return true;
    }

    public async Task<bool> RemoveEventFromGoingAsync(string userId,
        string eventId,
        CancellationToken ct)
    {
        var user = await _userRepository.GetUserByIdAsync(userId);
        if (user is null)
        {
            throw new NotFoundException($"There is no user with the id of {userId}");
        }

        var eventFromDb = await _eventRepository.GetEventByIdAsync(eventId);
        if (eventFromDb is null)
        {
            throw new NotFoundException($"There is no event with the id of {eventId}");
        }

        if(!user.GoingEvents.Contains(EventMapper.EventToEventPartial(eventFromDb)))
        {
            throw new InvalidInputException("You are already going to this event");
        }

        user.FavouriteEvents.Remove(EventMapper.EventToEventPartial(eventFromDb));
        eventFromDb.Favourites--;
        var updateEventTask = _eventRepository.UpdateEventAsync(eventFromDb);
        var updateUserTask = _userRepository.UpdateUserAsync(user);

        Task.WaitAll(new Task[] { updateEventTask, updateUserTask }, cancellationToken: ct);

        return true;
    }
}