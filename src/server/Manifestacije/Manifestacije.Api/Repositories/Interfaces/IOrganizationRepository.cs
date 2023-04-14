using Manifestacije.Api.Models;

namespace Manifestacije.Api.Repositories.Interfaces;

public interface IOrganizationRepository
{
    Task<List<Organization>> GetAllOrganizationsAsync(OrganizationQueryFilter organizationQueryFilter);
    Task<Organization?> GetOrganizationByIdAsync(string id, bool includeDeleted = false);
    Task<Organization?> GetOrganizationWithNameAsync(string name, bool includeDeleted = false);
    Task<bool> CreateOrganizationAsync(Organization organization);
    Task<bool> UpdateOrganizationAsync(Organization organization);
    Task<bool> DeleteOrganizationAsync(string id);
}