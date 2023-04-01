namespace Manifestacije.Api.Contracts.Requests;

public sealed class AuthenticateRequest
{
    public string Email { get; init; } = default!;
    public string Password { get; init; } = default!;
}