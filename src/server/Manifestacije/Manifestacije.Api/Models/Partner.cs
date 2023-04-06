namespace Manifestacije.Api.Models;

public sealed class Partner : ModelBase
{
    public string Name { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
    public string Email { get; set; } = default!;
    public List<LocationPartial> Locations { get; set; } = new();
    public string Url { get; set; } = default!;
    public bool IsDeleted { get; set; } = false;
    public bool IsUpsert { get; set; } = false;
}