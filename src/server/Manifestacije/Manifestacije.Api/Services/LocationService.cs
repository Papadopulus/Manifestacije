using Manifestacije.Api.Exceptions;
using Manifestacije.Api.Models;
using Manifestacije.Api.Mappers;

namespace Manifestacije.Api.Services;

public sealed class LocationService : ILocationService
{
    private readonly ILocationRepository _locationRepository;
    private readonly IPartnerRepository _partnerRepository;
    private readonly string _secret;

    public LocationService(ILocationRepository locationRepository,
        IPartnerRepository partnerRepository,
        IConfiguration configuration)
    {
        _secret = configuration["Authorization:Secret"]!;
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
        var existingLocation = await _locationRepository.GetLocationByName(locationCreateRequest.Name);
        if (existingLocation is not null)
        {
            throw new InvalidInputException("Location with a given name already exists");
        }

        var location = LocationMapper.LocationCreateRequestToLocation(locationCreateRequest);
        if (locationCreateRequest.TransportPartnerId is not null)
        {
            var partner = await _partnerRepository.GetPartnerByIdAsync(locationCreateRequest.TransportPartnerId);
            // TODO: Create new Exception
            if (partner is null)
                throw new DatabaseException("Partner with a given id does not exist");

            location.TransportPartner = PartnerMapper.PartnerToPartnerPartial(partner);
        }

        if (locationCreateRequest.AccommodationPartnerId is not null)
        {
            var partner = await _partnerRepository.GetPartnerByIdAsync(locationCreateRequest.AccommodationPartnerId);
            // TODO: Create new Exception
            if (partner is null)
                throw new DatabaseException("Partner with a given id does not exist");

            location.AccommodationPartner = PartnerMapper.PartnerToPartnerPartial(partner);
        }

        var success = await _locationRepository.CreateLocationAsync(location);
        if (!success)
        {
            throw new DatabaseException("Failed to create location");
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

        //waiting 
        existingLocation.Name = locationUpdateRequest.Name;
        existingLocation.UpdatedAtUtc = DateTime.Now;
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
}