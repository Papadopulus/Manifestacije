namespace Manifestacije.Api.Database;

public sealed class DatabaseSettings
{
    public string ConnectionString { get; set; } = default!;
    public string DatabaseName { get; set; } = default!;
    public string UsersCollectionName { get; set; } = default!;
    public string LocationsCollectionName { get; set; } = default!;
    public string PartnersCollectionName { get; set; } = default!;
    public string CategoriesCollectionName { get; set; } = default!;
    public string OrganizationsCollectionName { get; set; } = default!;
}