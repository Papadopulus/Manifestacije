namespace Manifestacije.Api.Models;

public sealed class OrganizationPartial
{
    public string Id { get; set; } = default!;
    public required string Name { get; set; }
}