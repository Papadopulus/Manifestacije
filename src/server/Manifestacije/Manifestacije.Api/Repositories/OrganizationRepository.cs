using Manifestacije.Api.Database;
using Manifestacije.Api.Extensions;
using Manifestacije.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Manifestacije.Api.Repositories;

public sealed class OrganizationRepository : IOrganizationRepository
{
    public IMongoCollection<Organization> _organizationsCollection;

    public OrganizationRepository(IOptions<DatabaseSettings> databaseSettings)
    {
        var mongoClient = new MongoClient(
            databaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            databaseSettings.Value.DatabaseName);

        _organizationsCollection = mongoDatabase.GetCollection<Organization>(
            databaseSettings.Value.OrganizationsCollectionName);
    }
    
    public async Task<List<Organization>> GetAllOrganizationsAsync(OrganizationQueryFilter organizationQueryFilter)
    {
        var filter = organizationQueryFilter.Filter<Organization, OrganizationQueryFilter>();
        var sort = QueryExtensions.Sort<Organization>(organizationQueryFilter);

        return await _organizationsCollection
            .Find(filter)
            .Sort(sort)
            .Paginate(organizationQueryFilter)
            .ToListAsync();
    }

    public async Task<Organization?> GetOrganizationByIdAsync(string id, bool includeDeleted = false)
    {
        var filter = Builders<Organization>.Filter.Eq(organization => organization.Id, id);
        filter &= Builders<Organization>.Filter.Eq(organization => organization.IsDeleted, includeDeleted);

        return await _organizationsCollection
            .Find(filter)
            .FirstOrDefaultAsync();
    }

    public async Task<Organization?> GetOrganizationByNameAsync(string name, bool includeDeleted = false)
    {
        var filter = Builders<Organization>.Filter.Eq(organization => organization.Name, name);
        filter &= Builders<Organization>.Filter.Eq(organization => organization.IsDeleted, includeDeleted);

        return await _organizationsCollection
            .Find(filter)
            .FirstOrDefaultAsync();
    }

    public async Task<bool> CreateOrganizationAsync(Organization organization)
    {
        await _organizationsCollection.InsertOneAsync(organization);
        return true;
    }

    public async Task<bool> UpdateOrganizationAsync(Organization organization)
    {
        var filter = Builders<Organization>.Filter.Eq("Id", organization.Id);
        await _organizationsCollection.ReplaceOneAsync(filter, organization, new ReplaceOptions { IsUpsert = true });
        return true;
    }

    public async Task<bool> DeleteOrganizationAsync(string id)
    {
        var filter = Builders<Organization>.Filter.Eq("Id", id);
        var update = Builders<Organization>.Update
            .Set(user => user.IsDeleted, true);
        await _organizationsCollection.UpdateOneAsync(filter, update);
        return true;
    }
}