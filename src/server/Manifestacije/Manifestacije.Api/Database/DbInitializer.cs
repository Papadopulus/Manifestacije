using Manifestacije.Api.Extensions;
using Manifestacije.Api.Models;

namespace Manifestacije.Api.Database;

public static class DbInitializer
{
    public static async Task InitializeAsync(IUserRepository userRepository)
    {
        if ((await userRepository.GetAllUsersAsync(new UserQueryFilter())).Count > 0)
        {
            return;
        }

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
}