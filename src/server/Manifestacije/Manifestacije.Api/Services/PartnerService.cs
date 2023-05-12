using Manifestacije.Api.Exceptions;
using Manifestacije.Api.Mappers;
using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services;

public sealed class PartnerService : IPartnerService
{
    private readonly ILocationRepository _locationRepository;
    private readonly IPartnerRepository _partnerRepository;

    public PartnerService(IPartnerRepository partnerRepository,
        ILocationRepository locationRepository)
    {
        _partnerRepository = partnerRepository;
        _locationRepository = locationRepository;
    }

    public async Task<List<Partner>> GetAllPartnersAsync(PartnerQueryFilter partnerQueryFilter)
    {
        return await _partnerRepository.GetAllPartnersAsync(partnerQueryFilter);
    }

    public async Task<Partner> CreatePartnerAsync(PartnerCreateRequest partnerCreateRequest)
    {
        var existingPartner = await _partnerRepository.GetPartnerByNameAsync(partnerCreateRequest.Name);
        if (existingPartner is not null)
        {
            throw new InvalidInputException("Partner with a given name already exists");
        }

        var partner = PartnerMapper.PartnerCreateRequestToPartner(partnerCreateRequest);

        var success = await _partnerRepository.CreatePartnerAsync(partner);
        if (!success)
        {
            throw new DatabaseException("Failed to create Partner");
        }

        return partner;
    }

    public async Task<Partner?> UpdatePartnerAsync(string id, PartnerUpdateRequest partnerUpdateRequest)
    {
        var existingPartner = await _partnerRepository.GetPartnerByIdAsync(id);
        if (existingPartner is null)
        {
            return null;
        }

        existingPartner.Name = partnerUpdateRequest.Name;
        existingPartner.PhoneNumber = partnerUpdateRequest.PhoneNumber;
        existingPartner.UpdatedAtUtc = DateTime.UtcNow;
        existingPartner.IsTransport = partnerUpdateRequest.IsTransport;
        existingPartner.IsAccommodation = partnerUpdateRequest.IsAccommodation;

        var success = await _partnerRepository.UpdatePartnerAsync(existingPartner);
        if (!success)
        {
            throw new DatabaseException("Failed to update Partner");
        }

        return existingPartner;
    }

    public async Task<bool> DeletePartnerAsync(string id)
    {
        var existingPartner = await _partnerRepository.GetPartnerByIdAsync(id);
        if (existingPartner is null)
        {
            return false;
        }

        existingPartner.IsDeleted = true;
        existingPartner.DeletedAtUtc = DateTime.UtcNow;
        return await _partnerRepository.UpdatePartnerAsync(existingPartner);
    }

    public async Task<Partner?> GetPartnerByIdAsync(string id)
    {
        return await _partnerRepository.GetPartnerByIdAsync(id);
    }
}