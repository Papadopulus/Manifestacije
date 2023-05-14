namespace Manifestacije.Api.Tests.Integration;

public class PartnerRepositoryTests : IClassFixture<ManifestacijeApiFactory>
{
    private readonly PartnerRepository _sut;

    public PartnerRepositoryTests(ManifestacijeApiFactory factory)
    {
        factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
        var databaseSettings = Options.Create(new DatabaseSettings
        {
            ConnectionString = "mongodb://localhost:27018",
            DatabaseName = "manifestacije-test",
            PartnersCollectionName = "partners",
            UsersCollectionName = null,
            LocationsCollectionName = null,
            CategoriesCollectionName = null,
            OrganizationsCollectionName = null,
            EventsCollectionName = null,
            ReviewsCollectionName = null
        });

        _sut = new PartnerRepository(databaseSettings);
    }
    
    private static PartnerQueryFilter CreatePartnerFilter(
        int pageNumber = 1,
        int pageSize = 10,
        string? sortColumn = null,
        string? sortDirection = "asc",
        string? name = null,
        bool intersection = true,
        bool showDeleted = false)
    {
        return new PartnerQueryFilter
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            SortColumn = sortColumn,
            SortDirection = sortDirection,
            Name = name,
            Intersection = intersection,
            ShowDeleted = showDeleted
        };
    }
    
    [Fact]
    public async Task GetAllPartnersAsync_ShouldReturnEmptyList_WhenNoPartnersExist()
    {
        // Arrange
        var partnerQueryFilter = CreatePartnerFilter(name: "Milos Obilic");

        // Act
        var result = await _sut.GetAllPartnersAsync(partnerQueryFilter);

        // Assert
        result.Should().BeEmpty();
    }
    
    [Fact]
    public async Task GetAllPartnersAsync_ShouldReturnAllPartners_WhenPartnersExist()
    {
        // Arrange
        var partnerQueryFilter = CreatePartnerFilter(name: "John", intersection: false);
        var partner1 = new Partner
        {
            Name = "John",
            Email = "",
            PhoneNumber = null,
            Url = null
        };
        var partner2 = new Partner
        {
            Name = "John 3",
            Email = "",
            PhoneNumber = null,
            Url = null
        };
        await _sut.CreatePartnerAsync(partner1);
        await _sut.CreatePartnerAsync(partner2);

        // Act
        var result = await _sut.GetAllPartnersAsync(partnerQueryFilter);

        // Assert
        result.Should().HaveCount(2);
    }
    
    [Fact]
    public async Task CreatePartner_ShouldReturnTrue_WhenPartnerIsCreated()
    {
        // Arrange
        var partner = new Partner
        {
            Name = "CocaCola",
            Email = "",
            PhoneNumber = null,
            Url = null
        };

        // Act
        var result = await _sut.CreatePartnerAsync(partner);

        // Assert
        result.Should().BeTrue();
    }
    
    [Fact]
    public async Task DeletePartner_ShouldReturnTrue_WhenPartnerExists()
    {
        // Arrange
        var partner = new Partner
        {
            Name = "Marco",
            Email = "",
            PhoneNumber = null,
            Url = null
        };
        await _sut.CreatePartnerAsync(partner);

        // Act
        var result = await _sut.DeletePartnerAsync(partner.Id);

        // Assert
        result.Should().BeTrue();
    }
    
    [Fact]
    public async Task GetPartnerByName_ShouldReturnPartner_WhenPartnerExists()
    {
        // Arrange
        var partner = new Partner
        {
            Name = "Perica",
            Email = "",
            PhoneNumber = null,
            Url = null
        };
        await _sut.CreatePartnerAsync(partner);

        // Act
        var result = await _sut.GetPartnerByNameAsync(partner.Name);

        // Assert
        result.Should().NotBeNull();
    }
    
    [Fact]
    public async Task GetPartnerById_ShouldReturnPartner_WhenPartnerExists()
    {
        // Arrange
        var partner = new Partner
        {
            Name = "PiterParker",
            Email = "",
            PhoneNumber = null,
            Url = null
        };
        await _sut.CreatePartnerAsync(partner);

        // Act
        var result = await _sut.GetPartnerByIdAsync(partner.Id);

        // Assert
        result.Should().NotBeNull();
    }
    
    [Fact]
    public async Task UpdatePartner_ShouldReturnTrue_WhenPartnerExists()
    {
        // Arrange
        var partner = new Partner
        {
            Name = "BobBarker",
            Email = "",
            PhoneNumber = null,
            Url = null
        };
        await _sut.CreatePartnerAsync(partner);
        partner.Name = "BobBarker2";

        // Act
        var result = await _sut.UpdatePartnerAsync(partner);

        // Assert
        result.Should().BeTrue();
    }
    
}