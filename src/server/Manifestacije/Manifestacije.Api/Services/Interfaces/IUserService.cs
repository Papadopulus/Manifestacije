using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services.Interfaces;

public interface IUserService
{
    Task<List<User>> GetAllUsersAsync(UserQueryFilter userQueryFilter);
    Task<User?> GetUserByIdAsync(string id);
    Task<User> CreateUserAsync(UserCreateRequest userCreateRequest);
    Task<User?> UpdateUserAsync(string id, UserUpdateRequest userUpdateRequest);
    Task<bool> DeleteUserAsync(string id);
    Task<TokenResponse> AuthenticateAsync(AuthenticateRequest authenticateRequest);
    Task<TokenResponse> RefreshTokenAsync(RefreshTokenRequest refreshTokenRequest);
    Task<bool> SendEmailResetPasswordAsync(string email);
    Task<bool> ResetPasswordAsync(string token, string newPassword);
}