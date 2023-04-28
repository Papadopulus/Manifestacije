namespace Manifestacije.Api.Contracts.Requests;

public sealed class PartnerUpdateRequest
{
    public string Name { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
}