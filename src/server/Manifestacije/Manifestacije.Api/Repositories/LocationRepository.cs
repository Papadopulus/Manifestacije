using Manifestacije.Api.Database;
using Manifestacije.Api.Extensions;
using Manifestacije.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Manifestacije.Api.Repositories;

public class LocationRepository : ILocationRepository
{
    private readonly IMongoCollection<Location> _locationsCollection;

    public LocationRepository(IOptions<DatabaseSettings> databaseSettings)
    {
        var mongoClient = new MongoClient(
            databaseSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(
            databaseSettings.Value.DatabaseName);
        _locationsCollection = mongoDatabase.GetCollection<Location>(
            databaseSettings.Value.LocationsCollectionName);
    }

    public async Task<List<Location>> GetAllLocationsAsync(LocationQueryFilter locationQueryFilter)
    {
        var filter = locationQueryFilter.Filter<Location, LocationQueryFilter>();
        var sort = QueryExtensions.Sort<Location>(locationQueryFilter);

        return await _locationsCollection
            .Find(filter)
            .Sort(sort)
            .Paginate(locationQueryFilter)
            .ToListAsync();
    }

    public async Task<Location?> GetLocationByIdAsync(string id, bool includeDeleted = false)
    {
        var filter = Builders<Location>.Filter.Eq(location => location.Id, id);
        filter &= Builders<Location>.Filter.Eq(location => location.IsDeleted, includeDeleted);
        return await _locationsCollection
            .Find(filter)
            .FirstOrDefaultAsync();
    }

    public async Task<Location?> GetLocationByNameAsync(string name, bool includeDeleted = false)
    {
        var filter = Builders<Location>.Filter.Eq(location => location.Name, name);
        filter &= Builders<Location>.Filter.Eq(location => location.IsDeleted, includeDeleted);
        return await _locationsCollection
            .Find(filter)
            .FirstOrDefaultAsync();
    }

    public async Task<bool> CreateLocationAsync(Location location)
    {
        await _locationsCollection.InsertOneAsync(location);
        return true;
    }

    public async Task<bool> UpdateLocationAsync(Location location)
    {
        var filter = Builders<Location>.Filter.Eq("Id", location.Id);
        await _locationsCollection.ReplaceOneAsync(filter, location, new ReplaceOptions { IsUpsert = true });
        return true;
    }

    public async Task<bool> DeleteLocationAsync(string id)
    {
        var filter = Builders<Location>.Filter.Eq("Id", id);
        var update = Builders<Location>.Update
            .Set(location => location.IsDeleted, true);
        await _locationsCollection.UpdateOneAsync(filter, update);
        return true;
    }
}