using Manifestacije.Api.Models;
using Riok.Mapperly.Abstractions;

namespace Manifestacije.Api.Mappers;

[Mapper]
public static partial class ReviewMapper
{
    public static partial Review ReviewCreateRequestToReview(ReviewCreateRequest reviewCreateRequest);
    public static partial ReviewViewResponse ReviewToReviewViewResponse(Review review);
    public static partial List<ReviewViewResponse> ReviewToReviewViewResponse(List<Review> review);
    public static partial ReviewPartial ReviewToReviewPartial(Review review);
}