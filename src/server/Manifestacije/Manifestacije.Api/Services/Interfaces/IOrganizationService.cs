using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services.Interfaces;

public interface IOrganizationService
{
    Task<List<Organization>> GetAllOrganizationsAsync(OrganizationQueryFilter organizationQueryFilter);
    Task<Organization?> GetOrganizationByIdAsync(string id);
    Task<Organization> CreateOrganizationAsync(Organization organization);
    Task<Organization?> UpdateOrganizationAsync(string id, Organization organization);
    Task<bool> DeleteOrganizationAsync(string id);
}