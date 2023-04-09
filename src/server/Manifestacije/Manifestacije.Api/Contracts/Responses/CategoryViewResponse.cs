namespace Manifestacije.Api.Contracts.Responses;

public sealed class CategoryViewResponse
{
    public string Id { get; set; } = default!;
    public string Name { get; set; } = default!;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public string? CreatedByUserId { get; set; } = null;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public string? UpdatedByUserId { get; set; } = null;
    public DateTime? DeletedAtUtc { get; set; } = null;
    public string? DeletedByUserId { get; set; } = null;
    public bool IsDeleted { get; set; } = false;
}