using System.Net;
using System.Net.Http.Headers;
using Bogus;
using Manifestacije.Api.Contracts.Requests;
using MongoDB.Bson;

namespace Manifestacije.Api.Tests.E2E;

public class CategoryEndpointsTests : IClassFixture<ManifestacijeApiFactory>, IAsyncLifetime
{
    private readonly HttpClient _client;

    private readonly Faker<CategoryCreateRequest> _categoryGenerator = new Faker<CategoryCreateRequest>()
        .RuleFor(x => x.Name, faker => faker.Name.FirstName());

    private readonly Faker<CategoryUpdateRequest> _categoryUpdateGenerator = new Faker<CategoryUpdateRequest>()
        .RuleFor(x => x.Name, faker => faker.Name.FirstName());

    private string _tokenAdmin = string.Empty;
    private string _tokenOrganization = string.Empty;
    private string _tokenUser = string.Empty;

    public CategoryEndpointsTests(ManifestacijeApiFactory factory)
    {
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
    }

    public async Task InitializeAsync()
    {
        var authenticateRequestAdmin = new AuthenticateRequest
        {
            Email = "admin@test.rs",
            Password = "Sifra.1234"
        };

        var authenticateRequestOrganization = new AuthenticateRequest
        {
            Email = "org@test.rs",
            Password = "Sifra.1234"
        };

        var authenticateRequestUser = new AuthenticateRequest
        {
            Email = "user@test.rs",
            Password = "Sifra.1234"
        };

        var responseAdmin = await _client.PostAsJsonAsync("/authenticate", authenticateRequestAdmin);
        var responseOrganization = await _client.PostAsJsonAsync("/authenticate", authenticateRequestOrganization);
        var responseUser = await _client.PostAsJsonAsync("/authenticate", authenticateRequestUser);

        _tokenAdmin = (await responseAdmin.Content.ReadFromJsonAsync<TokenResponse>())!.Token;
        _tokenOrganization = (await responseOrganization.Content.ReadFromJsonAsync<TokenResponse>())!.Token;
        _tokenUser = (await responseUser.Content.ReadFromJsonAsync<TokenResponse>())!.Token;
    }

    public Task DisposeAsync()
    {
        return Task.CompletedTask;
    }

    [Fact]
    public async Task CreateCategory_ShouldReturnValidationErrors_WhenCategoryRequestIsInvalid()
    {
        // Arrange
        var categoryCreateRequest = _categoryGenerator.Generate();
        categoryCreateRequest.Name = "";
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        
        // Act
        var response = await _client.PostAsJsonAsync("/categories", categoryCreateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo(
            "[{\"propertyName\":\"Name\",\"errorMessage\":\"'Name' must not be empty.\",\"attemptedValue\":\"\",\"customState\":null,\"severity\":0,\"errorCode\":\"NotEmptyValidator\",\"formattedMessagePlaceholderValues\":{\"PropertyName\":\"Name\",\"PropertyValue\":\"\"}}]");
    }

    [Fact]
    public async Task CreateCategory_ShouldReturnOk_WhenCategoryCreateRequestIsValid()
    {
        // Arrange
        var categoryCreateRequest = _categoryGenerator.Generate();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);

        // Act
        var response = await _client.PostAsJsonAsync("/categories", categoryCreateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var content = await response.Content.ReadFromJsonAsync<CategoryViewResponse>();
        content.Should().NotBeNull();
        content!.Id.Should().NotBeNull();
        response.Headers.Location.Should().Be($"/categories/{content.Id}");
    }

    [Fact]
    public async Task CreateCategory_ShouldReturnUnauthorized_WhenUserIsNotAuthenticated()
    {
        // Arrange
        var categoryCreateRequest = _categoryGenerator.Generate();

        // Act
        var response = await _client.PostAsJsonAsync("/categories", categoryCreateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetAllCategories_ShouldReturnAllCategories_Always()
    {
        // Arrange

        // Act
        var response = await _client.GetAsync("/categories");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}