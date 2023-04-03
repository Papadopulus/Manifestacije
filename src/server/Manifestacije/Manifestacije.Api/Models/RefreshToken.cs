namespace Manifestacije.Api.Models;

public sealed class RefreshToken
{
    public string Token { get; set; } = default!;
    public DateTime ExpireDate { get; set; }
    public bool IsPasswordReset { get; set; } = false;
}