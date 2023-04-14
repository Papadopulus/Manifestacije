namespace Manifestacije.Api.Contracts.Requests;

public sealed class LocationCreateRequest
{
    public string Name { get; set; } = default!;
    public string? AccommodationPartnerId { get; set; }
    public string? TransportPartnerId { get; set; }
}