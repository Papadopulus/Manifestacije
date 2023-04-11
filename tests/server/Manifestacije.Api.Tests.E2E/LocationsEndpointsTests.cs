using System.Net;
using System.Net.Http.Headers;
using Bogus;
using Manifestacije.Api.Contracts.Requests;

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
        //Arrange
        var locationCreateRequest = _locationGenerator.Generate();
        locationCreateRequest.Name = "";
        locationCreateRequest.AccommodationPartnerId = null;
        locationCreateRequest.TransportPartnerId = null;
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        //Act
        var response = await _client.PostAsJsonAsync("/locations", locationCreateRequest);
        //Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo("{\"errors\":[\"'Name' must not be empty.\"]}");
    }

    [Fact]
    public async Task CreateLocation_ShouldReturnOk_WhenCreateRequestIsValid()
    {
        //Arrange
        var locationCreateRequest = _locationGenerator.Generate();
        
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        //Act
        var response = await _client.PostAsJsonAsync("/locations", locationCreateRequest);
        //Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var content = await response.Content.ReadFromJsonAsync<LocationViewResponse>();
        content.Should().NotBeNull();
        content!.Id.Should().NotBeNull();
        response.Headers.Location.Should().Be($"/locations/{content.Id}");
    }
}