using Manifestacije.Api.Exceptions;
using Manifestacije.Api.Mappers;
using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services;

public class EventService : IEventService
{
    private readonly IEventRepository _eventRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IOrganizationRepository _organizationRepository;
    private readonly ILocationRepository _locationRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPartnerRepository _partnerRepository;

    public EventService(IEventRepository eventRepository,
        ICategoryRepository categoryRepository,
        IOrganizationRepository organizationRepository,
        ILocationRepository locationRepository,
        IUserRepository userRepository,
        IPartnerRepository partnerRepository)
    {
        _eventRepository = eventRepository;
        _categoryRepository = categoryRepository;
        _organizationRepository = organizationRepository;
        _locationRepository = locationRepository;
        _userRepository = userRepository;
        _partnerRepository = partnerRepository;
    }

    public async Task<Event> CreateEventAsync(EventCreateRequest eventCreateRequest, string userId)
    {
        var eventToCreate = EventMapper.EventCreateRequestToEvent(eventCreateRequest);

        eventToCreate.Category = CategoryMapper.CategoryToCategoryPartial(
            await _categoryRepository.GetCategoryByIdAsync(eventCreateRequest.CategoryId) ??
            throw new NotFoundException(
                $"There is no category with the id of: {eventCreateRequest.CategoryId}"));

        var organizationId = (await _userRepository.GetUserByIdAsync(userId))?.Organization?.Id ??
                             throw new NotFoundException($"There is no user with the id of: {userId}");

        eventToCreate.Organization = OrganizationMapper.OrganizationToOrganizationPartial(
            await _organizationRepository.GetOrganizationByIdAsync(organizationId) ??
            throw new NotFoundException(
                $"There is no organization with the id of: {organizationId}"));

        eventToCreate.Location = LocationMapper.LocationToLocationPartial(
            await _locationRepository.GetLocationByIdAsync(eventCreateRequest.LocationId) ??
            throw new NotFoundException(
                $"There is no location with the id of: {eventCreateRequest.LocationId}"));

        eventToCreate.AccommodationPartner = PartnerMapper.PartnerToPartnerPartial(
            await _partnerRepository.GetPartnerByLocationAsync(eventCreateRequest.LocationId, false, true) ??
            throw new NotFoundException(
                $"There is no accommodation partner for the location with the id of: {eventCreateRequest.LocationId}"));
 
        eventToCreate.TransportPartner = PartnerMapper.PartnerToPartnerPartial(
            await _partnerRepository.GetPartnerByLocationAsync(eventCreateRequest.LocationId, true, false) ??
            throw new NotFoundException(
                $"There is no transport partner for the location with the id of: {eventCreateRequest.LocationId}"));

        await _eventRepository.CreateEventAsync(eventToCreate);
        return eventToCreate;
    }

    public async Task<Event?> UpdateEventAsync(string id,
        EventUpdateRequest eventUpdateRequest,
        string userId)
    {
        var eventToUpdate = await _eventRepository.GetEventByIdAsync(id);
        var organizationId = (await _userRepository.GetUserByIdAsync(userId))?.Organization?.Id ??
                             throw new NotFoundException($"There is no user with the id of: {userId}");
        
        if (eventToUpdate is null || eventToUpdate.Organization.Id != organizationId)
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

    public async Task<List<Event>> GetEventsAsync(EventQueryFilter eventQueryFilter)
    {
        return await _eventRepository.GetEventsAsync(eventQueryFilter);
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