using Manifestacije.Api.Database;
using Manifestacije.Api.Extensions;
using Manifestacije.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Manifestacije.Api.Repositories;

public sealed class PartnerRepository : IPartnerRepository
{
    private readonly IMongoCollection<Partner> _partnerCollection;

    public PartnerRepository(IOptions<DatabaseSettings> databaseSettings)
    {
        var mongoClient = new MongoClient(
            databaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            databaseSettings.Value.DatabaseName);

        _partnerCollection = mongoDatabase.GetCollection<Partner>(
            databaseSettings.Value.PartnersCollectionName);
    }

    public async Task<List<Partner>> GetAllPartnersAsync(PartnerQueryFilter partnerQueryFilter)
    {
        var filter = partnerQueryFilter.Filter<Partner, PartnerQueryFilter>();
        var sort = QueryExtensions.Sort<Partner>(partnerQueryFilter);

        return await _partnerCollection
            .Find(filter)
            .Sort(sort)
            .Paginate(partnerQueryFilter)
            .ToListAsync();
    }

    public async Task<bool> CreatePartnerAsync(Partner partner)
    {
        await _partnerCollection.InsertOneAsync(partner);
        return true;
    }

    public async Task<bool> DeletePartnerAsync(string id)
    {
        var filter = Builders<Partner>.Filter.Eq("Id", id);
        var update = Builders<Partner>.Update
            .Set(partner => partner.IsDeleted, true);
        await _partnerCollection.UpdateOneAsync(filter, update);
        return true;
    }

    public async Task<bool> UpdatePartnerAsync(Partner partner)
    {
        var filter = Builders<Partner>.Filter.Eq("Id", partner.Id);
        await _partnerCollection.ReplaceOneAsync(filter, partner, new ReplaceOptions { IsUpsert = true });
        return true;
    }

    public async Task<Partner?> GetPartnerByIdAsync(string id)
    {
        var filter = Builders<Partner>.Filter.Eq(partner => partner.Id, id);
        return await _partnerCollection
            .Find(filter)
            .FirstOrDefaultAsync();
    }

    public async Task<Partner?> GetPartnerByNameAsync(string name, bool includeDeleted = false)
    {
        var filter = Builders<Partner>.Filter.Eq(partner => partner.Name, name);
        filter &= Builders<Partner>.Filter.Eq(partner => partner.IsDeleted, includeDeleted);
        return await _partnerCollection
            .Find(filter)
            .FirstOrDefaultAsync();
    }
}