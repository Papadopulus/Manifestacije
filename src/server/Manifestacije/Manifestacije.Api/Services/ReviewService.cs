using Manifestacije.Api.Exceptions;
using Manifestacije.Api.Mappers;

namespace Manifestacije.Api.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IEventRepository _eventRepository;
    private readonly IUserRepository _userRepository;

    public ReviewService(IReviewRepository reviewRepository,
        IEventRepository eventRepository,
        IUserRepository userRepository)
    {
        _reviewRepository = reviewRepository;
        _eventRepository = eventRepository;
        _userRepository = userRepository;
    }

    public async Task<ReviewViewResponse> CreateReviewAsync(ReviewCreateRequest reviewCreateRequest)
    {
        var review = ReviewMapper.ReviewCreateRequestToReview(reviewCreateRequest);

        review.Event = EventMapper.EventToEventPartial(
            await _eventRepository.GetEventByIdAsync(reviewCreateRequest.EventId) ??
            throw new NotFoundException($"There is no event with the id of {reviewCreateRequest.EventId}"));
        review.User = UserMapper.UserToUserPartial(
            await _userRepository.GetUserByIdAsync(reviewCreateRequest.UserId) ??
            throw new NotFoundException(
                $"There is no user with the id of {reviewCreateRequest.UserId}"));

        await _reviewRepository.CreateReviewAsync(review);
        return ReviewMapper.ReviewToReviewViewResponse(review);
    }

    public async Task<List<ReviewViewResponse>> GetAllReviewsAsync(ReviewQueryFilter queryFilter)
    {
        var reviews = await _reviewRepository.GetAllReviewsAsync(queryFilter);
        return ReviewMapper.ReviewToReviewViewResponse(reviews);
    }

    public async Task<ReviewViewResponse?> GetReviewByIdAsync(string id)
    {
        var review = await _reviewRepository.GetReviewByIdAsync(id);
        return review is null ? null : ReviewMapper.ReviewToReviewViewResponse(review);
    }

    public async Task<bool> DeleteReviewAsync(string id)
    {
        var existingReview = await _reviewRepository.GetReviewByIdAsync(id);
        if (existingReview is null) return false;

        existingReview.IsDeleted = true;
        existingReview.DeletedAtUtc = DateTime.UtcNow;
        await _reviewRepository.UpdateReviewAsync(existingReview);
        return true;
    }
}