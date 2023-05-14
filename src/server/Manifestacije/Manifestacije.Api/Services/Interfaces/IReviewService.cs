namespace Manifestacije.Api.Services.Interfaces;

public interface IReviewService
{
    Task<ReviewViewResponse> CreateReviewAsync(ReviewCreateRequest reviewCreateRequest);
    Task<List<ReviewViewResponse>> GetAllReviewsAsync(ReviewQueryFilter queryFilter);
    Task<ReviewViewResponse?> GetReviewByIdAsync(string id);
    Task<bool> DeleteReviewAsync(string id);
}