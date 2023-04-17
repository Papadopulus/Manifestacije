using Manifestacije.Api.Exceptions;
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
        var existingOrganization = await _organizationRepository.GetOrganizationByNameAsync(organization.Name);
        if (existingOrganization is not null)
        {
            throw new InvalidInputException($"Organization with name {organization.Name} already exists");
        }
        
        await _organizationRepository.CreateOrganizationAsync(organization);
        return organization;
    }

    public async Task<Organization?> UpdateOrganizationAsync(string id, Organization organization)
    {
        var existingOrganization = await _organizationRepository.GetOrganizationByIdAsync(id);
        if (existingOrganization is null)
        {
            throw new NotFoundException($"Organization with id {id} does not exist");
        }
        
        existingOrganization.Name = organization.Name;
        existingOrganization.Description = organization.Description;
        existingOrganization.FacebookUrl = organization.FacebookUrl;
        existingOrganization.InstagramUrl = organization.InstagramUrl;
        existingOrganization.TwitterUrl = organization.TwitterUrl;
        existingOrganization.WebsiteUrl = organization.WebsiteUrl;
        existingOrganization.LogoUrl = organization.LogoUrl;
        
        await _organizationRepository.UpdateOrganizationAsync(existingOrganization);
        return existingOrganization;
    }

    public async Task<bool> DeleteOrganizationAsync(string id)
    {
        var existingOrganization = await _organizationRepository.GetOrganizationByIdAsync(id);
        if (existingOrganization is null)
        {
            throw new NotFoundException($"Organization with id {id} does not exist");
        }
        
        existingOrganization.IsDeleted = true;
        existingOrganization.DeletedAtUtc = DateTime.UtcNow;
        return await _organizationRepository.UpdateOrganizationAsync(existingOrganization);
    }
}