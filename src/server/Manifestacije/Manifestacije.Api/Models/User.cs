namespace Manifestacije.Api.Models;

public sealed class User : ModelBase
{
    public required string FirstName { get; set; } 
    public required string LastName { get; set; } 
    public required string Email { get; set; } 
    public required string PasswordHash { get; set; } 
    public required string PasswordSalt { get; set; } 
    public List<RefreshToken> RefreshTokens { get; set; } = new();
    public bool IsBlocked { get; set; } = false;
    public List<string> Roles { get; set; } = new();
    public List<string> FavouriteEvents { get; set; } = new();
    public List<string> GoingEvents { get; set; } = new();
}