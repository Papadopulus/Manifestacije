using Manifestacije.Api.Exceptions;
using Manifestacije.Api.Mappers;
using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services;

public sealed class LocationService : ILocationService
{
    private readonly ILocationRepository _locationRepository;
    private readonly IPartnerRepository _partnerRepository;

    public LocationService(ILocationRepository locationRepository,
        IPartnerRepository partnerRepository)
    {
        _locationRepository = locationRepository;
        _partnerRepository = partnerRepository;
    }

    public async Task<List<Location>> GetAllLocationsAsync(LocationQueryFilter locationQueryFilter)
    {
        return await _locationRepository.GetAllLocationsAsync(locationQueryFilter);
    }

    public async Task<Location?> GetLocationByIdAsync(string id)
    {
        return await _locationRepository.GetLocationByIdAsync(id);
    }

    public async Task<Location> CreateLocationAsync(LocationCreateRequest locationCreateRequest)
    {
        var existingLocation = await _locationRepository.GetLocationByNameAsync(locationCreateRequest.Name);
        if (existingLocation is not null)
        {
            throw new InvalidInputException("Location with a given name already exists");
        }

        var location = LocationMapper.LocationCreateRequestToLocation(locationCreateRequest);
        var partners = await AddPartners(locationCreateRequest.AccommodationPartnerId, locationCreateRequest.TransportPartnerId, location);

        var success = await _locationRepository.CreateLocationAsync(location);
        if (!success)
        {
            throw new DatabaseException("Failed to create location");
        }

        foreach (var partner in partners)
        {
            partner.Locations.Add(LocationMapper.LocationToLocationPartial(location));
            await _partnerRepository.UpdatePartnerAsync(partner);
        }

        return location;
    }

    public async Task<Location?> UpdateLocationAsync(string id, LocationUpdateRequest locationUpdateRequest)
    {
        var existingLocation = await _locationRepository.GetLocationByIdAsync(id);
        if (existingLocation is null)
        {
            return null;
        }

        existingLocation.Name = locationUpdateRequest.Name;
        existingLocation.UpdatedAtUtc = DateTime.Now;
        
        var partners = await AddPartners(locationUpdateRequest.AccommodationPartnerId, locationUpdateRequest.TransportPartnerId,
            existingLocation);
        
        foreach (var partner in partners)
        {
            partner.Locations.Add(LocationMapper.LocationToLocationPartial(existingLocation));
            await _partnerRepository.UpdatePartnerAsync(partner);
        }

        var success = await _locationRepository.UpdateLocationAsync(existingLocation);
        if (!success)
        {
            throw new DatabaseException("Failed to update Location");
        }

        return existingLocation;
    }

    public async Task<bool> DeleteLocationAsync(string id)
    {
        var existingLocation = await _locationRepository.GetLocationByIdAsync(id);
        if (existingLocation is null)
        {
            return false;
        }

        existingLocation.IsDeleted = true;
        existingLocation.DeletedAtUtc = DateTime.Now;
        return await _locationRepository.UpdateLocationAsync(existingLocation);
    }
    
    private async Task<List<Partner>> AddPartners(string? accommodationPartnerId, 
        string? transportPartnerId,
        Location location)
    {
        var partners = new List<Partner>();
        if (transportPartnerId is not null)
        {
            var partner = await _partnerRepository.GetPartnerByIdAsync(transportPartnerId);
            if (partner is null)
            {
                throw new NotFoundException("Partner with a given id does not exist");
            }

            location.TransportPartner = PartnerMapper.PartnerToPartnerPartial(partner);
            partners.Add(partner);
        }

        if (accommodationPartnerId is not null)
        {
            var partner = await _partnerRepository.GetPartnerByIdAsync(accommodationPartnerId);
            if (partner is null)
            {
                throw new NotFoundException("Partner with a given id does not exist");
            }

            location.AccommodationPartner = PartnerMapper.PartnerToPartnerPartial(partner);
            partners.Add(partner);
        }

        return partners;
    }
}