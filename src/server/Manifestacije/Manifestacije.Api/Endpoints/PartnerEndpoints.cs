using FluentValidation;
using Manifestacije.Api.Endpoints.Internal;
using Manifestacije.Api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace Manifestacije.Api.Endpoints;

public class PartnerEndpoints : IEndpoints
{
    private const string BaseRoute = "/partners";

    public static void DefineEndpoints(IEndpointRouteBuilder app)
    {
        app.MapGet(BaseRoute, GetAllPartners)
            .AllowAnonymous();
        app.MapGet(BaseRoute + "/{id}", GetPartnerById)
            .AllowAnonymous();
        app.MapPost(BaseRoute, CreatePartner)
            .RequireAuthorization(RolesEnum.Admin.ToString());
        app.MapPut(BaseRoute + "/{id}", UpdatePartner)
            .RequireAuthorization(RolesEnum.Admin.ToString());
        app.MapDelete(BaseRoute + "/{id}", DeletePartner)
            .RequireAuthorization(RolesEnum.Admin.ToString());
    }

    internal static async Task<IResult> CreatePartner(
        [FromBody] PartnerCreateRequest partnerCreateDto,
        IPartnerService partnerService,
        IValidator<PartnerCreateRequest> validator)
    {
        var validatorResult = await validator.ValidateAsync(partnerCreateDto);
        if (!validatorResult.IsValid)
        {
            throw new ValidationException(validatorResult.Errors);
        }

        var partner = await partnerService.CreatePartnerAsync(partnerCreateDto);
        var partnerResponse = PartnerMapper.PartnerToPartnerViewResponse(partner);
        return Results.Created($"{BaseRoute}/{partner.Id}", partnerResponse);
    }

    internal static async Task<IResult> UpdatePartner(
        string id,
        [FromBody] PartnerUpdateRequest partnerUpdateDto,
        IPartnerService partnerService,
        IValidator<PartnerUpdateRequest> validator)
    {
        var validatorResult = await validator.ValidateAsync(partnerUpdateDto);
        if (!validatorResult.IsValid)
        {
            return Results.BadRequest(validatorResult.Errors);
        }

        var partner = await partnerService.UpdatePartnerAsync(id, partnerUpdateDto);
        return partner is null
            ? Results.NotFound("Partner with the given id not found")
            : Results.Ok(PartnerMapper.PartnerToPartnerViewResponse(partner));
    }

    internal static async Task<IResult> DeletePartner(
        string id,
        IPartnerService partnerService)
    {
        var result = await partnerService.DeletePartnerAsync(id);
        return result
            ? Results.Ok("Partner successfully deleted")
            : Results.NotFound("Partner with the given id not found");
    }

    internal static async Task<IResult> GetAllPartners(
        [AsParameters] PartnerQueryFilter partnerQueryFilter,
        IPartnerService partnerService)
    {
        var partners = await partnerService.GetAllPartnersAsync(partnerQueryFilter);
        var partnersResponse = PartnerMapper.PartnerToPartnerViewResponseEnumerable(partners);
        return Results.Ok(partnersResponse);
    }

    internal static async Task<IResult> GetPartnerById(
        string id,
        IPartnerService partnerService)
    {
        var partner = await partnerService.GetPartnerByIdAsync(id);
        return partner is null
            ? Results.NotFound($"Partner with the given id not found")
            : Results.Ok(PartnerMapper.PartnerToPartnerViewResponse(partner));
    }
}