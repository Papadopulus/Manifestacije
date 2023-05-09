using Manifestacije.Api.Mappers;
using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services;

public class EventService : IEventService
{
    private readonly IEventRepository _eventRepository;

    public EventService(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }
    
    public async Task<Event> CreateEventAsync(EventCreateRequest eventCreateRequest)
    {
        var eventToCreate = EventMapper.EventCreateRequestToEvent(eventCreateRequest);
        await _eventRepository.CreateEventAsync(eventToCreate);
        return eventToCreate;
    }

    public async Task<Event?> UpdateEventAsync(string id, EventUpdateRequest eventUpdateRequest)
    {
        var eventToUpdate = await _eventRepository.GetEventByIdAsync(id);
        
        if (eventToUpdate is null)
        {
            return null;
        }
        
        eventToUpdate.Title = eventUpdateRequest.Title;
        eventToUpdate.Description = eventUpdateRequest.Description;
        eventToUpdate.StartingDate = eventUpdateRequest.StartingDate;
        eventToUpdate.EndingDate = eventUpdateRequest.EndingDate;
        eventToUpdate.ImageUrls = eventUpdateRequest.ImageUrls;
        eventToUpdate.Guests = eventUpdateRequest.Guests;
        eventToUpdate.Competitors = eventUpdateRequest.Competitors;
        eventToUpdate.Capacity = eventUpdateRequest.Capacity;
        eventToUpdate.TicketPrice = eventUpdateRequest.TicketPrice;
        eventToUpdate.TicketUrl = eventUpdateRequest.TicketUrl;
        eventToUpdate.Sponsors = eventUpdateRequest.Sponsors;
        eventToUpdate.Street = eventUpdateRequest.Street;
        eventToUpdate.Latitude = eventUpdateRequest.Latitude;
        eventToUpdate.Longitude = eventUpdateRequest.Longitude;
        
        await _eventRepository.UpdateEventAsync(eventToUpdate);
        return eventToUpdate;
    }

    public async Task<Event?> GetEventByIdAsync(string id)
    {
        return await _eventRepository.GetEventByIdAsync(id);
    }

    public async Task<List<Event>> GetEventsAsync(EventQueryFilter queryFilter)
    {
        return await _eventRepository.GetEventsAsync(queryFilter);
    }

    public async Task<bool> DeleteEventAsync(string id)
    {
        var eventToDelete = await _eventRepository.GetEventByIdAsync(id);

        if (eventToDelete is null)
            return false;

        return await _eventRepository.DeleteEventAsync(id);
    }

    public async Task<bool> SponsorEventAsync(string id)
    {
        var eventToUpdate = await _eventRepository.GetEventByIdAsync(id);
        
        if (eventToUpdate is null)
            return false;

        if (eventToUpdate.Sponsored)
            return true;
        
        eventToUpdate.Sponsored = true;
        return await _eventRepository.UpdateEventAsync(eventToUpdate);
    }
}