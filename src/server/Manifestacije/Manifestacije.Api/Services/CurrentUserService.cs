using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Manifestacije.Api.Extensions;

namespace Manifestacije.Api.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly ClaimsPrincipal? User;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        if (httpContextAccessor.HttpContext?.User.GetUserId() is not null)
        {
            User = httpContextAccessor.HttpContext?.User;
        }

        if (User is null
            && !string.IsNullOrWhiteSpace(httpContextAccessor.HttpContext?.Request.Headers.Authorization.ToString()))
        {
            var token = new JwtSecurityTokenHandler().ReadJwtToken(httpContextAccessor.HttpContext?.Request.Headers
                .Authorization.ToString().Split(' ')[1]);
            User = new ClaimsPrincipal(new ClaimsIdentity(token.Claims));
        }
    }

    public string? UserId => User?.GetUserId();
    public string? Role => User?.GetRole();
}