namespace Manifestacije.Api.Models;

public sealed class Location : ModelBase
{
    public string Name { get; set; } = default!;
    public PartnerPartial? AccommodationPartner { get; set; }
    public PartnerPartial? TransportPartner { get; set; }
}