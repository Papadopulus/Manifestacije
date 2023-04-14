using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services.Interfaces;

public interface ILocationService
{
    Task<List<Location>> GetAllLocationsAsync(LocationQueryFilter locationQueryFilter);
    Task<Location?> GetLocationByIdAsync(string id);
    Task<Location> CreateLocationAsync(LocationCreateRequest locationCreateRequest);
    Task<Location?> UpdateLocationAsync(string id, LocationUpdateRequest locationUpdateRequest);
    Task<bool> DeleteLocationAsync(string id);
}