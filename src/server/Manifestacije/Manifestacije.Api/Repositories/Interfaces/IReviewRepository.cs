using Manifestacije.Api.Models;

namespace Manifestacije.Api.Repositories.Interfaces;

public interface IReviewRepository
{
    Task<bool> CreateReviewAsync(Review review);
    Task<List<Review>> GetAllReviewsAsync(ReviewQueryFilter queryFilter);
    Task<Review?> GetReviewByIdAsync(string id, bool includeDeleted = false);
    Task<bool> UpdateReviewAsync(Review review);   
}