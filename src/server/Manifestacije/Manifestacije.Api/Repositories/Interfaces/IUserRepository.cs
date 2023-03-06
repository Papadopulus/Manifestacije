using Manifestacije.Api.Contracts.QueryFilters;
using Manifestacije.Api.Models;

namespace Manifestacije.Api.Repositories.Interfaces;

public interface IUserRepository
{
    Task<List<User>> GetAllUsersAsync(UserQueryFilter userQueryFilter);
    Task<User?> GetUserByIdAsync(string id);
    Task<User?> GetUserWithEmailAsync(string email);
    Task<User?> GetUserWithRefreshTokenAsync(string refreshToken);
    Task<bool> CreateUserAsync(User user);
    Task<bool> UpdateUserAsync(User user);
    Task<bool> DeleteUserAsync(string id);
}