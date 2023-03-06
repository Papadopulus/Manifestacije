using FluentValidation;
using Manifestacije.Api.Contracts.QueryFilters;
using Manifestacije.Api.Contracts.Requests;
using Manifestacije.Api.Endpoints.Internal;
using Microsoft.AspNetCore.Mvc;

namespace Manifestacije.Api.Endpoints;

public class UserEndpoints : IEndpoints
{
    private const string BaseRoute = "/users";
    private const string AuthRoute = "/authenticate";
    private const string Refresh = "/refresh";

    public static void DefineEndpoints(IEndpointRouteBuilder app)
    {
        app.MapPost(BaseRoute, CreateUser);
        app.MapGet(BaseRoute, GetAllUsers);
        app.MapGet(BaseRoute + "{id}", GetUserById);
        app.MapPut(BaseRoute + "{id}", UpdateUser);
        app.MapDelete(BaseRoute + "{id}", DeleteUser);

        app.MapPost(AuthRoute, AuthenticateUser);
        app.MapPost(AuthRoute + Refresh, RefreshUserToken);
    }

    private static async Task<IResult> CreateUser(
        [FromBody] UserCreateRequest userCreateDto,
        IUserService userService,
        IValidator<UserCreateRequest> validator)
    {
        var validationResult = await validator.ValidateAsync(userCreateDto);
        if (!validationResult.IsValid)
        {
            return Results.BadRequest(validationResult.Errors);
        }

        await userService.CreateUserAsync(userCreateDto);
        return Results.Empty;
    }

    private static async Task<IResult> GetAllUsers(
        [AsParameters] UserQueryFilter queryFilter,
        IUserService userService)
    {
        var users = await userService.GetAllUsersAsync();
        return Results.Ok(users);
    }
    
    private static async Task<IResult> GetUserById(
        string id,
        IUserService userService)
    {
        var users = await userService.GetAllUsersAsync();
        return Results.Ok(users);
    }
    
    private static async Task<IResult> UpdateUser(
        string id,
        [FromBody] UserUpdateRequest userUpdateDto,
        IUserService userService,
        IValidator<UserUpdateRequest> validator)
    {
        var users = await userService.GetAllUsersAsync();
        return Results.Ok(users);
    }
    
    private static async Task<IResult> DeleteUser(
        string id,
        IUserService userService)
    {
        var users = await userService.GetAllUsersAsync();
        return Results.Ok(users);
    }
    
    private static async Task<IResult> AuthenticateUser(
        [FromBody] AuthenticateRequest authenticateRequest,
        IUserService userService,
        IValidator<AuthenticateRequest> validator)
    {
        var users = await userService.GetAllUsersAsync();
        return Results.Ok(users);
    }
    
    private static async Task<IResult> RefreshUserToken(
        [FromBody] RefreshTokenRequest refreshTokenRequest,
        IUserService userService,
        IValidator<RefreshTokenRequest> validator)
    {
        var users = await userService.GetAllUsersAsync();
        return Results.Ok(users);
    }
}