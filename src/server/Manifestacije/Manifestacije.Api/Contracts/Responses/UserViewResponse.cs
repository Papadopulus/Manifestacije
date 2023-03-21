﻿namespace Manifestacije.Api.Contracts.Responses;

public class UserViewResponse
{
    public string Id { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public List<string> Roles { get; set; } = default!;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public string? CreatedByUserId { get; set; } = null;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public string? UpdatedByUserId { get; set; } = null;
    public DateTime? DeletedAtUtc { get; set; } = null;
    public string? DeletedByUserId { get; set; } = null;
    public bool IsDeleted { get; set; } = false;
    public bool IsBlocked { get; set; } = false;
    public List<string> FavouriteEvents { get; set; } = new();
    public List<string> GoingEvents { get; set; } = new();
}