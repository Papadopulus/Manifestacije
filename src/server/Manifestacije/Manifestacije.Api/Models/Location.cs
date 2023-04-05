namespace Manifestacije.Api.Models;

public sealed class Location : ModelBase
{
    public string Name { get; set; } = default!;
    // public List<Partner> Partners { get; set; } = new();
    public Partner AccommodationPartner { get; set; } = default!;
    public Partner TransportPartner { get; set; } = default!;
    public bool IsDeleted { get; set; } = false;
}