namespace Manifestacije.Api.Tests.Unit;

public sealed class CategoryServiceTests
{
    private readonly CategoryService _sct;
    private readonly ICategoryRepository _categoryRepository = Substitute.For<ICategoryRepository>();

    public CategoryServiceTests()
    {
        var inMemorySettings = new Dictionary<string, string>
        {
            { "Authorization:Secret", "JEAAJEHAJE" }
        };
        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
        _sct = new CategoryService(_categoryRepository, configuration);
    }

    [Fact]
    public async Task GetAllCategoriesAsync_ShouldReturnEmptyList_WhenNoCategoryExist()
    {
        // Arrange
        _categoryRepository.GetAllCategoriesAsync(Arg.Any<CategoryQueryFilter>()).Returns(new List<Category>());

        // Act
        var result = await _sct.GetAllCategoriesAsync(new CategoryQueryFilter());

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllCategoriesAsync_ShouldReturnListOfCategories_WhenCategoryExist()
    {
        // Arrange
        var categories = new List<Category>
        {
            new()
            {
                Id = "1",
                Name = "Some Category"
            }
        };
        _categoryRepository.GetAllCategoriesAsync(Arg.Any<CategoryQueryFilter>()).Returns(categories);

        // Act
        var result = await _sct.GetAllCategoriesAsync(new CategoryQueryFilter());

        // Assert
        result.Should().BeEquivalentTo(categories);
    }

    [Fact]
    public async Task GetCategoryByIdAsync_ShouldReturnNull_WhenCategoryDoesNotExist()
    {
        // Arrange
        _categoryRepository.GetCategoryByIdAsync(Arg.Any<string>()).Returns((Category?)null);

        // Act
        var result = await _sct.GetCategoryByIdAsync("1");

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetCategoryByIdAsync_ShouldReturnCategory_WhenCategoryExists()
    {
        // Arrange
        var category = new Category
        {
            Id = "1",
            Name = "Some Name"
        };
        _categoryRepository.GetCategoryByIdAsync(Arg.Any<string>()).Returns(category);

        // Act
        var result = await _sct.GetCategoryByIdAsync("1");

        // Assert
        result.Should().BeEquivalentTo(category);
    }

    [Fact]
    public async Task CreateCategoryAsync_ShouldThrowInvalidInputException_WhenCategoryWithNameExists()
    {
        // Arrange
        var categoryCreateRequest = new CategoryCreateRequest
        {
            Name = "Some Category"
        };
        _categoryRepository.GetCategoryWithNameAsync(Arg.Any<string>()).Returns(new Category());

        // Act
        Func<Task> result = async () => await _sct.CreateCategoryAsync(categoryCreateRequest);

        // Assert
        await result.Should()
            .ThrowExactlyAsync<InvalidInputException>()
            .WithMessage("Category with given name already exists");
    }

    [Fact]
    public async Task CreateCategoryAsync_ShouldThrowDatabaseException_WhenCategoryCreationFails()
    {
        // Arrange
        var categoryCreateRequest = new CategoryCreateRequest
        {
            Name = "Some Name"
        };
        var category = new Category
        {
            Name = "Some Name"
        };
        _categoryRepository.GetCategoryWithNameAsync(Arg.Any<string>()).Returns((Category?)null);
        _categoryRepository.CreateCategoryAsync(Arg.Any<Category>()).Returns(false);

        // Act
        Func<Task> result = async () => await _sct.CreateCategoryAsync(categoryCreateRequest);

        // Assert
        await result.Should()
            .ThrowExactlyAsync<DatabaseException>()
            .WithMessage("Failed to create category");
    }

    [Fact]
    public async Task CreateCategoryAsync_ShouldReturnCategory_WhenCategoryCreationSucceeds()
    {
        // Arrange
        var categoryCreateRequest = new CategoryCreateRequest
        {
            Name = "Some Name"
        };
        var category = new Category
        {
            Name = "Some Name"
        };
        _categoryRepository.GetCategoryByIdAsync(Arg.Any<string>()).Returns((Category?)null);
        _categoryRepository.CreateCategoryAsync(Arg.Any<Category>()).Returns(true);

        // Act
        var result = await _sct.CreateCategoryAsync(categoryCreateRequest);

        // Assert
        category.Id = result.Id;
        result.Should().BeEquivalentTo(category, TestHelpers.Config<Category>());
    }

    [Fact]
    public async Task UpdateCategoryAsync_ShouldThrowInvalidInputException_WhenCategoryDoesNotExist()
    {
        // Arrange
        var categoryUpdateRequest = new CategoryUpdateRequest
        {
            Name = " "
        };
        _categoryRepository.GetCategoryByIdAsync(Arg.Any<string>()).Returns((Category?)null);

        // Act
        var result = await _sct.UpdateCategoryAsync("1", categoryUpdateRequest);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateCategoryAsync_ShouldReturnCategory_WhenCategoryUpdateSucceeds()
    {
        // Arrange
        var categoryUpdateRequest = new CategoryUpdateRequest
        {
            Name = "Some Name"
        };
        var category = new Category
        {
            Id = "1",
            Name = "Some Name"
        };
        _categoryRepository.GetCategoryByIdAsync(Arg.Any<string>()).Returns(category);
        _categoryRepository.UpdateCategoryAsync(Arg.Any<Category>()).Returns(true);

        // Act
        var result = await _sct.UpdateCategoryAsync("1", categoryUpdateRequest);

        // Assert
        result.Should().BeEquivalentTo(category);
    }

    [Fact]
    public async Task DeleteCategoryAsync_ShouldReturnFalse_WhenCategoryDoesNotExist()
    {
        // Arrange
        _categoryRepository.GetCategoryByIdAsync(Arg.Any<string>()).Returns((Category?)null);

        // Act
        var result = await _sct.DeleteCategoryAsync("1");

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteCategoryAsync_ShouldReturnTrue_WhenCategoryExists()
    {
        // Arrange
        var category = new Category
        {
            Id = "1",
            Name = "Some Name"
        };
        _categoryRepository.GetCategoryByIdAsync(Arg.Any<string>()).Returns(category);
        _categoryRepository.UpdateCategoryAsync(Arg.Any<Category>()).Returns(true);

        // Act
        var result = await _sct.DeleteCategoryAsync("1");

        // Assert
        result.Should().BeTrue();
    }
}