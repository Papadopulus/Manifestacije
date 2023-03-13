namespace Manifestacije.Api.Contracts.Requests;

public class UserUpdateRequest
{
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
}