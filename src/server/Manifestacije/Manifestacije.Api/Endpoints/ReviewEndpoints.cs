// using Manifestacije.Api.Endpoints.Internal;
//
// namespace Manifestacije.Api.Endpoints;
//
// public class ReviewEndpoints : IEndpoints
// {
//     private const string BaseRoute = "/reviews";
//     
//     public static void DefineEndpoints(IEndpointRouteBuilder app)
//     {
//         app.MapPost(BaseRoute, CreateReview)
//             .RequireAuthorization(RolesEnum.User.ToString());
//         app.MapGet(BaseRoute, GetAllReviews)
//             .RequireAuthorization(RolesEnum.User.ToString());
//         app.MapGet(BaseRoute + "/{id}", GetReviewById)
//             .RequireAuthorization(RolesEnum.User.ToString());
//         app.MapDelete(BaseRoute + "/{id}", DeleteReview)
//             .RequireAuthorization(RolesEnum.Admin.ToString());
//     }
//     
//     internal static async Task<IResult> CreateReview(
//         IReviewService reviewService,
//         [FromBody] ReviewCreateRequest reviewCreateRequest,
//         IValidator<ReviewCreateRequest> validator)
//     {
//         var validationResult = await validator.ValidateAsync(reviewCreateRequest);
//         if (!validationResult.IsValid)
//         {
//             throw new ValidationException(validationResult.Errors);
//         }
//
//         var review = reviewCreateRequest.ToReview();
//         var createdReview = await reviewService.CreateReviewAsync(review);
//         return Results.Created($"{BaseRoute}/{createdReview.Id}", createdReview.ToReviewResponse());
//     }
//     
//     internal static async Task<IResult> GetAllReviews(
//         IReviewService reviewService)
//     {
//         var reviews = await reviewService.GetAllReviewsAsync();
//         return Results.Ok(reviews.Select(x => x.ToReviewResponse()));
//     }
//     
//     internal static async Task<IResult> GetReviewById(
//         Guid id,
//         IReviewService reviewService)
//     {
//         var review = await reviewService.GetReviewByIdAsync(id);
//         return review is null
//             ? Results.NotFound($"Review with the id of: {id} does not exist")
//             : Results.Ok(review.ToReviewResponse());
//     }
// }