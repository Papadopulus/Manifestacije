namespace Manifestacije.Api.Tests.Unit;

public class OrganizationServiceTests
{
    private readonly IOrganizationRepository _organizationRepository = Substitute.For<IOrganizationRepository>();
    private readonly OrganizationService _sut;

    public OrganizationServiceTests()
    {
        _sut = new OrganizationService(_organizationRepository);
    }
    
    [Fact]
    public async Task GetAllOrganizationsAsync_ShouldReturnEmptyList_WhenOrganizationsDoNotExist()
    {
        // Arrange
        _organizationRepository.GetAllOrganizationsAsync(Arg.Any<OrganizationQueryFilter>()).Returns(new List<Organization>());

        // Act
        var result = await _sut.GetAllOrganizationsAsync(new OrganizationQueryFilter());

        // Assert
        result.Should().BeEmpty();
    }
    
    [Fact]
    public async Task GetOrganizationByIdAsync_ShouldReturnOrganization_WhenOrganizationExists()
    {
        // Arrange
        var organization = new Organization
        {
            Id = "1",
            Name = "Organization 1",
            Description = "Description 1",
        };

        _organizationRepository.GetOrganizationByIdAsync(Arg.Any<string>()).Returns(organization);

        // Act
        var result = await _sut.GetOrganizationByIdAsync("1");

        // Assert
        result.Should().BeEquivalentTo(organization, TestHelpers.Config<Organization>());
    }
    
    [Fact]
    public async Task GetOrganizationByIdAsync_ShouldReturnNull_WhenOrganizationDoesNotExist()
    {
        // Arrange
        Organization organization = null;

        _organizationRepository.GetOrganizationByIdAsync(Arg.Any<string>()).Returns(organization);

        // Act
        var result = await _sut.GetOrganizationByIdAsync(Arg.Any<string>());

        // Assert
        result.Should().BeNull();
    }
}