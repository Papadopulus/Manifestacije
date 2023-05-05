namespace Manifestacije.Api.Database;

public sealed class DatabaseSettings
{
    public string ConnectionString { get; set; } 
    public string DatabaseName { get; set; } 
    public string UsersCollectionName { get; set; } 
    public string LocationsCollectionName { get; set; } 
    public string PartnersCollectionName { get; set; } 
    public string CategoriesCollectionName { get; set; } 
    public string OrganizationsCollectionName { get; set; } 
}