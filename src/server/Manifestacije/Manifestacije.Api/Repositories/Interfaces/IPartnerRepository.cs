using Manifestacije.Api.Models;

namespace Manifestacije.Api.Repositories.Interfaces;

public interface IPartnerRepository
{
    Task<List<Partner>> GetAllPartnersAsync(PartnerQueryFilter partnerQueryFilter);
    Task<bool> CreatePartnerAsync(Partner partner);
    Task<bool> DeletePartnerAsync(string id);
    Task<bool> UpdatePartnerAsync(Partner partner);
    Task<Partner?> GetPartnerByIdAsync(string id);

    Task<Partner?> GetPartnerByNameAsync(string name, bool includeDeleted = false);
    Task<Partner?> GetPartnerByLocationAsync(string locationId, bool transport = false, bool accommodation = false);
}