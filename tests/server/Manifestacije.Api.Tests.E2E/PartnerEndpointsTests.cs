using Manifestacije.Api.Mappers;

namespace Manifestacije.Api.Tests.E2E;

public class PartnerEndpointsTests : IClassFixture<ManifestacijeApiFactory>, IAsyncLifetime
{
    private readonly HttpClient _client;

    private readonly Faker<PartnerCreateRequest> _partnerGenerator = new Faker<PartnerCreateRequest>()
        .RuleFor(x => x.Name, faker => faker.Company.CompanyName())
        .RuleFor(x => x.Email, faker => faker.Internet.Email())
        .RuleFor(x => x.PhoneNumber, faker => faker.Phone.PhoneNumber("###-###-###"))
        .RuleFor(x => x.Url, faker => faker.Internet.Url());

    private string _tokenAdmin = string.Empty;
    private string _tokenUser = string.Empty;

    public PartnerEndpointsTests(ManifestacijeApiFactory factory)
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

        var authenticateRequestUser = new AuthenticateRequest
        {
            Email = "user@test.rs",
            Password = "Sifra.1234"
        };

        var responseAdmin = await _client.PostAsJsonAsync("/authenticate", authenticateRequestAdmin);
        var responseUser = await _client.PostAsJsonAsync("/authenticate", authenticateRequestUser);

        _tokenAdmin = (await responseAdmin.Content.ReadFromJsonAsync<TokenResponse>())!.Token;
        _tokenUser = (await responseUser.Content.ReadFromJsonAsync<TokenResponse>())!.Token;
    }

    public Task DisposeAsync()
    {
        return Task.CompletedTask;
    }

    [Fact]
    public async Task GetAllPartners_ShouldReturnAllPartners_WhenPartnersExist()
    {
        // Arrange

        // Act
        var response = await _client.GetAsync("/partners");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetPartnerById_ShouldReturnPartner_WhenPartnerExists()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);

        var partner = _partnerGenerator.Generate();
        var content = await (await _client.PostAsJsonAsync("/partners", partner))
            .Content.ReadFromJsonAsync<PartnerViewResponse>();
        var id = content!.Id;

        // Act
        var response = await _client.GetAsync($"/partners/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var newContent = await response.Content.ReadFromJsonAsync<PartnerViewResponse>();
        newContent.Should().NotBeNull();
        newContent.Should().BeEquivalentTo(content, TestHelpers.Config<PartnerViewResponse>());
    }

    [Fact]
    public async Task GetPartnerById_ShouldReturnNotFound_WhenPartnerDoesNotExist()
    {
        // Arrange
        var id = new ObjectId().ToString();

        // Act
        var response = await _client.GetAsync($"/partners/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        response.Content.Headers.ContentType!.MediaType.Should().Be("application/json");
        var content = await response.Content.ReadFromJsonAsync<string>();
        content!.Should().Be("Partner with the given id not found");
    }

    [Fact]
    public async Task DeletePartner_ShouldReturnNotFound_WhenPartnerDoesntExist()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        var id = new ObjectId().ToString();

        // Act
        var response = await _client.DeleteAsync($"/partners/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        response.Content.Headers.ContentType!.MediaType.Should().Be("application/json");
        var content = await response.Content.ReadFromJsonAsync<string>();
        content!.Should().Be("Partner with the given id not found");
    }
    
    [Fact]
    public async Task DeletePartner_ShouldReturnOk_WhenPartnerDoesExist()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        var partner = _partnerGenerator.Generate();
        var content = await (await _client.PostAsJsonAsync("/partners", partner))
            .Content.ReadFromJsonAsync<PartnerViewResponse>();
        var id = content!.Id;

        // Act
        var response = await _client.DeleteAsync($"/partners/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Content.Headers.ContentType!.MediaType.Should().Be("application/json");
        var newContent = await response.Content.ReadFromJsonAsync<string>();
        newContent!.Should().Be("Partner successfully deleted");
    }
    
    [Fact]
    public async Task DeletePartner_ShouldReturnForbidden_WhenUserTriesToDelete()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenUser);
        var id = new ObjectId().ToString();
        
        // Act
        var response = await _client.DeleteAsync($"/partners/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
    
    [Fact]
    public async Task CreatePartner_ShouldReturnBadRequest_WhenPartnerIsInvalid()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        var partner = _partnerGenerator.Generate();
        partner.Name = string.Empty;

        // Act
        var response = await _client.PostAsJsonAsync("/partners", partner);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
    
    [Fact]
    public async Task CreatePartner_ShouldReturnCreated_WhenPartnerValid()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        var partner = _partnerGenerator.Generate();

        // Act
        var response = await _client.PostAsJsonAsync("/partners", partner);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
    
    [Fact]
    public async Task UpdatePartner_ShouldReturnBadRequest_WhenPartnerIsInvalid()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        var partner = _partnerGenerator.Generate();
        var content = await (await _client.PostAsJsonAsync("/partners", partner))
            .Content.ReadFromJsonAsync<PartnerViewResponse>();
        var id = content!.Id;
        partner.Name = string.Empty;

        // Act
        var response = await _client.PutAsJsonAsync($"/partners/{id}", partner);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
    
    [Fact]
    public async Task UpdatePartner_ShouldReturnNotFound_WhenPartnerDoesNotExist()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        var partner = _partnerGenerator.Generate();
        var id = new ObjectId().ToString();

        // Act
        var response = await _client.PutAsJsonAsync($"/partners/{id}", partner);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        var newContent = await response.Content.ReadFromJsonAsync<string>();
        newContent!.Should().Be("Partner with the given id not found");
    }
    
    [Fact]
    public async Task UpdatePartner_ShouldReturnOk_WhenPartnerIsUpdated()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        var partner = _partnerGenerator.Generate();
        var content = await (await _client.PostAsJsonAsync("/partners", partner))
            .Content.ReadFromJsonAsync<PartnerViewResponse>();
        var id = content!.Id;
        partner.Name = "New name";

        // Act
        var response = await _client.PutAsJsonAsync($"/partners/{id}", partner);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var newContent = await response.Content.ReadFromJsonAsync<PartnerViewResponse>();
        newContent!.Name.Should().Be("New name");
    }
}