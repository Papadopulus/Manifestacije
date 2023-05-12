using System.Net;
using System.Net.Http.Headers;
using Bogus;
using Manifestacije.Api.Contracts.Requests;
using MongoDB.Bson;

namespace Manifestacije.Api.Tests.E2E;

public class LocationsEndpointsTests : IClassFixture<ManifestacijeApiFactory>, IAsyncLifetime
{
    private readonly HttpClient _client;

    private readonly Faker<LocationCreateRequest> _locationGenerator = new Faker<LocationCreateRequest>()
        .RuleFor(x => x.Name, faker => faker.Name.FirstName());

    private readonly Faker<LocationUpdateRequest> _locationUpdateGenerator = new Faker<LocationUpdateRequest>()
        .RuleFor(x => x.Name, faker => faker.Name.FirstName());

    private string _tokenAdmin = string.Empty;
    private string _tokenOrganization = string.Empty;
    private string _tokenUser = string.Empty;

    public LocationsEndpointsTests(ManifestacijeApiFactory factory)
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
    public async Task CreateLocation_ShouldReturnValidationError_WhenLocationIsNotValid()
    {
        // Arrange
        var locationCreateRequest = _locationGenerator.Generate();
        locationCreateRequest.Name = "";
        locationCreateRequest.AccommodationPartnerId = null;
        locationCreateRequest.TransportPartnerId = null;
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        // Act
        var response = await _client.PostAsJsonAsync("/locations", locationCreateRequest);
        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo("{\"errors\":[\"'Name' must not be empty.\"]}");
    }

    [Fact]
    public async Task CreateLocation_ShouldReturnOk_WhenCreateRequestIsValid()
    {
        // Arrange
        var locationCreateRequest = _locationGenerator.Generate();

        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        // Act
        var response = await _client.PostAsJsonAsync("/locations", locationCreateRequest);
        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var content = await response.Content.ReadFromJsonAsync<LocationViewResponse>();
        content.Should().NotBeNull();
        content!.Id.Should().NotBeNull();
        response.Headers.Location.Should().Be($"/locations/{content.Id}");
    }

    [Fact]
    public async Task CreateCategory_ShouldReturnUnauthorized_WhenUserIsNotAuthenticated()
    {
        // Arrange
        var locationsQueryCreate = _locationGenerator.Generate();

        // Act
        var response = await _client.PostAsJsonAsync("/locations", locationsQueryCreate);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetAllLocations_ShouldReturnAllLocations_WhenThereAreLocations()
    {
        // Arrange
        var locationsQueryCreate = _locationGenerator.Generate();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        await _client.PostAsJsonAsync("/locations", locationsQueryCreate);
        // Act
        var response = await _client.GetAsync("/locations");

        // Assert
        var content = await response.Content.ReadAsStringAsync();
        content.Should().NotBeNull();
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetLocationById_ShouldReturnNotFound_WhenLocationDoesNotExist()
    {
        // Arrange
        var id = new ObjectId().ToString();

        // Act
        var response = await _client.GetAsync($"/locations/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetLocationById_ShouldReturnOk_WhenLocationExists()
    {
        // Arrange
        var locationCreateRequest = _locationGenerator.Generate();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        var content = await (await _client.PostAsJsonAsync("/locations", locationCreateRequest))
            .Content.ReadFromJsonAsync<LocationViewResponse>();
        var id = content!.Id;

        // Act
        var response = await _client.GetAsync($"/locations/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var newContent = await response.Content.ReadFromJsonAsync<LocationViewResponse>();
        newContent.Should().NotBeNull();
        newContent.Should().BeEquivalentTo(content, TestHelpers.Config<LocationViewResponse>());
    }

    [Fact]
    public async Task UpdateLocation_ShouldReturnUnauthorized_WhenUserIsNotAuthenticated()
    {
        // Arrange
        var locationUpdateRequest = _locationUpdateGenerator.Generate();
        var id = ObjectId.GenerateNewId().ToString();

        // Act
        var response = await _client.PutAsJsonAsync($"/locations/{id}", locationUpdateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task UpdateLocation_ShouldReturnNotFound_WhenLocationDoesNotExist()
    {
        // Arrange
        var locationUpdateRequest = _locationUpdateGenerator.Generate();
        var id = ObjectId.GenerateNewId().ToString();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);

        // Act
        var response = await _client.PutAsJsonAsync($"/locations/{id}", locationUpdateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo("\"there is not a location with specified id\"");
    }

    [Fact]
    public async Task UpdateCategory_ShouldReturnValidationErrors_WhenCategoryUpdateRequestIsInvalid()
    {
        // Arrange
        var locationUpdateRequest = _locationUpdateGenerator.Generate();
        locationUpdateRequest.Name = "";
        var id = ObjectId.GenerateNewId().ToString();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);

        // Act
        var response = await _client.PutAsJsonAsync($"/locations/{id}", locationUpdateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo("{\"errors\":[\"'Name' must not be empty.\"]}");
    }

    [Fact]
    public async Task UpdateLocation_ShouldReturnOk_WhenLocationUpdateRequestIsValid()
    {
        // Arrange
        var locationCreateRequest = _locationGenerator.Generate();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        var content = await (await _client.PostAsJsonAsync("/locations", locationCreateRequest))
            .Content.ReadFromJsonAsync<LocationViewResponse>();
        var locationsUpdateRequest = _locationUpdateGenerator.Generate();
        var id = content!.Id;
        // Act
        var response = await _client.PutAsJsonAsync($"/locations/{id}", locationsUpdateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var newContent = await response.Content.ReadFromJsonAsync<LocationViewResponse>();
        newContent.Should().NotBeNull();
        newContent!.Name.Should().BeEquivalentTo(locationsUpdateRequest.Name);
    }

    [Fact]
    public async Task DeleteLocation_ShouldReturnUnauthorized_WhenUserIsNotAuthenticated()
    {
        // Arrange
        var id = ObjectId.GenerateNewId().ToString();

        // Act
        var response = await _client.DeleteAsync($"/locations/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task DeleteCategory_ShouldReturnNotFound_WhenCategoryDoesNotExist()
    {
        // Arrange
        var id = ObjectId.GenerateNewId().ToString();

        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);

        // Act
        var response = await _client.DeleteAsync($"/locations/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteLocation_ShouldReturnOk_WhenUserIsAdmin()
    {
        // Arrange
        var locationCreateRequest = _locationGenerator.Generate();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        var content = await (await _client.PostAsJsonAsync("/locations", locationCreateRequest))
            .Content.ReadFromJsonAsync<LocationViewResponse>();
        var id = content!.Id;
        // Act
        var response = await _client.DeleteAsync($"/locations/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}