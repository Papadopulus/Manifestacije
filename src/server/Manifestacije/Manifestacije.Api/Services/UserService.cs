using AutoMapper;
using Manifestacije.Api.Exceptions;
using Manifestacije.Api.Extensions;
using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly string secret;

    public UserService(IUserRepository userRepository,
        IConfiguration configuration,
        IMapper mapper)
    {
        _userRepository = userRepository;
        secret = configuration["Authorization:Secret"]!;
        _mapper = mapper;
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
            throw new InvalidInputException("User with given email already exists");

        var user = _mapper.Map<User>(userCreateRequest);
        (user.PasswordSalt, user.PasswordHash) = Auth.HashPassword(userCreateRequest.Password);
        var success = await _userRepository.CreateUserAsync(user);
        if (!success)
            throw new DatabaseException("Failed to create user");

        return user;
    }

    public async Task<User> UpdateUserAsync(string id, UserUpdateRequest userUpdateRequest)
    {
        var existingUser = await _userRepository.GetUserByIdAsync(id);
        if (existingUser is null)
            throw new InvalidInputException("User with given id does not exist");

        _mapper.Map(source: userUpdateRequest, destination: existingUser);
        existingUser.UpdatedAtUtc = DateTime.UtcNow;
        var success = await _userRepository.UpdateUserAsync(existingUser);
        if (!success)
            throw new DatabaseException("Failed to update the user");

        return existingUser;
    }

    public async Task<bool> DeleteUserAsync(string id)
    {
        var existingUser = await _userRepository.GetUserByIdAsync(id);
        if (existingUser is null)
            return false;
        existingUser.IsDeleted = true;
        existingUser.DeletedAtUtc = DateTime.UtcNow;
        return await _userRepository.UpdateUserAsync(existingUser);
    }

    public async Task<TokenResponse> AuthenticateAsync(AuthenticateRequest authenticateRequest)
    {
        var user = await _userRepository.GetUserWithEmailAsync(authenticateRequest.Email);

        if (user is null)
            throw new InvalidInputException("Incorrect email");

        if (!user.ValidatePassword(authenticateRequest.Password))
            throw new InvalidInputException("Incorrect password");

        var (token, refreshToken) = user.GenerateTokens(secret);
        user.RefreshTokens.Add(new RefreshToken { Token = refreshToken, ExpireDate = DateTime.UtcNow.AddDays(7) });
        await _userRepository.UpdateUserAsync(user);
        return new TokenResponse { Token = token, RefreshToken = refreshToken };
    }

    public async Task<TokenResponse> RefreshTokenAsync(RefreshTokenRequest refreshTokenRequest)
    {
        var user = await _userRepository.GetUserWithRefreshTokenAsync(refreshTokenRequest.Token);

        if (user is null)
            throw new InvalidInputException("Invalid token");

        var oldToken = user.RefreshTokens.FirstOrDefault(x => x.Token == refreshTokenRequest.Token)!;
        if (oldToken.ExpireDate < DateTime.UtcNow)
            throw new InvalidInputException("Token expired");

        var (token, refreshToken) = user.GenerateTokens(secret);
        user.RefreshTokens.Remove(oldToken);
        user.RefreshTokens.Add(new RefreshToken { Token = refreshToken, ExpireDate = DateTime.Now.AddDays(7) });
        await _userRepository.UpdateUserAsync(user);
        return new TokenResponse { Token = token, RefreshToken = refreshToken };
    }
}