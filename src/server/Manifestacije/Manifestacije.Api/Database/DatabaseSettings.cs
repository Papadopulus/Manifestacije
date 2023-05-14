namespace Manifestacije.Api.Database;

public sealed class DatabaseSettings
{
    public required string ConnectionString { get; set; }
    public required string DatabaseName { get; set; }
    public required string UsersCollectionName { get; set; }
    public required string LocationsCollectionName { get; set; }
    public required string PartnersCollectionName { get; set; }
    public required string CategoriesCollectionName { get; set; }
    public required string OrganizationsCollectionName { get; set; }
    public required string EventsCollectionName { get; set; }
    public required string ReviewsCollectionName { get; set; }
}