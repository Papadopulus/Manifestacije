namespace Manifestacije.Api.Tests.Integration;

public sealed class UserRepositoryTests : IClassFixture<ManifestacijeApiFactory>
{
    private readonly UserRepository _sut;

    public UserRepositoryTests(ManifestacijeApiFactory factory)
    {
        factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
        var databaseSettings = Options.Create(new DatabaseSettings
        {
            ConnectionString = "mongodb://localhost:27018",
            DatabaseName = "manifestacije-test",
            UsersCollectionName = "users",
            LocationsCollectionName = null,
            PartnersCollectionName = null,
            CategoriesCollectionName = null,
            OrganizationsCollectionName = null,
            EventsCollectionName = null,
            ReviewsCollectionName = null
        });

        _sut = new UserRepository(databaseSettings);
    }

    [Fact]
    public async Task GetAllUsersAsync_ShouldReturnEmptyList_WhenNoUsersExist()
    {
        // Arrange
        var usersQueryFilter = CreateUserQueryFilter(firstName: "Milos Obilic");

        // Act
        var result = await _sut.GetAllUsersAsync(usersQueryFilter);

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllUsersAsync_ShouldReturnAllUsers_WhenUsersExist()
    {
        // Arrange
        var usersQueryFilter = CreateUserQueryFilter(firstName: "John", lastName: "Doe", intersection: false);
        var user1 = new User
        {
            FirstName = "John",
            LastName = "Doe",
            Email = ""
        };
        var user2 = new User
        {
            FirstName = "Jane",
            LastName = "Doe",
            Email = ""
        };
        await _sut.CreateUserAsync(user1);
        await _sut.CreateUserAsync(user2);

        // Act
        var result = await _sut.GetAllUsersAsync(usersQueryFilter);

        // Assert
        result.Should().HaveCount(2);
        result.Should().ContainEquivalentOf(user1, TestHelpers.Config<User>());
        result.Should().ContainEquivalentOf(user2, TestHelpers.Config<User>());
    }

    [Fact]
    public async Task GetAllUsersAsync_ShouldReturnFilteredUsers_WhenWePassFilterMinMax()
    {
        // Arrange
        var usersQueryFilter = CreateUserQueryFilter(minCreatedAtUtc: DateTime.UtcNow.AddDays(-2),
            maxCreatedAtUtc: DateTime.UtcNow.AddHours(-1));
        var user1 = new User
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "",
            CreatedAtUtc = DateTime.UtcNow
        };
        var user2 = new User
        {
            FirstName = "Jane",
            LastName = "Doe",
            Email = "",
            CreatedAtUtc = DateTime.UtcNow.AddDays(-1)
        };
        var user3 = new User
        {
            FirstName = "Johana",
            LastName = "Doe",
            Email = "",
            CreatedAtUtc = DateTime.UtcNow.AddDays(2)
        };
        await _sut.CreateUserAsync(user1);
        await _sut.CreateUserAsync(user2);
        await _sut.CreateUserAsync(user3);

        // Act
        var result = await _sut.GetAllUsersAsync(usersQueryFilter);

        // Assert
        result.Should().HaveCount(1);
        result.Should().ContainEquivalentOf(user2, TestHelpers.Config<User>());
    }

    [Fact]
    public async Task CreateUserAsync_ShouldCreateUser_WhenUserIsValid()
    {
        // Arrange
        var user = new User
        {
            FirstName = "John",
            LastName = "Doe",
            Email = ""
        };

        // Act
        var result = await _sut.CreateUserAsync(user);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task UpdateUserAsync_ShouldUpdateUser_WhenUserIsValid()
    {
        // Arrange
        var user = new User
        {
            FirstName = "FName",
            LastName = "Lname",
            Email = ""
        };
        await _sut.CreateUserAsync(user);
        user.FirstName = "PName";

        // Act
        var result = await _sut.UpdateUserAsync(user);
        var newUser = await _sut.GetUserByIdAsync(user.Id);

        // Assert
        result.Should().BeTrue();
        newUser.Should().NotBeNull();
        newUser!.FirstName.Should().Be("PName");
    }

    [Fact]
    public async Task DeleteUserAsync_ShouldDeleteUser_WhenUserExists()
    {
        // Arrange
        var user = new User
        {
            FirstName = "FName",
            LastName = "Lname",
            Email = ""
        };
        await _sut.CreateUserAsync(user);

        // Act
        var result = await _sut.DeleteUserAsync(user.Id);
        var newUser = await _sut.GetUserByIdAsync(user.Id, true);

        // Assert
        result.Should().BeTrue();
        newUser.Should().NotBeNull();
        newUser!.IsDeleted.Should().BeTrue();
    }

    [Fact]
    public async Task GetUserByIdAsync_ShouldReturnUser_WhenUserExists()
    {
        // Arrange
        var user = new User
        {
            FirstName = "UserName",
            LastName = "UserLastName",
            Email = ""
        };
        await _sut.CreateUserAsync(user);

        // Act
        var result = await _sut.GetUserByIdAsync(user.Id);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEquivalentTo(user, TestHelpers.Config<User>());
    }

    [Fact]
    public async Task GetUserByIdAsync_ShouldReturnNull_WhenUserDoesNotExist()
    {
        // Arrange
        var userId = "5f9f1c5b9c9d2b0b8c8c1c5d";

        // Act
        var result = await _sut.GetUserByIdAsync(userId);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetUserWithEmailAsync_ShouldReturnUser_WhenUserExists()
    {
        // Arrange
        var user = new User
        {
            FirstName = "UserName",
            LastName = "UserLastName",
            Email = "test@test.rs"
        };
        await _sut.CreateUserAsync(user);

        // Act
        var result = await _sut.GetUserWithEmailAsync(user.Email);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEquivalentTo(user, TestHelpers.Config<User>());
    }

    [Fact]
    public async Task GetUserWithEmailAsync_ShouldReturnNull_WhenUserDoesNotExist()
    {
        // Arrange
        var email = "test@test.rs.rs";

        // Act
        var result = await _sut.GetUserWithEmailAsync(email);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetUserWithRefreshTokenAsync_ShouldReturnUser_WhenTokenExists()
    {
        // Arrange
        var user = new User
        {
            FirstName = "UserName",
            LastName = "UserLastName",
            RefreshTokens = new List<RefreshToken>
            {
                new()
                {
                    ExpireDate = DateTime.UtcNow.AddDays(1),
                    Token = "Token"
                }
            },
            Email = null
        };
        await _sut.CreateUserAsync(user);

        // Act
        var result = await _sut.GetUserWithRefreshTokenAsync("Token");

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEquivalentTo(user, TestHelpers.Config<User>());
    }

    [Fact]
    public async Task GetUserWithRefreshTokenAsync_ShouldReturnNull_WhenTokenDoesNotExist()
    {
        // Arrange

        // Act
        var result = await _sut.GetUserWithRefreshTokenAsync("Token2");

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetAllUsersAsync_ShouldReturnAllUsersSorted_WhenWeSort()
    {
        // Arrange
        var user1 = new User
        {
            FirstName = "01PrviUser",
            LastName = "01PrviUser",
            Email = ""
        };
        var user2 = new User
        {
            FirstName = "02DrugiUser",
            LastName = "01PrviUser",
            Email = ""
        };
        await _sut.CreateUserAsync(user1);
        await _sut.CreateUserAsync(user2);

        // Act
        var result = await _sut.GetAllUsersAsync(CreateUserQueryFilter(sortDirection: "desc", sortColumn: "FirstName",
            lastName: "01PrviUser"));

        // Assert
        result.Should().HaveCount(2);
        result.First().Should().BeEquivalentTo(user2, TestHelpers.Config<User>());
        result.Last().Should().BeEquivalentTo(user1, TestHelpers.Config<User>());
    }

    [Fact]
    public async Task GetAllUsersAsync_ShouldReturnOneUser_WhenWePaginate()
    {
        // Arrange
        var user1 = new User
        {
            FirstName = "03PrviUser",
            LastName = "03PrviUser",
            Email = ""
        };
        var user2 = new User
        {
            FirstName = "04DrugiUser",
            LastName = "03PrviUser",
            Email = ""
        };
        await _sut.CreateUserAsync(user1);
        await _sut.CreateUserAsync(user2);

        // Act
        var result = await _sut.GetAllUsersAsync(CreateUserQueryFilter(sortDirection: "asc", sortColumn: "FirstName",
            pageNumber: 1, pageSize: 1,
            lastName: "03PrviUser"));

        // Assert
        result.Should().HaveCount(1);
        result.Should().ContainEquivalentOf(user1, TestHelpers.Config<User>());
    }

    private static UserQueryFilter CreateUserQueryFilter(
        int pageNumber = 1,
        int pageSize = 10,
        string? sortColumn = null,
        string? sortDirection = "asc",
        string? firstName = null,
        string? lastName = null,
        string? email = null,
        DateTime? minCreatedAtUtc = null,
        DateTime? maxCreatedAtUtc = null,
        bool intersection = true,
        bool showDeleted = false)
    {
        return new UserQueryFilter
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            SortColumn = sortColumn,
            SortDirection = sortDirection,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            MinCreatedAtUtc = minCreatedAtUtc,
            MaxCreatedAtUtc = maxCreatedAtUtc,
            Intersection = intersection,
            ShowDeleted = showDeleted
        };
    }
}