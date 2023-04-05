namespace Manifestacije.Api.Models;

public sealed class Partner : ModelBase
{
    public string Name { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
    public string Email { get; set; } = default!;
    public List<Location> Locations { get; set; } = new();
    public string Url { get; set; } = default!;//ovo ne kapiram!?
}