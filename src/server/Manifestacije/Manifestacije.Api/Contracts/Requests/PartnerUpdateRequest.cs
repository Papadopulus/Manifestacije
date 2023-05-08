namespace Manifestacije.Api.Contracts.Requests;

public sealed class PartnerUpdateRequest
{
    public required string Name { get; set; } 
    public required string PhoneNumber { get; set; } 
}