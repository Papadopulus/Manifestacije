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
}