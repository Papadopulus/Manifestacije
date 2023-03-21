namespace Manifestacije.Api.Contracts.Requests;

public class PasswordResetRequest
{
    public string Token { get; set; } = default!;
    public string Password { get; set; } = default!;
}