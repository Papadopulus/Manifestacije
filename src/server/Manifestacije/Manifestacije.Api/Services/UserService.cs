using AutoMapper;
using Manifestacije.Api.Contracts.Requests;
using Manifestacije.Api.Contracts.Responses;
using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UserService(IUserRepository userRepository,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _userRepository.GetAllUsersAsync();
    }

    public async Task<User> GetUserByIdAsync(string id)
    {
        throw new NotImplementedException();
    }

    public async Task<User> CreateUserAsync(UserCreateRequest userCreateRequest)
    {
        var salt = BCrypt.Net.BCrypt.GenerateSalt();
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(userCreateRequest.Password, salt);
        Console.WriteLine("Salt is {0} and password hash is {1}", salt, passwordHash);
        return _mapper.Map<User>(userCreateRequest);
    }

    public async Task<User> UpdateUserAsync(UserUpdateRequest userUpdateRequest)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> DeleteUserAsync(string id)
    {
        throw new NotImplementedException();
    }

    public async Task<TokenResponse> LoginAsync(LoginRequest loginRequest)
    {
        throw new NotImplementedException();
    }

    public async Task<TokenResponse> RefreshTokenAsync(RefreshTokenRequest refreshTokenRequest)
    {
        throw new NotImplementedException();
    }
}