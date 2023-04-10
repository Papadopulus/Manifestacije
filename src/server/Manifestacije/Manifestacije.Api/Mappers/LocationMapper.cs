using Riok.Mapperly.Abstractions;
using Manifestacije.Api.Models;

namespace Manifestacije.Api.Mappers;

[Mapper]
public static partial class LocationMapper
{
    public static partial Location LocationCreateRequestToLocation(LocationCreateRequest locationCreateRequest);
    public static partial LocationViewResponse LocationToViewResponse(Location location);
    public static partial LocationPartial LocationToLocationPartial(Location location);
    public static partial IEnumerable<LocationViewResponse> LocationToViewResponseEnumerable(
        IEnumerable<Location> location);

}