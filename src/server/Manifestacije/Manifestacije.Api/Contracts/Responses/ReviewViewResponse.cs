using Manifestacije.Api.Models;

namespace Manifestacije.Api.Contracts.Responses;

public class ReviewViewResponse
{
    public string Id { get; set; } = default!;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAtUtc { get; set; } = null;
    public bool IsDeleted { get; set; } = false;
    public EventPartial Event { get; set; } = default!;
    public ushort OrganizationRating { get; set; }
    public ushort EventRating { get; set; }
    public string? Comment { get; set; }
    public UserPartial User { get; set; } = default!;
}