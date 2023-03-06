namespace Manifestacije.Api.Contracts.QueryFilters;

public class UserQueryFilter : QueryFilterBase
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
}