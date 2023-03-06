namespace Manifestacije.Api.Contracts.Requests;

public class RefreshTokenRequest
{
    public string Token { get; set; } = default!;
}