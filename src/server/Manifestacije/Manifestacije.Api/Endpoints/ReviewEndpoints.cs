using FluentValidation;
using Manifestacije.Api.Endpoints.Internal;
using Manifestacije.Api.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace Manifestacije.Api.Endpoints;

public class ReviewEndpoints : IEndpoints
{
    private const string BaseRoute = "/reviews";
    
    public static void DefineEndpoints(IEndpointRouteBuilder app)
    {
        app.MapPost(BaseRoute, CreateReview)
            .RequireAuthorization(RolesEnum.User.ToString());
        app.MapGet(BaseRoute, GetAllReviews)
            .RequireAuthorization(RolesEnum.User.ToString());
        app.MapGet(BaseRoute + "/{id}", GetReviewById)
            .RequireAuthorization(RolesEnum.User.ToString());
        app.MapDelete(BaseRoute + "/{id}", DeleteReview)
            .RequireAuthorization(RolesEnum.Admin.ToString());
    }
    
    internal static async Task<IResult> CreateReview(
        IReviewService reviewService,
        [FromBody] ReviewCreateRequest reviewCreateRequest,
        IValidator<ReviewCreateRequest> validator,
        HttpContext httpContext)
    {
        await validator.ValidateAndThrowAsync(reviewCreateRequest);
        reviewCreateRequest.UserId = httpContext.User.GetUserId(); 

        var createdReview = await reviewService.CreateReviewAsync(reviewCreateRequest);
        return Results.Created($"{BaseRoute}/{createdReview.Id}", createdReview);
    }
    
    internal static async Task<IResult> GetAllReviews(
        [AsParameters] ReviewQueryFilter queryFilter,
        IReviewService reviewService)
    {
        var reviews = await reviewService.GetAllReviewsAsync(queryFilter);
        return Results.Ok(reviews);
    }
    
    internal static async Task<IResult> GetReviewById(
        string id,
        IReviewService reviewService)
    {
        var review = await reviewService.GetReviewByIdAsync(id);
        return review is null
            ? Results.NotFound($"Review with the id of: {id} does not exist")
            : Results.Ok(review);
    }
    
    internal static async Task<IResult> DeleteReview(
        string id,
        IReviewService reviewService)
    {
        var success = await reviewService.DeleteReviewAsync(id);
        return !success
            ? Results.NotFound($"Review with the id of: {id} does not exist")
            : Results.Ok($"Review with the id of: {id} is deleted");
    }
}