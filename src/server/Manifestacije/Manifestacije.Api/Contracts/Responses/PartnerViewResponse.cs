using Manifestacije.Api.Models;

namespace Manifestacije.Api.Contracts.Responses;

public class PartnerViewResponse
{
    public string Id { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
    public string Url { get; set; } = default!;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public string? CreatedByUserId { get; set; } = null;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public string? UpdatedByUserId { get; set; } = null;
    public DateTime? DeletedAtUtc { get; set; } = null;
    public string? DeletedByUserId { get; set; } = null;
    public bool IsDeleted { get; set; } = false;
}