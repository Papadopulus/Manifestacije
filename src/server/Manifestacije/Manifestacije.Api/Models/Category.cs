namespace Manifestacije.Api.Models;

public sealed class Category:ModelBase
{
    public string Name { get; set; } = default!;
    public bool IsDeleted { get; set; } = false;
}