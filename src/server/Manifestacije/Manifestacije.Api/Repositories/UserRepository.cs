using Manifestacije.Api.Database;
using Manifestacije.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Manifestacije.Api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _usersCollection;

    public UserRepository(IOptions<DatabaseSettings> databaseSettings)
    {
        var mongoClient = new MongoClient(
            databaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            databaseSettings.Value.DatabaseName);

        _usersCollection = mongoDatabase.GetCollection<User>(
            databaseSettings.Value.UsersCollectionName);
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
        throw new NotImplementedException();
    }

    public async Task<User?> GetUserByIdAsync(string id)
    {
        throw new NotImplementedException();
    }

    public async Task<User?> GetUserWithEmailAsync(string email)
    {
        throw new NotImplementedException();
    }

    public async Task<User?> GetUserWithRefreshTokenAsync(string refreshToken)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> CreateUserAsync(User user)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> UpdateUserAsync(User user)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> DeleteUserAsync(string id)
    {
        throw new NotImplementedException();
    }
}