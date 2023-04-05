using FluentValidation;
using Manifestacije.Api.Endpoints.Internal;
using Manifestacije.Api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace Manifestacije.Api.Endpoints;

public sealed class LocationEndpoints : IEndpoints
{
    private const string BaseRoute = "/locations";
    public static void DefineEndpoints(IEndpointRouteBuilder app)
    {
        
    }

    internal static async Task<IResult> CreateLocation(
        [FromBody] LocationCreateRequest locationCreateDto,
        ILocationService locationService,
        IValidator<LocationCreateRequest> validator)
    {
        var validationResult = await validator.ValidateAsync(locationCreateDto);
        if (!validationResult.IsValid)
        {
            return Results.BadRequest(validationResult.Errors);
        }

        var location = await locationService.CreateLocationAsync(locationCreateDto);
        var locationResponse = LocationMapper.LocationToViewResponse(location);
        return Results.Created($"{BaseRoute}/{location.Id}", locationResponse);
    }

    internal static async Task<IResult> UpdateLocation(
        string id,
        [FromBody] LocationUpdateRequest locationUpdateDto,
        ILocationService locationService,
        IValidator<LocationUpdateRequest> validator)
    {
        var validationResult = await validator.ValidateAsync(locationUpdateDto);
        if (!validationResult.IsValid)
        {
            return Results.BadRequest(validationResult.Errors);
        }

        var location = await locationService.UpdateLocationAsync(id, locationUpdateDto);
        return location is null
            ? Results.NotFound("there is not a location with specified id")
            : Results.Ok(LocationMapper.LocationToViewResponse(location));
    }
}