namespace Manifestacije.Api.Contracts.Requests;

public sealed class UserUpdateRequest
{
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
}