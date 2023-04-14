using Manifestacije.Api.Models;

namespace Manifestacije.Api.Repositories;

public sealed class OrganizationRepository : IOrganizationRepository
{
    public async Task<List<Organization>> GetAllOrganizationsAsync(OrganizationQueryFilter organizationQueryFilter)
    {
        throw new NotImplementedException();
    }

    public async Task<Organization?> GetOrganizationByIdAsync(string id, bool includeDeleted = false)
    {
        throw new NotImplementedException();
    }

    public async Task<Organization?> GetOrganizationWithNameAsync(string name, bool includeDeleted = false)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> CreateOrganizationAsync(Organization organization)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> UpdateOrganizationAsync(Organization organization)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> DeleteOrganizationAsync(string id)
    {
        throw new NotImplementedException();
    }
}