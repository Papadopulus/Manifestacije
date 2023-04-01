namespace Manifestacije.Api.Contracts.Requests;

public sealed class PasswordResetRequest
{
    public string Token { get; set; } = default!;
    public string Password { get; set; } = default!;
}