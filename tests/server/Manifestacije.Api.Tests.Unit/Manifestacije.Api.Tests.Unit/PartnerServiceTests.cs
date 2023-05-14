// namespace Manifestacije.Api.Tests.Unit;
//
// public class PartnerServiceTests
// {
//     private readonly ILocationRepository _locationRepository = Substitute.For<ILocationRepository>();
//     private readonly IPartnerRepository _partnerRepository = Substitute.For<IPartnerRepository>();
//     private readonly PartnerService _sut;
//
//     public PartnerServiceTests()
//     {
//         _sut = new PartnerService(_partnerRepository, _locationRepository);
//     }
//
//     [Fact]
//     public async Task GetAllPartnersAsync_ShouldReturnEmptyList_WhenNoPartnersExit()
//     {
//         // Arrange
//         _partnerRepository.GetAllPartnersAsync(Arg.Any<PartnerQueryFilter>()).Returns(new List<Partner>());
//
//         // Act
//         var result = await _sut.GetAllPartnersAsync(new PartnerQueryFilter());
//
//         // Assert
//         result.Should().BeEmpty();
//     }
//
//     [Fact]
//     public async Task GetAllPartnersAsync_ShouldReturnListOfPartners_WhenPartnersExists()
//     {
//         // Arrange
//         var partners = new List<Partner>
//         {
//             new()
//             {
//                 Id = "1",
//                 Name = "Partner1",
//                 PhoneNumber = null,
//                 Email = null,
//                 Url = null
//             }
//         };
//         _partnerRepository.GetAllPartnersAsync(Arg.Any<PartnerQueryFilter>()).Returns(partners);
//
//         // Act
//         var result = await _sut.GetAllPartnersAsync(new PartnerQueryFilter());
//
//         // Assert
//         result.Should().BeEquivalentTo(partners);
//     }
//
//     [Fact]
//     public async Task GetPartnerByIdAsync_ShouldReturnNull_WhenPartnerDoesntExists()
//     {
//         // Arrange
//         _partnerRepository.GetPartnerByIdAsync(Arg.Any<string>()).Returns((Partner?)null);
//
//         // Act
//         var result = await _sut.GetPartnerByIdAsync("1");
//
//         // Assert
//         result.Should().BeNull();
//     }
//
//     [Fact]
//     public async Task GetPartnerByIdAsync_ShouldReturnPartner_WhenPartnerExists()
//     {
//         // Arrange
//         var partner = new Partner
//         {
//             Id = "1",
//             Name = "Partner1",
//             PhoneNumber = null,
//             Email = null,
//             Url = null
//         };
//         _partnerRepository.GetPartnerByIdAsync(Arg.Any<string>()).Returns(partner);
//
//         // Act
//         var result = await _sut.GetPartnerByIdAsync("1");
//
//         // Assert
//         result.Should().BeEquivalentTo(partner);
//     }
//
//     [Fact]
//     public async Task CreatePartnerAsync_ShouldThrowException_WhenPartnerExists()
//     {
//         // Arrange
//         _partnerRepository.GetPartnerByNameAsync(Arg.Any<string>()).Returns(new Partner
//         {
//             Name = null,
//             PhoneNumber = null,
//             Email = null,
//             Url = null
//         });
//
//         // Act
//         Func<Task> result = async () => await _sut.CreatePartnerAsync(new PartnerCreateRequest
//         {
//             Name = null,
//             PhoneNumber = null,
//             Email = null,
//             Url = null
//         });
//
//         // Assert
//         await result.Should()
//             .ThrowExactlyAsync<InvalidInputException>()
//             .WithMessage("Partner with a given name already exists");
//     }
//
//     [Fact]
//     public async Task CreatePartnerAsync_ShouldAddLocationsAndCreatePartner_WhenLocationsAreNotNull()
//     {
//         // Arrange
//         var partnerCreateRequest = new PartnerCreateRequest
//         {
//             Name = "Partner1",
//             PhoneNumber = null,
//             Email = null,
//             Url = null
//         };
//         var locations = new List<Location>
//         {
//             new()
//             {
//                 Id = "1",
//                 Name = "Location1"
//             },
//             new()
//             {
//                 Id = "2",
//                 Name = "Location2"
//             }
//         };
//         _partnerRepository.CreatePartnerAsync(Arg.Any<Partner>()).Returns(true);
//
//         // Act
//         var result = await _sut.CreatePartnerAsync(partnerCreateRequest);
//
//         // Assert
//         await _locationRepository.Received(2).GetLocationByIdAsync(Arg.Any<string>());
//         await _partnerRepository.Received(1).CreatePartnerAsync(Arg.Any<Partner>());
//         result.Name.Should().Be(partnerCreateRequest.Name);
//     }
//
//     [Fact]
//     public async Task CreatePartnerAsync_ShouldThrowException_WhenLocationsAreInvalid()
//     {
//         // Arrange
//         var partnerCreateRequest = new PartnerCreateRequest
//         {
//             Name = "Partner1",
//             Locations = new List<string>
//             {
//                 "1",
//                 "2"
//             },
//             PhoneNumber = null,
//             Email = null,
//             Url = null
//         };
//         var locations = new List<Location>
//         {
//             new()
//             {
//                 Id = "1",
//                 Name = "Location1"
//             },
//             new()
//             {
//                 Id = "2",
//                 Name = "Location2"
//             }
//         };
//         _locationRepository.GetLocationByIdAsync("1").Returns(locations[0]);
//         _locationRepository.GetLocationByIdAsync("2").Returns((Location?)null);
//         _partnerRepository.CreatePartnerAsync(Arg.Any<Partner>()).Returns(true);
//
//         // Act
//         Func<Task> result = async () => await _sut.CreatePartnerAsync(partnerCreateRequest);
//
//         // Assert
//         await result
//             .Should()
//             .ThrowExactlyAsync<NotFoundException>()
//             .WithMessage("Location does not exist");
//     }
//
//     [Fact]
//     public async Task CreatePartnerAsync_ShouldThrowException_WhenDatabaseThrowsException()
//     {
//         // Arrange
//         var partnerCreateRequest = new PartnerCreateRequest
//         {
//             Name = "Partner1",
//             Locations = new List<string>
//             {
//                 "1",
//                 "2"
//             },
//             PhoneNumber = null,
//             Email = null,
//             Url = null
//         };
//         var locations = new List<Location>
//         {
//             new()
//             {
//                 Id = "1",
//                 Name = "Location1"
//             },
//             new()
//             {
//                 Id = "2",
//                 Name = "Location2"
//             }
//         };
//         _locationRepository.GetLocationByIdAsync("1").Returns(locations[0]);
//         _locationRepository.GetLocationByIdAsync("2").Returns(locations[0]);
//         _partnerRepository.CreatePartnerAsync(Arg.Any<Partner>()).Returns(false);
//
//         // Act
//         Func<Task> result = async () => await _sut.CreatePartnerAsync(partnerCreateRequest);
//
//         // Assert
//         await result
//             .Should()
//             .ThrowExactlyAsync<DatabaseException>()
//             .WithMessage("Failed to create Partner");
//     }
//
//     [Fact]
//     public async Task UpdatePartnerAsync_ShouldReturnNull_WhenPartnerDoesntExists()
//     {
//         // Arrange
//         _partnerRepository.GetPartnerByIdAsync(Arg.Any<string>()).Returns((Partner?)null);
//
//         // Act
//         var result = await _sut.UpdatePartnerAsync("1", new PartnerUpdateRequest
//         {
//             Name = null,
//             PhoneNumber = null
//         });
//
//         // Assert
//         result.Should().BeNull();
//     }
//
//     [Fact]
//     public async Task UpdatePartnerAsync_ShouldThrowAnException_WhenUpdateFails()
//     {
//         // Arrange
//         var partner = new Partner
//         {
//             Id = "1",
//             Name = "Partner1",
//             PhoneNumber = null,
//             Email = null,
//             Url = null
//         };
//         _partnerRepository.GetPartnerByIdAsync(Arg.Any<string>()).Returns(partner);
//         _partnerRepository.UpdatePartnerAsync(Arg.Any<Partner>()).Returns(false);
//
//         // Act
//         Func<Task> result = async () => await _sut.UpdatePartnerAsync("1", new PartnerUpdateRequest
//         {
//             Name = null,
//             PhoneNumber = null
//         });
//
//         // Assert
//         await result.Should()
//             .ThrowExactlyAsync<DatabaseException>()
//             .WithMessage("Failed to update Partner");
//     }
//
//     [Fact]
//     public async Task UpdatePartnerAsync_ShouldReturnPartner_WhenPartnerAndLocationExists()
//     {
//         // Arrange
//         var partner = new Partner
//         {
//             Id = "1",
//             Name = "Partner1",
//             PhoneNumber = null,
//             Email = null,
//             Url = null
//         };
//         var location = new Location
//         {
//             Id = "1",
//             Name = "Location1"
//         };
//         _partnerRepository.GetPartnerByIdAsync(Arg.Any<string>()).Returns(partner);
//         _locationRepository.GetLocationByIdAsync(Arg.Any<string>()).Returns(location);
//         _partnerRepository.UpdatePartnerAsync(Arg.Any<Partner>()).Returns(true);
//
//         // Act
//         var result = await _sut.UpdatePartnerAsync("1", new PartnerUpdateRequest
//         {
//             Name = null,
//             PhoneNumber = null
//         });
//
//         // Assert
//         result.Should().BeEquivalentTo(partner);
//     }
//
//     [Fact]
//     public async Task DeletePartnerAsync_ShouldReturnFalse_WhenPartnerDoesntExists()
//     {
//         // Arrange
//         _partnerRepository.GetPartnerByIdAsync(Arg.Any<string>()).Returns((Partner?)null);
//
//         // Act
//         var result = await _sut.DeletePartnerAsync("1");
//
//         // Assert
//         result.Should().BeFalse();
//     }
//
//     [Fact]
//     public async Task DeletePartnerAsync_ShouldReturnTrue_WhenPartnerExists()
//     {
//         // Arrange
//         var partner = new Partner
//         {
//             Id = "1",
//             Name = "Partner1",
//             PhoneNumber = null,
//             Email = null,
//             Url = null
//         };
//         _partnerRepository.GetPartnerByIdAsync(Arg.Any<string>()).Returns(partner);
//         _partnerRepository.UpdatePartnerAsync(Arg.Any<Partner>()).Returns(true);
//
//         // Act
//         var result = await _sut.DeletePartnerAsync("1");
//
//         // Assert
//         result.Should().BeTrue();
//     }
// }