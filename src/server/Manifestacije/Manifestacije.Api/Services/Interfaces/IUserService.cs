using Manifestacije.Api.Contracts.Requests;
using Manifestacije.Api.Contracts.Responses;
using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services.Interfaces;

public interface IUserService
{
    Task<List<User>> GetAllUsersAsync();
    Task<User> GetUserByIdAsync(string id);
    Task<User> CreateUserAsync(UserCreateRequest userCreateRequest);
    Task<User> UpdateUserAsync(UserUpdateRequest userUpdateRequest);
    Task<bool> DeleteUserAsync(string id);
    Task<TokenResponse> LoginAsync(LoginRequest loginRequest);
    Task<TokenResponse> RefreshTokenAsync(RefreshTokenRequest refreshTokenRequest);
}