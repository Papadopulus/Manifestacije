namespace Manifestacije.Api.Models;

public sealed class Review : ModelBase
{
    public EventPartial Event { get; set; } = default!;
    public ushort OrganizationRating { get; set; }
    public ushort EventRating { get; set; }
    public string? Comment { get; set; }
    public UserPartial User { get; set; } = default!;
}