using Manifestacije.Api.Extensions;
using Manifestacije.Api.Mappers;
using Manifestacije.Api.Models;

namespace Manifestacije.Api.Database;

public static class DbInitializer
{
    public static async Task InitializeAsync(IUserRepository userRepository,
        IOrganizationRepository organizationRepository,
        ILocationRepository locationRepository,
        IPartnerRepository partnerRepository,
        ICategoryRepository categoryRepository)
    {
        if (!(await userRepository.GetAllUsersAsync(new UserQueryFilter())).Any())
        {
            var organizationExists = await organizationRepository.GetOrganizationByNameAsync("Org");
            if (organizationExists is not null)
                await organizationRepository.DeleteOrganizationAsync(organizationExists.Id);

            var organizationOrg = new Organization
            {
                Name = "Org"
            };
            await organizationRepository.CreateOrganizationAsync(organizationOrg);

            var admin = new User
            {
                FirstName = "Admin",
                LastName = "Admin",
                Email = "admin@test.rs",
                Roles = new List<string>
                {
                    "Admin"
                },
                PasswordHash = "null",
                PasswordSalt = "null",
            };
            (admin.PasswordSalt, admin.PasswordHash) = Auth.HashPassword("Sifra.1234");
            await userRepository.CreateUserAsync(admin);

            var organization = new User
            {
                FirstName = "Organization",
                LastName = "Organization",
                Email = "org@test.rs",
                Roles = new List<string> { "Organization" },
                PasswordHash = "null",
                PasswordSalt = "null",
                Organization = new OrganizationPartial
                {
                    Id = organizationOrg.Id,
                    Name = organizationOrg.Name
                }
            };
            (organization.PasswordSalt, organization.PasswordHash) = Auth.HashPassword("Sifra.1234");
            await userRepository.CreateUserAsync(organization);

            var user = new User
            {
                FirstName = "User",
                LastName = "User",
                Email = "user@test.rs",
                Roles = new List<string> { "User" },
                RefreshTokens = new List<RefreshToken>
                {
                    new() { ExpireDate = DateTime.UtcNow.AddDays(-1), Token = "eaeaea" },
                    new() { ExpireDate = DateTime.UtcNow.AddMinutes(1), Token = "eaeaea2" }
                },
                PasswordHash = "null",
                PasswordSalt = "null",
            };
            (user.PasswordSalt, user.PasswordHash) = Auth.HashPassword("Sifra.1234");
            await userRepository.CreateUserAsync(user);
        }

        if (!(await partnerRepository.GetAllPartnersAsync(new PartnerQueryFilter())).Any())
        {
            var partner = new Partner
            {
                Name = "Partner",
                PhoneNumber = "123456789",
                Email = "test@test.rs",
                Url = "neko.com",
                IsTransport = true,
                IsAccommodation = true
            };
            await partnerRepository.CreatePartnerAsync(partner);
        }

        if (!(await locationRepository.GetAllLocationsAsync(new LocationQueryFilter())).Any())
        {
            var partner = await partnerRepository.GetPartnerByNameAsync("Partner");
            if (partner is null)
            {
                partner = new Partner
                {
                    Name = "Partner",
                    PhoneNumber = "123456789",
                    Email = "test@test.rs",
                    Url = "neko.com",
                    IsTransport = true,
                    IsAccommodation = true
                };
                await partnerRepository.CreatePartnerAsync(partner);
            }

            var location = new Location
            {
                Name = "Lokacija",
                AccommodationPartner = PartnerMapper.PartnerToPartnerPartial(partner),
                TransportPartner = PartnerMapper.PartnerToPartnerPartial(partner),
            };
            await locationRepository.CreateLocationAsync(location);
        }
        
        if(!(await categoryRepository.GetAllCategoriesAsync(new CategoryQueryFilter())).Any())
        {
            var category = new Category
            {
                Name = "Kategorija"
            };
            await categoryRepository.CreateCategoryAsync(category);
        }
    }
}