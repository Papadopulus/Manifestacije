using FluentValidation;
using Manifestacije.Api.Endpoints.Internal;
using Manifestacije.Api.Extensions;
using Manifestacije.Api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace Manifestacije.Api.Endpoints;

public class OrganizationEndpoints : IEndpoints
{
    private const string BaseRoute = "/organizations";

    public static void DefineEndpoints(IEndpointRouteBuilder app)
    {
        app.MapPost(BaseRoute, CreateOrganization)
            .AllowAnonymous();

        app.MapPut(BaseRoute + "/{id}", UpdateOrganization)
            .RequireAuthorization(RolesEnum.Organization.ToString());

        app.MapDelete(BaseRoute + "/{id}", DeleteOrganization)
            .RequireAuthorization(RolesEnum.Admin.ToString());

        app.MapGet(BaseRoute, GetAllOrganizations)
            .AllowAnonymous();

        app.MapGet(BaseRoute + "/{id}", GetOrganizationById)
            .AllowAnonymous();
    }

    internal static async Task<IResult> CreateOrganization(
        [FromBody] OrganizationCreateRequest organizationCreateDto,
        IOrganizationService organizationService,
        IValidator<OrganizationCreateRequest> validator)
    {
        await validator.ValidateAndThrowAsync(organizationCreateDto);

        var organization = OrganizationMapper.OrganizationCreateRequestToOrganization(organizationCreateDto);
        var createdOrganization = await organizationService.CreateOrganizationAsync(organization);
        return Results.Ok(createdOrganization);
    }

    internal static async Task<IResult> UpdateOrganization(
        HttpContext context,
        string id,
        [FromBody] OrganizationUpdateRequest organizationUpdateDto,
        IOrganizationService organizationService,
        IValidator<OrganizationUpdateRequest> validator)
    {
        if (id != context.User.GetOrganizationId() && context.User.GetRole() != RolesEnum.Admin.ToString())
        {
            return Results.Forbid();
        }

        await validator.ValidateAndThrowAsync(organizationUpdateDto);

        var organization = OrganizationMapper.OrganizationUpdateRequestToOrganization(organizationUpdateDto);
        var updatedOrganization = await organizationService.UpdateOrganizationAsync(id, organization);
        return Results.Ok(updatedOrganization);
    }

    internal static async Task<IResult> DeleteOrganization(string id, IOrganizationService organizationService)
    {
        var result = await organizationService.DeleteOrganizationAsync(id);
        return result
            ? Results.Ok("Organization deleted")
            : Results.NotFound($"Organization with id: {id} does not exist");
    }

    internal static async Task<IResult> GetAllOrganizations([AsParameters] OrganizationQueryFilter queryFilter,
        IOrganizationService organizationService)
    {
        var organizations = await organizationService.GetAllOrganizationsAsync(queryFilter);
        return Results.Ok(organizations);
    }

    internal static async Task<IResult> GetOrganizationById(string id, IOrganizationService organizationService)
    {
        var organization = await organizationService.GetOrganizationByIdAsync(id);
        return organization == null
            ? Results.NotFound($"Organization with id: {id} does not exist")
            : Results.Ok(organization);
    }
}