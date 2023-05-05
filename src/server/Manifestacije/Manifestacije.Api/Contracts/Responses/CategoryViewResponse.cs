namespace Manifestacije.Api.Contracts.Responses;

public sealed class CategoryViewResponse
{
    public required string Id { get; set; } 
    public required string Name { get; set; } 
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public string? CreatedByUserId { get; set; }
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public string? UpdatedByUserId { get; set; }
    public DateTime? DeletedAtUtc { get; set; }
    public string? DeletedByUserId { get; set; }
    public bool IsDeleted { get; set; } = false;
}