using Manifestacije.Api.Database;
using Manifestacije.Api.Extensions;
using Manifestacije.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Manifestacije.Api.Repositories;

public sealed class CategoryRepository:ICategoryRepository
{
    private readonly IMongoCollection<Category> _categoryCollection;

    public CategoryRepository(IOptions<DatabaseSettings> databaseSettings)
    {
        var mongoClient = new MongoClient(
            databaseSettings.Value.ConnectionString);
        var mongoDataBase = mongoClient.GetDatabase(
            databaseSettings.Value.DatabaseName);
        _categoryCollection = mongoDataBase.GetCollection<Category>(
            databaseSettings.Value.CategoryCollectionName);
    }


    public async Task<List<Category>> GetAllCategoriesAsync(CategoryQueryFilter categoryQueryFilter)
    {
        var filter = categoryQueryFilter.Filter<Category, CategoryQueryFilter>();
        var sort = QueryExtensions.Sort<Category>(categoryQueryFilter);

        return await _categoryCollection
            .Find(filter)
            .Sort(sort)
            .Paginate(categoryQueryFilter)
            .ToListAsync();
    }

    public async Task<Category?> GetCategoryByIdAsync(string id, bool includeDeleted = false)
    {
        var filter = Builders<Category>.Filter.Eq(category => category.Id, id);
        filter &= Builders<Category>.Filter.Eq(category => category.IsDeleted, includeDeleted);

        return await _categoryCollection
            .Find(filter)
            .FirstOrDefaultAsync();
    }

    public async Task<Category?> GetCategoryWithNameAsync(string name, bool includeDeleted = false)
    {
        var filter = Builders<Category>.Filter.Eq(category => category.Name, name);
        filter &= Builders<Category>.Filter.Eq(category => category.IsDeleted, includeDeleted);
        return await _categoryCollection
            .Find(filter)
            .FirstOrDefaultAsync();
    }

    public async Task<bool> CreateCategoryAsync(Category category)
    {
        await _categoryCollection.InsertOneAsync(category);
        return true;
    }

    public async Task<bool> UpdateCategoryAsync(Category category)
    {
        var filter = Builders<Category>.Filter.Eq("Id", category.Id);
        await _categoryCollection.ReplaceOneAsync(filter, category, new ReplaceOptions { IsUpsert = true });
        return true;
    }

    public async Task<bool> DeleteCategoryAsync(string id)
    {
        var filter = Builders<Category>.Filter.Eq("Id", id);
        var update = Builders<Category>.Update
            .Set(category => category.IsDeleted, true);
        await _categoryCollection.UpdateOneAsync(filter, update);
        return true;
    }
}