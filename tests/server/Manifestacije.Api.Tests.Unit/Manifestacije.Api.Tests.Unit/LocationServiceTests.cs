﻿namespace Manifestacije.Api.Tests.Unit;

public sealed class LocationServiceTests
{
    private readonly ILocationRepository _locationRepository = Substitute.For<ILocationRepository>();
    private readonly IPartnerRepository _partnerRepository = Substitute.For<IPartnerRepository>();
    private readonly LocationService _sut;

    public LocationServiceTests()
    {
        _sut = new LocationService(_locationRepository, _partnerRepository);
    }

    [Fact]
    public async Task GetAllLocationsAsync_ShouldReturnEmptyList_WhenNoLocationsExit()
    {
        // Arrange
        _locationRepository.GetAllLocationsAsync(Arg.Any<LocationQueryFilter>()).Returns(new List<Location>());

        // Act
        var result = await _sut.GetAllLocationsAsync(new LocationQueryFilter());

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllLocationsAsync_ShouldReturnListOfLocations_WhenLocationsExists()
    {
        // Arrange
        var locations = new List<Location>
        {
            new()
            {
                Id = "1",
                Name = "Location1"
            }
        };
        _locationRepository.GetAllLocationsAsync(Arg.Any<LocationQueryFilter>()).Returns(locations);

        // Act
        var result = await _sut.GetAllLocationsAsync(new LocationQueryFilter());

        // Assert
        result.Should().BeEquivalentTo(locations);
    }

    [Fact]
    public async Task GetLocationByIdAsync_ShouldReturnNull_WhenLocationsDoesntExists()
    {
        // Arrange
        _locationRepository.GetLocationByIdAsync(Arg.Any<string>()).Returns((Location?)null);

        // Act
        var result = await _sut.GetLocationByIdAsync("1");

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetLocationByIdAsync_ShouldReturnLocation_WhenLocationsExists()
    {
        // Arrange
        var location = new Location
        {
            Id = "1",
            Name = "location1"
        };
        _locationRepository.GetLocationByIdAsync(Arg.Any<string>()).Returns(location);

        // Act
        var result = await _sut.GetLocationByIdAsync("1");

        // Assert
        result.Should().BeEquivalentTo(location);
    }

    [Fact]
    public async Task CreateLocationAsync_ShouldReturnInvalidInputException_WhenLocationWithNameExists()
    {
        // Arrange
        var locationCreateRequest = new LocationCreateRequest
        {
            Name = "location1"
        };
        _locationRepository.GetLocationByNameAsync(Arg.Any<string>()).Returns(new Location
        {
            Name = "null",
            Id = "null"
        });

        // Act
        Func<Task> result = async () => await _sut.CreateLocationAsync(locationCreateRequest);

        // Assert
        await result.Should()
            .ThrowExactlyAsync<InvalidInputException>()
            .WithMessage("Location with a given name already exists");
    }

    [Fact]
    public async Task CreateLocationAsync_ShouldReturnDatabaseException_WhenLocationCreationFails()
    {
        // Arrange
        var locationRequest = new LocationCreateRequest
        {
            Name = "location1",
            AccommodationPartnerId = null,
            TransportPartnerId = null
        };
        _locationRepository.GetLocationByNameAsync(Arg.Any<string>()).Returns((Location?)null);
        _locationRepository.CreateLocationAsync(Arg.Any<Location>()).Returns(false);
        // Act
        Func<Task> result = async () => await _sut.CreateLocationAsync(locationRequest);
        // Assert
        await result
            .Should()
            .ThrowExactlyAsync<DatabaseException>()
            .WithMessage("Failed to create location");
    }

    [Fact]
    public async Task CreateLocationAsync_ShouldReturnException_WhenPartnerAccommodationAlreadyExists()
    {
        // Arrange
        var locationRequest = new LocationCreateRequest
        {
            Name = "location1",
            AccommodationPartnerId = "1234",
            TransportPartnerId = null
        };
        _locationRepository.GetLocationByNameAsync(Arg.Any<string>()).Returns((Location?)null);
        _partnerRepository.GetPartnerByIdAsync(Arg.Any<string>()).Returns((Partner?)null);

        // Act
        Func<Task> result = async () => await _sut.CreateLocationAsync(locationRequest);
        // Assert
        await result
            .Should()
            .ThrowExactlyAsync<NotFoundException>()
            .WithMessage("Partner with a given id does not exist");
    }

    [Fact]
    public async Task CreateLocationAsync_ShouldReturnException_WhenPartnerTransportAlreadyExists()
    {
        // Arrange
        var locationRequest = new LocationCreateRequest
        {
            Name = "location1",
            AccommodationPartnerId = null,
            TransportPartnerId = "123241"
        };
        _locationRepository.GetLocationByNameAsync(Arg.Any<string>()).Returns((Location?)null);
        _partnerRepository.GetPartnerByIdAsync(Arg.Any<string>()).Returns((Partner?)null);

        // Act
        Func<Task> result = async () => await _sut.CreateLocationAsync(locationRequest);
        // Assert
        await result
            .Should()
            .ThrowExactlyAsync<NotFoundException>()
            .WithMessage("Partner with a given id does not exist");
    }

    [Fact]
    public async Task CreateLocationsAsync_ShouldReturnLocation_WhenCreateLocationSucceeds()
    {
        // Arrange
        var locationCreateRequest = new LocationCreateRequest
        {
            Name = "location1",
            TransportPartnerId = "456",
            AccommodationPartnerId = "123"
        };
        var partnerPartialAccommodation = new PartnerPartial
        {
            Id = "123",
            Name = "AccommodationP",
            Url = ""
        };
        var partnerPartialTransport = new PartnerPartial
        {
            Id = "456",
            Name = "TransportP",
            Url = "",
        };
        var partnerAccommodation = new Partner
        {
            Id = "123",
            Name = "AccommodationP",
            Url = "",
            PhoneNumber = "null",
            Email = "null"
        };
        var partnerTransport = new Partner
        {
            Id = "456",
            Name = "TransportP",
            Url = "",
            PhoneNumber = "null",
            Email = "null"
        };
        var location = new Location
        {
            Name = "location1",
            TransportPartner = partnerPartialTransport,
            AccommodationPartner = partnerPartialAccommodation,
            Id = null
        };

        _locationRepository.GetLocationByNameAsync(Arg.Any<string>()).Returns((Location?)null);
        _partnerRepository.GetPartnerByIdAsync("456").Returns(partnerTransport);
        _partnerRepository.GetPartnerByIdAsync("123").Returns(partnerAccommodation);
        _locationRepository.CreateLocationAsync(Arg.Any<Location>()).Returns(true);
        // Act
        var result = await _sut.CreateLocationAsync(locationCreateRequest);
        // Assert
        result.Should()
            .BeEquivalentTo(location, TestHelpers.Config<Location>());
    }

    [Fact]
    public async Task UpdateLocationAsync_ShouldReturnNull_WhenLocationDoesntExists()
    {
        // Arrange
        var location = new Location
        {
            Id = "123",
            Name = "location1",
        };
        var locationUpdateRequest = new LocationUpdateRequest
        {
            Name = "locationUpdate"
        };
        _locationRepository.GetLocationByIdAsync(Arg.Any<string>()).Returns((Location?)null);
        // Act
        var result = await _sut.UpdateLocationAsync(location.Id, locationUpdateRequest);
        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateLocationAsync_ShouldReturnDataBaseException_WhenLocationUpdateFails()
    {
        // Arrange
        var location = new Location
        {
            Id = "123",
            Name = "location1"
        };
        var locationUpdateRequest = new LocationUpdateRequest
        {
            Name = "locationUpdate"
        };
        _locationRepository.GetLocationByIdAsync(Arg.Any<string>()).Returns(location);
        _locationRepository.UpdateLocationAsync(Arg.Any<Location>()).Returns(false);

        // Act
        Func<Task> result = async () => await _sut.UpdateLocationAsync(location.Id, locationUpdateRequest);
        // Assert
        await result.Should()
            .ThrowExactlyAsync<DatabaseException>()
            .WithMessage("Failed to update Location");
    }

    [Fact]
    public async Task UpdateLocationAsync_ShouldReturnLocation_WhenLocationUpdateSucceeds()
    {
        // Arrange
        var location = new Location
        {
            Id = "123",
            Name = "location1"
        };
        var locationUpdateRequest = new LocationUpdateRequest
        {
            Name = "locationUpdate"
        };
        _locationRepository.GetLocationByIdAsync(Arg.Any<string>()).Returns(location);
        _locationRepository.UpdateLocationAsync(Arg.Any<Location>()).Returns(true);
        // Act
        var result = await _sut.UpdateLocationAsync(location.Id, locationUpdateRequest);
        // Assert
        result.Should().BeEquivalentTo(location);
    }

    [Fact]
    public async Task DeleteLocationAsync_ShouldReturnFalse_WhenLocationDoesntExists()
    {
        // Arrange
        _locationRepository.GetLocationByIdAsync(Arg.Any<string>()).Returns((Location?)null);
        // Act
        var result = await _sut.DeleteLocationAsync("1");
        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteLocationAsync_ShouldReturnTrue_WhenLocationExists()
    {
        // Arrange
        var location = new Location
        {
            Id = "123",
            Name = "location1"
        };
        _locationRepository.GetLocationByIdAsync(Arg.Any<string>()).Returns(location);
        _locationRepository.UpdateLocationAsync(Arg.Any<Location>()).Returns(true);
        // Act
        var result = await _sut.DeleteLocationAsync("123");
        // Assert
        result.Should().BeTrue();
    }
}