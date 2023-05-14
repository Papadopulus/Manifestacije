using Manifestacije.Api.Models;
using Riok.Mapperly.Abstractions;

namespace Manifestacije.Api.Mappers;

[Mapper]
public static partial class OrganizationMapper
{
    public static partial Organization OrganizationCreateRequestToOrganization(
        OrganizationCreateRequest organizationCreateRequest);

    public static partial Organization OrganizationUpdateRequestToOrganization(
        OrganizationUpdateRequest organizationUpdateRequest);

    public static partial OrganizationPartial OrganizationToOrganizationPartial(Organization organization);
    public static partial OrganizationViewResponse OrganizationToOrganizationViewResponse(Organization organization);

    public static partial IEnumerable<OrganizationViewResponse> OrganizationToOrganizationViewResponseEnumerable(
        IEnumerable<Organization> organization);
}