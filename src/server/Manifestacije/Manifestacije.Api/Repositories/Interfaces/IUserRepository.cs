using Manifestacije.Api.Models;

namespace Manifestacije.Api.Repositories.Interfaces;

public interface IUserRepository
{
    Task<List<User>> GetAllUsersAsync();
}