namespace Manifestacije.Api.Contracts.Responses;

public sealed class TokenResponse
{
    public string Token { get; set; } = default!;
    public string RefreshToken { get; set; } = default!;
}