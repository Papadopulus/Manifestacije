namespace Manifestacije.Api.Tests.Integration;

public sealed class CategoryRepositoryTests : IClassFixture<ManifestacijeApiFactory>
{
    private readonly CategoryRepository _sut;

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
            CategoriesCollectionName = "categories"
        });
        _sut = new CategoryRepository(databaseSettings);
    }

    [Fact]
    public async Task GetAllCategoriesAsync_ShouldReturnEmptyList_WhenNoCategoryExist()
    {
        // Arrange
        var categoriesQueryFilter = CreateCategoryQueryFilter(Name: "Zdenkijada");

        // Act
        var result = await _sut.GetAllCategoriesAsync(categoriesQueryFilter);

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllCategoriesAsync_ShouldReturnAllCategories_WhenCategoriesExist()
    {
        // Arrange
        var categoriesQueryFilter = CreateCategoryQueryFilter(Name: "Zdenkijada", intersection: false);
        var category1 = new Category
        {
            Name = "Zdenkijada"
        };
        var category2 = new Category
        {
            Name = "Zdenkijada"
        };
        await _sut.CreateCategoryAsync(category1);
        await _sut.CreateCategoryAsync(category2);

        // Act
        var result = await _sut.GetAllCategoriesAsync(categoriesQueryFilter);

        // Assert
        result.Should().HaveCount(2);
        result.Should().ContainEquivalentOf(category1, TestHelpers.Config<Category>());
        result.Should().ContainEquivalentOf(category2, TestHelpers.Config<Category>());
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
        var result = await _sut.CreateCategoryAsync(category);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task UpdateCategoryAsync_ShouldUpdateCategory_WhenCategoryIsValid()
    {
        // Arrange
        var category = new Category
        {
            Name = "Some Name"
        };
        await _sut.CreateCategoryAsync(category);
        category.Name = "Some Other Name";

        // Act
        var result = await _sut.UpdateCategoryAsync(category);
        var newCategory = await _sut.GetCategoryByIdAsync(category.Id);

        // Assert
        result.Should().BeTrue();
        newCategory.Should().NotBeNull();
        newCategory!.Name.Should().Be("Some Other Name");
    }

    [Fact]
    public async Task DeleteCategoryAsync_ShouldDeleteCategory_WhenCategoryExists()
    {
        // Arrange
        var category = new Category
        {
            Name = "Some Name"
        };
        await _sut.CreateCategoryAsync(category);

        // Act
        var result = await _sut.DeleteCategoryAsync(category.Id);
        var newCategory = await _sut.GetCategoryByIdAsync(category.Id, true);

        // Assert
        result.Should().BeTrue();
        newCategory.Should().NotBeNull();
        newCategory!.IsDeleted.Should().BeTrue();
    }

    [Fact]
    public async Task GetCategoryByIdAsync_ShouldReturnCategory_WhenCategoryExists()
    {
        // Arrange
        var category = new Category
        {
            Name = "Some Name"
        };
        await _sut.CreateCategoryAsync(category);

        // Act
        var result = await _sut.GetCategoryByIdAsync(category.Id);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEquivalentTo(category, TestHelpers.Config<Category>());
    }

    [Fact]
    public async Task GetUserByIdAsync_ShouldReturnNull_WhenUserDoesNotExist()
    {
        // Arrange
        var categoryId = "642c2c29364bc2e1aa766056";

        // Act
        var result = await _sut.GetCategoryByIdAsync(categoryId);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetCategoryWithNameAsync_ShouldReturnCategory_WhenCategoryExists()
    {
        // Arrange
        var category = new Category
        {
            Name = "Some C"
        };
        await _sut.CreateCategoryAsync(category);

        // Act
        var result = await _sut.GetCategoryWithNameAsync(category.Name, category.IsDeleted);

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
        var result = await _sut.GetCategoryWithNameAsync(name);

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
        bool intersection = true,
        bool showDeleted = false)
    {
        return new CategoryQueryFilter
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            SortColumn = sortColumn,
            SortDirection = sortDirection,
            Name = Name,
            MinCreatedAtUtc = minCreatedAtUtc,
            MaxCreatedAtUtc = maxCreatedAtUtc,
            Intersection = intersection,
            ShowDeleted = showDeleted
        };
    }
}