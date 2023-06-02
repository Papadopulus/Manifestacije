using Manifestacije.Api.Models;

namespace Manifestacije.Api.Repositories.Interfaces;

public interface IEventRepository
{
    Task<bool> CreateEventAsync(Event eventToCreate);
    Task<bool> UpdateEventAsync(Event eventToUpdate);
    Task<Event?> GetEventByIdAsync(string id, bool includeDeleted = false);
    Task<List<Event>> GetEventsAsync(EventQueryFilter eventQueryFilter);
    Task<List<Event>> GetEventsAsync(List<string> ids, EventQueryFilter eventQueryFilter);
    Task<bool> DeleteEventAsync(string id);
}