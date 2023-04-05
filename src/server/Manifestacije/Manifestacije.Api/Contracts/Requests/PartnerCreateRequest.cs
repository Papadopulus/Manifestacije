namespace Manifestacije.Api.Contracts.Requests;

public class PartnerCreateRequest
{
    public string Name { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Url { get; set; } = default!;
    public List<string> Locations { get; set; } = default!;
    // Ovo pogledaj LocationService 38 linija ista je logika
}