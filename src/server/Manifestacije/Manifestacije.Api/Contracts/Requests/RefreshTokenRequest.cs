namespace Manifestacije.Api.Contracts.Requests;

public sealed class RefreshTokenRequest
{
    public string Token { get; set; } = default!;
}