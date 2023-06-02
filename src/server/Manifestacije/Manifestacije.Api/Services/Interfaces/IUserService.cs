using Manifestacije.Api.Models;

namespace Manifestacije.Api.Services.Interfaces;

public interface IUserService
{
    Task<List<User>> GetAllUsersAsync(UserQueryFilter userQueryFilter);
    Task<User?> GetUserByIdAsync(string id);
    Task<User> CreateUserAsync(UserCreateRequest userCreateRequest);
    Task<User?> UpdateUserAsync(string id, UserUpdateRequest userUpdateRequest);
    Task<bool> DeleteUserAsync(string id);
    Task<TokenResponse> AuthenticateAsync(AuthenticateRequest authenticateRequest);
    Task<TokenResponse> RefreshTokenAsync(RefreshTokenRequest refreshTokenRequest);
    Task<bool> SendEmailResetPasswordAsync(string email);
    Task<bool> ResetPasswordAsync(string token, string newPassword);

    Task<bool> AddEventToFavouritesAsync(string userId,
        string eventId,
        CancellationToken ct);

    Task<bool> RemoveEventFromFavouritesAsync(string userId,
        string eventId,
        CancellationToken ct);

    Task<bool> AddEventToGoingAsync(string userId,
        string eventId,
        CancellationToken ct);

    Task<bool> RemoveEventFromGoingAsync(string userId,
        string eventId,
        CancellationToken ct);

    Task<List<EventViewResponse>> GetFavouriteEventsAsync(string userId,
        EventQueryFilter queryFilter,
        CancellationToken ct);

    Task<List<EventViewResponse>> GetGoingEventsAsync(string userId,
        EventQueryFilter queryFilter,
        CancellationToken ct);
}