using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services.Interfaces;

public interface IEventService
{
    Task<Event> CreateEventAsync(EventCreateRequest eventCreateRequest, string userId);
    Task<Event?> UpdateEventAsync(string id, EventUpdateRequest eventUpdateRequest, string userId);
    Task<Event?> GetEventByIdAsync(string id);
    Task<List<Event>> GetEventsAsync(EventQueryFilter queryFilter);
    Task<bool> DeleteEventAsync(string id);
    Task<bool> SponsorEventAsync(string id);
}