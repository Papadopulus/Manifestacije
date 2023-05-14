namespace Manifestacije.Api.Tests.Integration;

public class LocationRepositoryTests : IClassFixture<ManifestacijeApiFactory>
{
    private readonly LocationRepository _sut;

    public LocationRepositoryTests(ManifestacijeApiFactory factory)
    {
        factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
        var databaseSettings = Options.Create(new DatabaseSettings
        {
            ConnectionString = "mongodb://localhost:27018",
            DatabaseName = "manifestacije-test",
            LocationsCollectionName = "locations",
            UsersCollectionName = null,
            PartnersCollectionName = null,
            CategoriesCollectionName = null,
            OrganizationsCollectionName = null,
            EventsCollectionName = null,
            ReviewsCollectionName = null
        });
        _sut = new LocationRepository(databaseSettings);
    }

    private static LocationQueryFilter CreateLocationQueryFilter(
        int pageNumber = 1,
        int pageSize = 10,
        string? sortColumn = null,
        string? sortDirection = "asc",
        string? name = null,
        DateTime? minCreatedAtUtc = null,
        DateTime? maxCreatedAtUtc = null,
        bool intersection = true,
        bool showDeleted = false)
    {
        return new LocationQueryFilter
        {
            PageSize = pageSize,
            PageNumber = pageNumber,
            SortColumn = sortColumn,
            SortDirection = sortDirection,
            Intersection = intersection,
            ShowDeleted = showDeleted,
            Name = name
        };
    }

    [Fact]
    public async Task GetAllLocationsAsync_ShouldReturnEmptyList_WhenNoLocationsExists()
    {
        // Arrange
        var locationsQueryFilter = CreateLocationQueryFilter(name: "AleksaSef");
        // Act
        var result = await _sut.GetAllLocationsAsync(locationsQueryFilter);
        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllLocationsAsync_ShouldReturnLocationList_WhenLocaionsExists()
    {
        // Arrange
        var locationsQueryFilter = CreateLocationQueryFilter(name: "lokacijaMoja", intersection: false);
        var location1 = new Location
        {
            Name = "lokacijaMoja"
        };
        var location2 = new Location
        {
            Name = "lokacijaMoja"
        };
        await _sut.CreateLocationAsync(location1);
        await _sut.CreateLocationAsync(location2);
        // Act
        var result = await _sut.GetAllLocationsAsync(locationsQueryFilter);
        // Assert
        result.Should().HaveCount(2);
        result.Should().ContainEquivalentOf(location1, TestHelpers.Config<Location>());
        result.Should().ContainEquivalentOf(location2, TestHelpers.Config<Location>());
    }

    [Fact]
    public async Task GetLocationById_ShouldReturnNull_WhenNoLocationsExists()
    {
        // Arrange
        var categoryId = "642c2c29364bc2e1aa766056";
        // Act
        var result = await _sut.GetLocationByIdAsync(categoryId);
        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetLocationById_ShouldReturnLocation_WhenLocationsExists()
    {
        // Arrange
        var location = new Location
        {
            Name = "locationDummy"
        };
        await _sut.CreateLocationAsync(location);
        // Act
        var result = await _sut.GetLocationByIdAsync(location.Id);
        // Assert
        result.Should()
            .BeEquivalentTo(location, TestHelpers.Config<Location>());
    }

    [Fact]
    public async Task GetLocationByName_ShouldReturnNull_WhenLocationDoesntExists()
    {
        // Arrange
        var name = "skladjskajdkla";
        // Act
        var result = await _sut.GetLocationByNameAsync(name);
        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetLocationByName_ShouldReturnLocation_WhenLocationWithNameExists()
    {
        // Arrange
        var location = new Location
        {
            Name = "locationDummy"
        };
        await _sut.CreateLocationAsync(location);
        // Act
        var result = await _sut.GetLocationByNameAsync(location.Name);
        // Assert
        result.Should()
            .BeEquivalentTo(location, TestHelpers.Config<Location>());
    }

    [Fact]
    public async Task CreateLocationAsync_ShouldCreateLocation_WhenLocationIsValid()
    {
        // Arrange
        var location = new Location
        {
            Name = "locationDummy"
        };
        
        // Act
        var result = await _sut.CreateLocationAsync(location);
        
        // Assert
        result.Should()
            .BeTrue();
    }

    [Fact]
    public async Task UpdateLocation_ShouldUpdateLocation_WhenLocationIsValid()
    {
        // Arrange
        var location = new Location
        {
            Name = "locationDummy"
        };

        await _sut.CreateLocationAsync(location);
        location.Name = "newLocation";
        
        // Act
        var result = await _sut.UpdateLocationAsync(location);
        var newLocation = await _sut.GetLocationByIdAsync(location.Id);
        
        // Assert
        result.Should().BeTrue();
        newLocation.Should().NotBeNull();
        newLocation!.Name.Should().Be("newLocation");
    }

    [Fact]
    public async Task DeleteLocationAsync_ShouldDeleteLocation_WhenLocationExists()
    {
        // Arrange
        var location = new Location
        {
            Name = "locationProba"
        };
        await _sut.CreateLocationAsync(location);

        // Act
        var result = await _sut.DeleteLocationAsync(location.Id);
        var newLocation = await _sut.GetLocationByIdAsync(location.Id, true);

        // Assert
        result.Should().BeTrue();
        newLocation.Should().NotBeNull();
        newLocation!.IsDeleted.Should().BeTrue();
    }
}