using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services.Interfaces;

public interface IPartnerService
{
    Task<List<Partner>> GetAllPartnersAsync(PartnerQueryFilter partnerQueryFilter);
    Task<Partner> CreatePartnerAsync(PartnerCreateRequest partnerCreateRequest);
    Task<Partner?> UpdatePartnerAsync(string id, PartnerUpdateRequest partnerUpdateRequest);
    Task<bool> DeletePartnerAsync(string id);
    Task<Partner?> GetPartnerByIdAsync(string id);
}