namespace Manifestacije.Api.Models;

public sealed class Location : ModelBase
{
    public required string Name { get; set; } 
    public PartnerPartial? AccommodationPartner { get; set; }
    public PartnerPartial? TransportPartner { get; set; }
}