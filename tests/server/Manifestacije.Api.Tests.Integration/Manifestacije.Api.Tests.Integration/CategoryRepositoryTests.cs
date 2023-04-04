namespace Manifestacije.Api.Tests.Integration;

public sealed class CategoryRepositoryTests : IClassFixture<ManifestacijeApiFactory>, IAsyncDisposable
{
    private readonly CategoryRepository _sct;
    private readonly List<string> _categoriesToDelete = new();
    
    public CategoryRepositoryTests(ManifestacijeApiFactory factory)
    {
        factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
        var databaseSettings = Options.Create(new DatabaseSettings
        {
            ConnectionString = "mongodb://localhost:27018",
            DatabaseName = "manifestacije-test",
            UsersCollectionName = "categories"
        });
        _sct = new CategoryRepository(databaseSettings);
    }
    public async ValueTask DisposeAsync()
    {
        await DeleteCategories();
    }
    [Fact]
    public async Task GetAllCategoriesAsync_ShouldReturnEmptyList_WhenNoCategoryExist()
    {
        // Arrange
        var categoriesQueryFilter = CreateCategoryQueryFilter(Name: "Zdenkijada");

        // Act
        var result = await _sct.GetAllCategoriesAsync(categoriesQueryFilter);

        // Assert
        result.Should().BeEmpty();
    }
    [Fact]
    public async Task GetAllCategoriesAsync_ShouldReturnAllCategories_WhenCategoriesExist()
    {
        // Arrange
        var categoriesQueryFilter = CreateCategoryQueryFilter(Name: "Some Name");
        var category1 = new Category
        {
            Name="Some Name"
        };
        var category2 = new Category
        {
            Name="Some Other Name"
        };
        await _sct.CreateCategoryAsync(category1);
        await _sct.CreateCategoryAsync(category2);

        // Act
        var result = await _sct.GetAllCategoriesAsync(categoriesQueryFilter);

        // Assert
        result.Should().HaveCount(2);
        result.Should().ContainEquivalentOf(category1, TestHelpers.Config<Category>());
        result.Should().ContainEquivalentOf(category2, TestHelpers.Config<Category>());

        _categoriesToDelete.Add(category1.Id);
        _categoriesToDelete.Add(category2.Id);
    }
    [Fact]
    public async Task CreateCategoryAsync_ShouldCreateCategory_WhenCategoryIsValid()
    {
        // Arrange
        var category = new Category
        {
            Name = "Some Name"
        };

        // Act
        var result = await _sct.CreateCategoryAsync(category);

        // Assert
        result.Should().BeTrue();

        _categoriesToDelete.Add(category.Id);
    }
    [Fact]
    public async Task UpdateCategoryAsync_ShouldUpdateCategory_WhenCategoryIsValid()
    {
        // Arrange
        var category = new Category
        {
            Name = "Some Name"
        };
        await _sct.CreateCategoryAsync(category);
        category.Name = "Some Other Name";

        // Act
        var result = await _sct.UpdateCategoryAsync(category);
        var newCategory = await _sct.GetCategoryByIdAsync(category.Id);

        // Assert
        result.Should().BeTrue();
        newCategory.Should().NotBeNull();
        newCategory!.Name.Should().Be("Some Other Name");

        _categoriesToDelete.Add(category.Id);
    }
    [Fact]
    public async Task DeleteCategoryAsync_ShouldDeleteCategory_WhenCategoryExists()
    {
        // Arrange
        var category = new Category
        {
            Name = "Some Name"
        };
        await _sct.CreateCategoryAsync(category);

        // Act
        var result = await _sct.DeleteCategoryAsync(category.Id);
        var newCategory = await _sct.GetCategoryByIdAsync(category.Id, true);

        // Assert
        result.Should().BeTrue();
        newCategory.Should().NotBeNull();
        newCategory!.IsDeleted.Should().BeTrue();

        _categoriesToDelete.Add(category.Id);
    }
    [Fact]
    public async Task GetCategoryByIdAsync_ShouldReturnCategory_WhenCategoryExists()
    {
        // Arrange
        var category = new Category
        {
            Name = "Some Name"
        };
        await _sct.CreateCategoryAsync(category);

        // Act
        var result = await _sct.GetCategoryByIdAsync(category.Id);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEquivalentTo(category, TestHelpers.Config<Category>());

        _categoriesToDelete.Add(category.Id);
    }

    [Fact]
    public async Task GetUserByIdAsync_ShouldReturnNull_WhenUserDoesNotExist()
    {
        // Arrange
        var categoryId = "642c2c29364bc2e1aa766056";

        // Act
        var result = await _sct.GetCategoryByIdAsync(categoryId);

        // Assert
        result.Should().BeNull();
    }
    [Fact]
    public async Task GetCategoryWithNameAsync_ShouldReturnCategory_WhenCategoryExists()
    {
        // Arrange
        var category = new Category
        {
            Name = "Some Name"
        };
        await _sct.CreateCategoryAsync(category);

        // Act
        var result = await _sct.GetCategoryWithNameAsync(category.Name);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEquivalentTo(category, TestHelpers.Config<Category>());
    }

    [Fact]
    public async Task GetCategoryWithNameAsync_ShouldReturnNull_WhenCategoryDoesNotExist()
    {
        // Arrange
        var name = "@!@";

        // Act
        var result = await _sct.GetCategoryWithNameAsync(name);

        // Assert
        result.Should().BeNull();
    }
    private static CategoryQueryFilter CreateCategoryQueryFilter(
        int pageNumber = 1,
        int pageSize = 10,
        string? sortColumn = null,
        string? sortDirection = "asc",
        string? Name = null,
        DateTime? minCreatedAtUtc = null,
        DateTime? maxCreatedAtUtc = null,
        bool showDeleted = false)
    {
        return new()
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            SortColumn = sortColumn,
            SortDirection = sortDirection,
            Name = Name,
            MinCreatedAtUtc = minCreatedAtUtc,
            MaxCreatedAtUtc = maxCreatedAtUtc,
            ShowDeleted = showDeleted
        };
    }
    private async Task DeleteCategories()
    {
        foreach (var categoryId in _categoriesToDelete)
        {
            await _sct.DeleteCategoryAsync(categoryId);
        }
    }
}
