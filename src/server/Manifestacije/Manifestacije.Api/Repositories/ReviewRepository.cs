using Manifestacije.Api.Database;
using Manifestacije.Api.Extensions;
using Manifestacije.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Manifestacije.Api.Repositories;

public class ReviewRepository : IReviewRepository
{   
    private readonly IMongoCollection<Review> _reviewsCollection;
    
    public ReviewRepository(IOptions<DatabaseSettings> databaseSettings)
    {
        var mongoClient = new MongoClient(
            databaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            databaseSettings.Value.DatabaseName);

        _reviewsCollection = mongoDatabase.GetCollection<Review>(
            databaseSettings.Value.UsersCollectionName);
    }
    
    public async Task<bool> CreateReviewAsync(Review review)
    {
        await _reviewsCollection.InsertOneAsync(review);
        return true;
    }

    public async Task<List<Review>> GetAllReviewsAsync(ReviewQueryFilter queryFilter)
    {
        var filter = queryFilter.Filter<Review, ReviewQueryFilter>();
        var sort = QueryExtensions.Sort<Review>(queryFilter);

        return await _reviewsCollection
            .Find(filter)
            .Sort(sort)
            .Paginate(queryFilter)
            .ToListAsync();
    }

    public async Task<Review?> GetReviewByIdAsync(string id, bool includeDeleted = false)
    {
        var filter = Builders<Review>.Filter.Eq(x => x.Id, id);
        filter &= Builders<Review>.Filter.Eq(x => x.IsDeleted, includeDeleted);

        return await _reviewsCollection
            .Find(filter)
            .FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateReviewAsync(Review review)
    {
        var filter = Builders<Review>.Filter.Eq("Id", review.Id);
        await _reviewsCollection.ReplaceOneAsync(filter, review, new ReplaceOptions { IsUpsert = true });
        return true;
    }
}