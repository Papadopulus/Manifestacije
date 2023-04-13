namespace Manifestacije.Api.Tests.E2E;

public sealed class ManifestacijeApiFactory : WebApplicationFactory<IApiMarker>, IAsyncLifetime
{
    private readonly IContainer _mongoDbContainer = new ContainerBuilder()
        .WithImage("mongo:4.4")
        .WithEnvironment("ASPNETCORE_ENVIRONMENT", "Production")
        .WithEnvironment("MONGO_INITDB_DATABASE", "manifestacije-test")
        .WithPortBinding(27019, 27017)
        .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(27017))
        .Build();

    public async Task InitializeAsync()
    {
        await _mongoDbContainer.StartAsync();
    }

    public new async Task DisposeAsync()
    {
        await _mongoDbContainer.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        var myConfiguration = new Dictionary<string, string>
        {
            { "MongoDbSettings:ConnectionString", "mongodb://localhost:27019" },
            { "MongoDbSettings:DatabaseName", "manifestacije-test" },
            { "MongoDbSettings:UsersCollectionName", "users" },
            { "MongoDbSettings:CategoriesCollectionName", "categories" }
        };

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(myConfiguration!)
            .Build();

        builder.ConfigureServices(services =>
        {
            var dbSettings = services.Where(x =>
                x is { Lifetime: ServiceLifetime.Singleton, ServiceType.FullName: not null } &&
                x.ServiceType.FullName.Contains("Manifestacije.Api.Database.DatabaseSettings")).ToImmutableList();

            foreach (var dbSetting in dbSettings)
            {
                services.Remove(dbSetting);
            }

            services.Configure<DatabaseSettings>(configuration.GetSection("MongoDbSettings"));
        });

        builder.UseEnvironment("Production");
    }
}