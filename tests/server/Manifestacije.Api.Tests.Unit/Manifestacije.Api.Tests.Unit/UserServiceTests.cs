using Manifestacije.Api.Exceptions;

namespace Manifestacije.Api.Tests.Unit;

public class UserServiceTests
{
    private readonly UserService _sut;
    private readonly IUserRepository _userRepository = Substitute.For<IUserRepository>();
    private readonly IMapper _mapper = Substitute.For<IMapper>();

    public UserServiceTests()
    {
        var inMemorySettings = new Dictionary<string, string> {
            {"Authorization:Secret", "ADADADADADADADADA"}
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
        
        _sut = new UserService(_userRepository, configuration, _mapper);
    }

    [Fact]
    public async Task GetAllUsersAsync_ShouldReturnEmptyList_WhenNoUsersExist()
    {
        // Arrange
        _userRepository.GetAllUsersAsync(Arg.Any<UserQueryFilter>()).Returns(new List<User>());

        // Act
        var result = await _sut.GetAllUsersAsync(new UserQueryFilter());

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllUsersAsync_ShouldReturnListOfUsers_WhenUsersExist()
    {
        // Arrange
        var users = new List<User>
        {
            new()
            {
                Id = "1",
                FirstName = "John",
                LastName = "Doe",
                Email = "test@test.rs"
            }
        };
        _userRepository.GetAllUsersAsync(Arg.Any<UserQueryFilter>()).Returns(users);

        // Act
        var result = await _sut.GetAllUsersAsync(new UserQueryFilter());

        // Assert
        result.Should().BeEquivalentTo(users);
    }

    [Fact]
    public async Task GetUserByIdAsync_ShouldReturnNull_WhenUserDoesNotExist()
    {
        // Arrange
        _userRepository.GetUserByIdAsync(Arg.Any<string>()).Returns((User?)null);

        // Act
        var result = await _sut.GetUserByIdAsync("1");

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetUserByIdAsync_ShouldReturnUser_WhenUserExists()
    {
        // Arrange
        var user = new User
        {
            Id = "1",
            FirstName = "John",
            LastName = "Doe",
            Email = "test@test.rs"
        };
        _userRepository.GetUserByIdAsync(Arg.Any<string>()).Returns(user);

        // Act
        var result = await _sut.GetUserByIdAsync("1");

        // Assert
        result.Should().BeEquivalentTo(user);
    }

    [Fact]
    public async Task CreateUserAsync_ShouldThrowInvalidInputException_WhenUserWithEmailExists()
    {
        // Arrange
        var userCreateRequest = new UserCreateRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "test@test.rs"
        };
        _userRepository.GetUserWithEmailAsync(Arg.Any<string>()).Returns(new User());

        // Act
        Func<Task> result = async () => await _sut.CreateUserAsync(userCreateRequest);

        // Assert
        await result.Should()
            .ThrowExactlyAsync<InvalidInputException>()
            .WithMessage("User with given email already exists");
    }

    [Fact]
    public async Task CreateUserAsync_ShouldThrowDatabaseException_WhenUserCreationFails()
    {
        // Arrange
        var userCreateRequest = new UserCreateRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "test@test.rs",
            Password = "$iFR4.1234"
        };
        var user = new User
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "test@test.rs"
        };
        _userRepository.GetUserWithEmailAsync(Arg.Any<string>()).Returns((User?)null);
        _userRepository.CreateUserAsync(Arg.Any<User>()).Returns(false);
        _mapper.Map<User>(Arg.Any<UserCreateRequest>()).Returns(user);

        // Act
        Func<Task> result = async () => await _sut.CreateUserAsync(userCreateRequest);

        // Assert
        await result.Should()
            .ThrowExactlyAsync<DatabaseException>()
            .WithMessage("Failed to create user");
    }

    [Fact]
    public async Task CreateUserAsync_ShouldReturnUser_WhenUserCreationSucceeds()
    {
        // Arrange
        var userCreateRequest = new UserCreateRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "test@test.rs",
            Password = "$iFR4.1234"
        };
        var user = new User
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "test@test.rs"
        };
        _userRepository.GetUserWithEmailAsync(Arg.Any<string>()).Returns((User?)null);
        _userRepository.CreateUserAsync(Arg.Any<User>()).Returns(true);
        _mapper.Map<User>(Arg.Any<UserCreateRequest>()).Returns(user);

        // Act
        var result = await _sut.CreateUserAsync(userCreateRequest);

        // Assert
        result.Should().BeEquivalentTo(user);
    }

    [Fact]
    public async Task UpdateUserAsync_ShouldThrowInvalidInputException_WhenUserDoesNotExist()
    {
        // Arrange
        var userUpdateRequest = new UserUpdateRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "test@test.rs",
        };
        _userRepository.GetUserByIdAsync(Arg.Any<string>()).Returns((User?)null);

        // Act
        Func<Task> result = async () => await _sut.UpdateUserAsync("1", userUpdateRequest);

        // Assert
        await result.Should()
            .ThrowExactlyAsync<InvalidInputException>()
            .WithMessage("User with given id does not exist");
    }

    [Fact]
    public async Task UpdateUserAsync_ShouldThrowDatabaseException_WhenUserUpdateFails()
    {
        // Arrange
        var userUpdateRequest = new UserUpdateRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "test@test.rs"
        };
        var user = new User
        {
            Id = "1",
            FirstName = "John",
            LastName = "Doe",
            Email = "test@test.rs",
        };
        _userRepository.GetUserByIdAsync(Arg.Any<string>()).Returns(user);
        _userRepository.UpdateUserAsync(Arg.Any<User>()).Returns(false);

        // Act
        Func<Task> result = async () => await _sut.UpdateUserAsync("1", userUpdateRequest);

        // Assert
        await result.Should()
            .ThrowExactlyAsync<DatabaseException>()
            .WithMessage("Failed to update the user");
    }

    [Fact]
    public async Task UpdateUserAsync_ShouldReturnUser_WhenUserUpdateSucceeds()
    {
        // Arrange
        var userUpdateRequest = new UserUpdateRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "test@test.rs"
        };
        var user = new User
        {
            Id = "1",
            FirstName = "John",
            LastName = "Doe",
            Email = "test@test.rs",
        };
        _userRepository.GetUserByIdAsync(Arg.Any<string>()).Returns(user);
        _userRepository.UpdateUserAsync(Arg.Any<User>()).Returns(true);

        // Act
        var result = await _sut.UpdateUserAsync("1", userUpdateRequest);

        // Assert
        result.Should().BeEquivalentTo(user);
    }

    [Fact]
    public async Task DeleteUserAsync_ShouldReturnFalse_WhenUserDoesNotExist()
    {
        // Arrange
        _userRepository.GetUserByIdAsync(Arg.Any<string>()).Returns((User?)null);

        // Act
        var result = await _sut.DeleteUserAsync("1");

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteUserAsync_ShouldReturnTrue_WhenUserExists()
    {
        // Arrange
        var user = new User
        {
            Id = "1",
            FirstName = "John",
            LastName = "Doe",
            Email = ""
        };
        _userRepository.GetUserByIdAsync(Arg.Any<string>()).Returns(user);
        _userRepository.UpdateUserAsync(Arg.Any<User>()).Returns(true);

        // Act
        var result = await _sut.DeleteUserAsync("1");

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task AuthenticateAsync_ShouldThrowInvalidInputException_WhenUserDoesNotExist()
    {
        // Arrange
        var userAuthenticateRequest = new AuthenticateRequest
        {
            Email = "test@test.rs",
            Password = "$iFR4.1234"
        };
        _userRepository.GetUserWithEmailAsync(Arg.Any<string>()).Returns((User?)null);

        // Act
        Func<Task> result = async () => await _sut.AuthenticateAsync(userAuthenticateRequest);

        // Assert
        await result.Should()
            .ThrowExactlyAsync<InvalidInputException>()
            .WithMessage("Incorrect email");
    }

    [Fact]
    public async Task AuthenticateAsync_ShouldThrowInvalidInputException_WhenPasswordIsIncorrect()
    {
        // Arrange
        var userAuthenticateRequest = new AuthenticateRequest
        {
            Email = "test@test.rs",
            Password = "$iFR4.1234"
        };
        var user = new User
        {
            Id = "1",
            FirstName = "John",
            LastName = "Doe",
            Email = "test@test.rs",
            PasswordHash = "$2a$11$Lrg6W7VadqexbwUxBSnaJe5F2UKJuyoYt10tClBEL4EICgwEDtROW",
            PasswordSalt = "$2a$11$Lrg6W7VadqexbwUxBSnaJe"
        };
        _userRepository.GetUserWithEmailAsync(Arg.Any<string>()).Returns(user);

        // Act
        Func<Task> result = async () => await _sut.AuthenticateAsync(userAuthenticateRequest);

        // Assert
        await result.Should()
            .ThrowExactlyAsync<InvalidInputException>()
            .WithMessage("Incorrect password");
    }

    [Fact]
    public async Task AuthenticateAsync_ShouldReturnAuthenticateResponse_WhenUserIsAuthenticated()
    {
        // Arrange
        var userAuthenticateRequest = new AuthenticateRequest
        {
            Email = "test@test.rs",
            Password = "Sifra.1234"
        };
        var user = new User
        {
            Id = "1",
            FirstName = "John",
            LastName = "Doe",
            Email = "test@test.rs",
            PasswordHash = "$2a$11$Lrg6W7VadqexbwUxBSnaJe5F2UKJuyoYt10tClBEL4EICgwEDtROW",
            PasswordSalt = "$2a$11$Lrg6W7VadqexbwUxBSnaJe"
        };
        _userRepository.GetUserWithEmailAsync(Arg.Any<string>()).Returns(user);

        // Act
        var result = await _sut.AuthenticateAsync(userAuthenticateRequest);

        // Assert
        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrEmpty();
        result.RefreshToken.Should().NotBeNullOrEmpty();
    }
}