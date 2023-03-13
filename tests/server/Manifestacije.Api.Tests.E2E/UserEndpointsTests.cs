using System.Net;
using System.Text.Json;
using Bogus;
using FluentAssertions;
using Manifestacije.Api.Contracts.Requests;
using Manifestacije.Api.Models;
using MongoDB.Bson;

namespace Manifestacije.Api.Tests.E2E;

public class UserEndpointsTests : IClassFixture<ManifestacijeApiFactory>, IAsyncLifetime
{
    private readonly HttpClient _client;

    private readonly Faker<UserCreateRequest> _userGenerator = new Faker<UserCreateRequest>()
        .RuleFor(x => x.FirstName, faker => faker.Name.FirstName())
        .RuleFor(x => x.LastName, faker => faker.Name.LastName())
        .RuleFor(x => x.Email, faker => faker.Internet.Email())
        .RuleFor(x => x.Password, faker => "Test.1234");

    private readonly Faker<UserUpdateRequest> _userUpdateGenerator = new Faker<UserUpdateRequest>()
        .RuleFor(x => x.FirstName, faker => faker.Name.FirstName())
        .RuleFor(x => x.LastName, faker => faker.Name.LastName());

    private string _tokenAdmin = string.Empty;
    private string _tokenOrganization = string.Empty;
    private string _tokenUser = string.Empty;

    public UserEndpointsTests(ManifestacijeApiFactory factory)
    {
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
        });
    }

    [Fact]
    public async Task CreateUser_ShouldReturnValidationErrors_WhenUserRequestIsInvalid()
    {
        // Arrange
        var userCreateRequest = _userGenerator.Generate();
        userCreateRequest.Email = "invalidEmail";

        // Act
        var response = await _client.PostAsJsonAsync("/users", userCreateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo(
            "[{\"propertyName\":\"Email\",\"errorMessage\":\"'Email' is not a valid email address.\",\"attemptedValue\":\"invalidEmail\",\"customState\":null,\"severity\":0,\"errorCode\":\"EmailValidator\",\"formattedMessagePlaceholderValues\":{\"PropertyName\":\"Email\",\"PropertyValue\":\"invalidEmail\"}}]");
    }

    [Fact]
    public async Task CreateUser_ShouldReturnOk_WhenUserCreateRequestIsValid()
    {
        // Arrange
        var userCreateRequest = _userGenerator.Generate();

        // Act
        var response = await _client.PostAsJsonAsync("/users", userCreateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var content = await response.Content.ReadFromJsonAsync<UserViewResponse>();
        content.Should().NotBeNull();
        content!.Id.Should().NotBeNull();
        response.Headers.Location.Should().Be($"/users/{content.Id}");
    }

    [Fact]
    public async Task GetAllUsers_ShouldReturnUnauthorized_WhenUserIsNotAuthenticated()
    {
        // Arrange

        // Act
        var response = await _client.GetAsync("/users");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetAllUsers_ShouldReturnForbidden_WhenUserIsNotAdmin()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new("Bearer", _tokenOrganization);

        // Act
        var response = await _client.GetAsync("/users");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task GetAllUsers_ShouldReturnOk_WhenUserIsAdmin()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new("Bearer", _tokenAdmin);

        // Act
        var response = await _client.GetAsync("/users");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetUserById_ShouldReturnUnauthorized_WhenUserIsNotAuthenticated()
    {
        // Arrange
        var id = ObjectId.GenerateNewId().ToString();

        // Act
        var response = await _client.GetAsync($"/users/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetUserById_ShouldReturnNotFound_WhenUserDoesNotExist()
    {
        // Arrange
        var id = new ObjectId().ToString();
        _client.DefaultRequestHeaders.Authorization = new("Bearer", _tokenAdmin);

        // Act
        var response = await _client.GetAsync($"/users/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetUserById_ShouldReturnOk_WhenUserExists()
    {
        // Arrange
        var userCreateRequest = _userGenerator.Generate();
        var content = await (await _client.PostAsJsonAsync("/users", userCreateRequest))
            .Content.ReadFromJsonAsync<UserViewResponse>();
        var id = content!.Id;

        _client.DefaultRequestHeaders.Authorization = new("Bearer", _tokenAdmin);

        // Act
        var response = await _client.GetAsync($"/users/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var newContent = await response.Content.ReadFromJsonAsync<UserViewResponse>();
        newContent.Should().NotBeNull();
        newContent.Should().BeEquivalentTo(content, TestHelpers.Config<UserViewResponse>());
    }

    [Fact]
    public async Task UpdateUser_ShouldReturnUnauthorized_WhenUserIsNotAuthenticated()
    {
        // Arrange
        var userUpdateRequest = _userUpdateGenerator.Generate();
        var id = ObjectId.GenerateNewId().ToString();

        // Act
        var response = await _client.PutAsJsonAsync($"/users/{id}", userUpdateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task UpdateUser_ShouldReturnNotFound_WhenUserDoesNotExist()
    {
        // Arrange
        var userUpdateRequest = _userUpdateGenerator.Generate();
        var id = ObjectId.GenerateNewId().ToString();
        _client.DefaultRequestHeaders.Authorization = new("Bearer", _tokenAdmin);

        // Act
        var response = await _client.PutAsJsonAsync($"/users/{id}", userUpdateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo("\"There is no user with specified id\"");
    }

    [Fact]
    public async Task UpdateUser_ShouldReturnForbidden_WhenUserIsNotAdminAndUpdatingAnotherUser()
    {
        // Arrange
        var userUpdateRequest = _userUpdateGenerator.Generate();
        var id = ObjectId.GenerateNewId().ToString();
        _client.DefaultRequestHeaders.Authorization = new("Bearer", _tokenOrganization);

        // Act
        var response = await _client.PutAsJsonAsync($"/users/{id}", userUpdateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task UpdateUser_ShouldReturnValidationErrors_WhenUserUpdateRequestIsInvalid()
    {
        // Arrange
        var userUpdateRequest = _userUpdateGenerator.Generate();
        userUpdateRequest.FirstName = "";
        var id = ObjectId.GenerateNewId().ToString();
        _client.DefaultRequestHeaders.Authorization = new("Bearer", _tokenAdmin);

        // Act
        var response = await _client.PutAsJsonAsync($"/users/{id}", userUpdateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo(
            "[{\"propertyName\":\"FirstName\",\"errorMessage\":\"'First Name' must not be empty.\",\"attemptedValue\":\"\",\"customState\":null,\"severity\":0,\"errorCode\":\"NotEmptyValidator\",\"formattedMessagePlaceholderValues\":{\"PropertyName\":\"First Name\",\"PropertyValue\":\"\"}}]");
    }

    [Fact]
    public async Task UpdateUser_ShouldReturnOk_WhenUserUpdateRequestIsValid()
    {
        // Arrange
        var userCreateRequest = _userGenerator.Generate();
        var content = await (await _client.PostAsJsonAsync("/users", userCreateRequest))
            .Content.ReadFromJsonAsync<UserViewResponse>();
        var userUpdateRequest = _userUpdateGenerator.Generate();
        var id = content!.Id;
        var token = (await (await _client.PostAsJsonAsync("/authenticate", new AuthenticateRequest
        {
            Email = userCreateRequest.Email,
            Password = userCreateRequest.Password
        })).Content.ReadFromJsonAsync<TokenResponse>())!.Token;

        _client.DefaultRequestHeaders.Authorization = new("Bearer", token);

        // Act
        var response = await _client.PutAsJsonAsync($"/users/{id}", userUpdateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var newContent = await response.Content.ReadFromJsonAsync<UserViewResponse>();
        newContent.Should().NotBeNull();
        newContent!.FirstName.Should().BeEquivalentTo(userUpdateRequest.FirstName);
        newContent!.LastName.Should().BeEquivalentTo(userUpdateRequest.LastName);
    }

    [Fact]
    public async Task DeleteUser_ShouldReturnUnauthorized_WhenUserIsNotAuthenticated()
    {
        // Arrange
        var id = ObjectId.GenerateNewId().ToString();

        // Act
        var response = await _client.DeleteAsync($"/users/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task DeleteUser_ShouldReturnNotFound_WhenUserDoesNotExist()
    {
        // Arrange
        var id = ObjectId.GenerateNewId().ToString();

        _client.DefaultRequestHeaders.Authorization = new("Bearer", _tokenAdmin);

        // Act
        var response = await _client.DeleteAsync($"/users/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteUser_ShouldReturnForbidden_WhenUserIsNotAdmin()
    {
        // Arrange
        var id = ObjectId.GenerateNewId().ToString();

        _client.DefaultRequestHeaders.Authorization = new("Bearer", _tokenOrganization);

        // Act
        var response = await _client.DeleteAsync($"/users/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task DeleteUser_ShouldReturnOk_WhenUserIsAdmin()
    {
        // Arrange
        var userCreateRequest = _userGenerator.Generate();
        var content = await (await _client.PostAsJsonAsync("/users", userCreateRequest))
            .Content.ReadFromJsonAsync<UserViewResponse>();
        var id = content!.Id;

        _client.DefaultRequestHeaders.Authorization = new("Bearer", _tokenAdmin);

        // Act
        var response = await _client.DeleteAsync($"/users/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task AuthenticateUser_ShouldReturnValidationErrors_WhenAuthenticateRequestInvalid()
    {
        // Arrange
        var authenticateRequest = new AuthenticateRequest
        {
            Email = "testt",
            Password = "sif.Ra.234"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/authenticate", authenticateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo("[{\"propertyName\":\"Email\",\"errorMessage\":\"'Email' is not a valid email address.\",\"attemptedValue\":\"testt\",\"customState\":null,\"severity\":0,\"errorCode\":\"EmailValidator\",\"formattedMessagePlaceholderValues\":{\"PropertyName\":\"Email\",\"PropertyValue\":\"testt\"}}]");
    }

    [Fact]
    public async Task AuthenticateUser_ShouldReturnInvalidMailError_WhenUserEmailIsInvalid()
    {
        // Arrange
        var authenticateRequest = new AuthenticateRequest()
        {
            Email = "test@test.rs",
            Password = "Test.1234"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/authenticate", authenticateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo("\"Incorrect email\"");
    }

    [Fact]
    public async Task AuthenticateUser_ShouldReturnInvalidPasswordError_WhenUserPasswordIsInvalid()
    {
        // Arrange
        var authenticateRequest = new AuthenticateRequest()
        {
            Email = "admin@test.rs",
            Password = "Test1.234"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/authenticate", authenticateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo("\"Incorrect password\"");
    }

    [Fact]
    public async Task AuthenticateUser_ShouldReturnOk_WhenUserCredentialsAreValid()
    {
        // Arrange
        var authenticateRequest = new AuthenticateRequest()
        {
            Email = "admin@test.rs",
            Password = "Sifra.1234"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/authenticate", authenticateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadFromJsonAsync<TokenResponse>();
        content.Should().NotBeNull();
        content!.Token.Should().NotBeNullOrEmpty();
        content.RefreshToken.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task RefreshToken_ShouldReturnValidationErrors_WhenRefreshTokenRequestIsInvalid()
    {
        // Arrange
        var refreshTokenRequest = new RefreshTokenRequest();

        // Act
        var response = await _client.PostAsJsonAsync("/authenticate/refresh", refreshTokenRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
   }

    [Fact]
    public async Task RefreshToken_ShouldReturnInvalidTokenError_WhenRefreshTokenIsNotFound()
    {
        // Arrange
        var refreshTokenRequest = new RefreshTokenRequest
        {
            Token = "rarar"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/authenticate/refresh", refreshTokenRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo("\"Invalid token\"");
    }

    [Fact]
    public async Task RefreshToken_ShouldReturnInvalidTokenError_WhenRefreshTokenIsExpired()
    {
        // Arrange
        var refreshTokenRequest = new RefreshTokenRequest
        {
            Token = "eaeaea"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/authenticate/refresh", refreshTokenRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo("\"Token expired\"");
    }

    [Fact]
    public async Task RefreshToken_ShouldReturnOk_WhenRefreshTokenIsValid()
    {
        // Arrange
        var refreshTokenRequest = new RefreshTokenRequest
        {
            Token = "eaeaea2"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/authenticate/refresh", refreshTokenRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadFromJsonAsync<TokenResponse>();
        content.Should().NotBeNull();
        content!.Token.Should().NotBeNullOrEmpty();
        content.RefreshToken.Should().NotBeNullOrEmpty();
    }

    public async Task InitializeAsync()
    {
        var authenticateRequestAdmin = new AuthenticateRequest
        {
            Email = "admin@test.rs",
            Password = "Sifra.1234",
        };

        var authenticateRequestOrganization = new AuthenticateRequest
        {
            Email = "org@test.rs",
            Password = "Sifra.1234",
        };

        var authenticateRequestUser = new AuthenticateRequest
        {
            Email = "user@test.rs",
            Password = "Sifra.1234",
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
}