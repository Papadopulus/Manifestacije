namespace Manifestacije.Api.Contracts.Responses;

public sealed class UserViewResponse
{
    public required string Id { get; set; } 
    public required string FirstName { get; set; } 
    public required string LastName { get; set; } 
    public required string Email { get; set; }
    public List<string> Roles { get; set; } = new();
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public string? CreatedByUserId { get; set; }
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public string? UpdatedByUserId { get; set; }
    public DateTime? DeletedAtUtc { get; set; }
    public string? DeletedByUserId { get; set; }
    public bool IsDeleted { get; set; } = false;
    public bool IsBlocked { get; set; } = false;
    public List<string> FavouriteEvents { get; set; } = new();
    public List<string> GoingEvents { get; set; } = new();
}