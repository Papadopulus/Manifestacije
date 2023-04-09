namespace Manifestacije.Api.Database;

public sealed class DatabaseSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string UsersCollectionName { get; set; } = null!;
    public string CategoriesCollectionName { get; set; } = default!;
}