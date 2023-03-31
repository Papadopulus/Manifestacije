using Manifestacije.Api.Models;
using Riok.Mapperly.Abstractions;

namespace Manifestacije.Api.Mappers;

[Mapper]
public static partial class UserMapper
{
    public static partial User UserCreateRequestToUser(UserCreateRequest userCreateRequest);
    public static partial User UserUpdateRequestToUser(UserUpdateRequest userUpdateRequest);
    public static partial UserViewResponse UserToUserViewResponse(User user);
    public static partial IEnumerable<UserViewResponse> UserToUserViewResponseEnumerable(IEnumerable<User> user);
}