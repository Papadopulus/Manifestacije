using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services;

public sealed class OrganizationService : IOrganizationService
{
    private readonly IOrganizationRepository _organizationRepository;

    public OrganizationService(IOrganizationRepository organizationRepository)
    {
        _organizationRepository = organizationRepository;
    }
    
    public async Task<List<Organization>> GetAllOrganizationsAsync(OrganizationQueryFilter organizationQueryFilter)
    {
        return await _organizationRepository.GetAllOrganizationsAsync(organizationQueryFilter);
    }

    public async Task<Organization?> GetOrganizationByIdAsync(string id)
    {
        return await _organizationRepository.GetOrganizationByIdAsync(id);
    }

    public async Task<Organization> CreateOrganizationAsync(Organization organization)
    {
        throw new NotImplementedException();
    }

    public async Task<Organization?> UpdateOrganizationAsync(string id, Organization organization)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> DeleteOrganizationAsync(string id)
    {
        return await _organizationRepository.DeleteOrganizationAsync(id);
    }
}