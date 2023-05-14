using Manifestacije.Api.Models;
using Riok.Mapperly.Abstractions;

namespace Manifestacije.Api.Mappers;

[Mapper]
public static partial class EventMapper
{
    public static partial Event EventCreateRequestToEvent(EventCreateRequest eventCreateRequest);
    public static partial Event EventUpdateRequestToEvent(EventUpdateRequest eventCreateRequest);
    public static partial EventPartial EventToEventPartial(Event eventPartial);
    public static partial EventViewResponse EventToEventViewResponse(Event eventToMap);
    public static partial List<EventViewResponse> EventListToEventViewResponseList(List<Event> events);
}