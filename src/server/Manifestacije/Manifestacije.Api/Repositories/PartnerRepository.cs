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
            .Set(x => x.DeletedAtUtc, DateTime.UtcNow)
            .Set(x => x.IsDeleted, true);
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

    public async Task<Partner?> GetPartnerByLocationAsync(string locationId, bool transport = false, bool accommodation = false)
    {
        if (transport && accommodation)
            return null;
        
        var filter = Builders<Partner>.Filter.ElemMatch(x => x.Locations, x => x.Id == locationId);
        filter &= Builders<Partner>.Filter.Eq(partner => partner.IsDeleted, false);
        filter &= Builders<Partner>.Filter.Eq(partner => partner.IsTransport, transport);
        filter &= Builders<Partner>.Filter.Eq(partner => partner.IsAccommodation, accommodation);
        return await _partnerCollection
            .Find(filter)
            .FirstOrDefaultAsync();
    }
}