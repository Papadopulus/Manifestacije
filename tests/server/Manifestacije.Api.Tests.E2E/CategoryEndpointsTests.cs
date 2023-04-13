﻿using System.Net;
using System.Net.Http.Headers;
using Bogus;
using Manifestacije.Api.Contracts.Requests;
using MongoDB.Bson;

namespace Manifestacije.Api.Tests.E2E;

public sealed class CategoryEndpointsTests : IClassFixture<ManifestacijeApiFactory>, IAsyncLifetime
{
    private readonly Faker<CategoryCreateRequest> _categoryGenerator = new Faker<CategoryCreateRequest>()
        .RuleFor(x => x.Name, faker => faker.Name.FirstName());

    private readonly Faker<CategoryUpdateRequest> _categoryUpdateGenerator = new Faker<CategoryUpdateRequest>()
        .RuleFor(x => x.Name, faker => faker.Name.FirstName());

    private readonly HttpClient _client;

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
            "[{\"propertyName\":\"Name\",\"errorMessage\":\"'Name' must not be empty.\",\"attemptedValue\":\"\",\"customState\":null,\"severity\":0,\"errorCode\":\"NotEmptyValidator\",\"formattedMessagePlaceholderValues\":{\"PropertyName\":\"Name\",\"PropertyValue\":\"\"}},{\"propertyName\":\"Name\",\"errorMessage\":\"The length of 'Name' must be at least 1 characters. You entered 0 characters.\",\"attemptedValue\":\"\",\"customState\":null,\"severity\":0,\"errorCode\":\"MinimumLengthValidator\",\"formattedMessagePlaceholderValues\":{\"MinLength\":1,\"MaxLength\":-1,\"TotalLength\":0,\"PropertyName\":\"Name\",\"PropertyValue\":\"\"}}]");
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

    //PRAVI MI PROBLEM KADA SE POKRENE ZAJEDNO SA OSTALIM UCITAVA NEKU KATEGORIJU KOJU JE NEKI TEST KREIRAO OVAKO SAM RADI
    /*[Fact]
    public async Task GetAllCategories_ShouldReturnAllEmptyList_WhenThereIsNoCategories()
    {
        // Arrange

        // Act
        var response = await _client.GetAsync("/categories");

        // Assert
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo("[]");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }*/

    [Fact]
    public async Task GetAllCategories_ShouldReturnAllCategories_WhenThereCategories()
    {
        // Arrange
        var categoryCreateRequest = _categoryGenerator.Generate();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        await _client.PostAsJsonAsync("/categories", categoryCreateRequest);
        // Act
        var response = await _client.GetAsync("/categories");

        // Assert
        var content = await response.Content.ReadAsStringAsync();
        content.Should().NotBeNull();
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetCategoryById_ShouldReturnNotFound_WhenCategoryDoesNotExist()
    {
        // Arrange
        var id = new ObjectId().ToString();

        // Act
        var response = await _client.GetAsync($"/categories/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetCategoryById_ShouldReturnOk_WhenCategoryExists()
    {
        // Arrange
        var categoryCreateRequest = _categoryGenerator.Generate();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        var content = await (await _client.PostAsJsonAsync("/categories", categoryCreateRequest))
            .Content.ReadFromJsonAsync<CategoryViewResponse>();
        var id = content!.Id;

        // Act
        var response = await _client.GetAsync($"/categories/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var newContent = await response.Content.ReadFromJsonAsync<CategoryViewResponse>();
        newContent.Should().NotBeNull();
        newContent.Should().BeEquivalentTo(content, TestHelpers.Config<CategoryViewResponse>());
    }

    [Fact]
    public async Task UpdateCategory_ShouldReturnUnauthorized_WhenUserIsNotAuthenticated()
    {
        // Arrange
        var categoryUpdateRequest = _categoryUpdateGenerator.Generate();
        var id = ObjectId.GenerateNewId().ToString();

        // Act
        var response = await _client.PutAsJsonAsync($"/categories/{id}", categoryUpdateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task UpdateCategory_ShouldReturnNotFound_WhenCategoryDoesNotExist()
    {
        // Arrange
        var categoryUpdateRequest = _categoryUpdateGenerator.Generate();
        var id = ObjectId.GenerateNewId().ToString();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);

        // Act
        var response = await _client.PutAsJsonAsync($"/categories/{id}", categoryUpdateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo("\"There is no category with specified id\"");
    }

    [Fact]
    public async Task UpdateCategory_ShouldReturnValidationErrors_WhenCategoryUpdateRequestIsInvalid()
    {
        // Arrange
        var categoryUpdateRequest = _categoryUpdateGenerator.Generate();
        categoryUpdateRequest.Name = "";
        var id = ObjectId.GenerateNewId().ToString();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);

        // Act
        var response = await _client.PutAsJsonAsync($"/categories/{id}", categoryUpdateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().BeEquivalentTo(
            "[{\"propertyName\":\"Name\",\"errorMessage\":\"The length of 'Name' must be at least 1 characters. You entered 0 characters.\",\"attemptedValue\":\"\",\"customState\":null,\"severity\":0,\"errorCode\":\"MinimumLengthValidator\",\"formattedMessagePlaceholderValues\":{\"MinLength\":1,\"MaxLength\":-1,\"TotalLength\":0,\"PropertyName\":\"Name\",\"PropertyValue\":\"\"}}]");
    }

    [Fact]
    public async Task UpdateCategory_ShouldReturnOk_WhenCategoryUpdateRequestIsValid()
    {
        // Arrange
        var categoryCreateRequest = _categoryGenerator.Generate();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        var content = await (await _client.PostAsJsonAsync("/categories", categoryCreateRequest))
            .Content.ReadFromJsonAsync<CategoryViewResponse>();
        var categoryUpdateRequest = _categoryUpdateGenerator.Generate();
        var id = content!.Id;
        // Act
        var response = await _client.PutAsJsonAsync($"/categories/{id}", categoryUpdateRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var newContent = await response.Content.ReadFromJsonAsync<CategoryViewResponse>();
        newContent.Should().NotBeNull();
        newContent!.Name.Should().BeEquivalentTo(categoryUpdateRequest.Name);
    }

    [Fact]
    public async Task DeleteCategory_ShouldReturnUnauthorized_WhenUserIsNotAuthenticated()
    {
        // Arrange
        var id = ObjectId.GenerateNewId().ToString();

        // Act
        var response = await _client.DeleteAsync($"/categories/{id}");

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
        var response = await _client.DeleteAsync($"/categories/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteCategory_ShouldReturnOk_WhenUserIsAdmin()
    {
        // Arrange
        var categoryCreateRequest = _categoryGenerator.Generate();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _tokenAdmin);
        var content = await (await _client.PostAsJsonAsync("/categories", categoryCreateRequest))
            .Content.ReadFromJsonAsync<CategoryViewResponse>();
        var id = content!.Id;
        // Act
        var response = await _client.DeleteAsync($"/categories/{id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}