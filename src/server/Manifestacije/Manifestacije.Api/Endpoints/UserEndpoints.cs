using AutoMapper;
using FluentValidation;
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
        app.MapPost(BaseRoute, CreateUser)
            .AllowAnonymous();
        app.MapGet(BaseRoute, GetAllUsers)
            .RequireAuthorization(RolesEnum.Admin.ToString());
        app.MapGet(BaseRoute + "{id}", GetUserById)
            .RequireAuthorization(RolesEnum.User.ToString());
        app.MapPut(BaseRoute + "{id}", UpdateUser)
            .RequireAuthorization(RolesEnum.User.ToString());
        app.MapDelete(BaseRoute + "{id}", DeleteUser)
            .RequireAuthorization(RolesEnum.Admin.ToString());

        app.MapPost(AuthRoute, AuthenticateUser)
            .AllowAnonymous();
        app.MapPost(AuthRoute + Refresh, RefreshUserToken)
            .AllowAnonymous();
    }

    internal static async Task<IResult> CreateUser(
        [FromBody] UserCreateRequest userCreateDto,
        IUserService userService,
        IValidator<UserCreateRequest> validator,
        IMapper mapper)
    {
        var validationResult = await validator.ValidateAsync(userCreateDto);
        if (!validationResult.IsValid)
        {
            return Results.BadRequest(validationResult.Errors);
        }

        var user = await userService.CreateUserAsync(userCreateDto);
        var userResponse = mapper.Map<UserViewResponse>(user);
        return Results.Created($"{BaseRoute}/{user.Id}", userResponse);
    }

    internal static async Task<IResult> GetAllUsers(
        [AsParameters] UserQueryFilter queryFilter,
        IUserService userService,
        IMapper mapper)
    {
        var users = await userService.GetAllUsersAsync(queryFilter);
        var usersResponse = mapper.Map<List<UserViewResponse>>(users);
        return Results.Ok(usersResponse);
    }

    internal static async Task<IResult> GetUserById(
        string id,
        IUserService userService,
        IMapper mapper)
    {
        var user = await userService.GetUserByIdAsync(id);
        var userResponse = mapper.Map<UserViewResponse>(user);
        return user is null ? Results.NotFound($"User with the id of: {id} does not exist") : Results.Ok(userResponse);
    }

    internal static async Task<IResult> UpdateUser(
        string id,
        [FromBody] UserUpdateRequest userUpdateDto,
        IUserService userService,
        IValidator<UserUpdateRequest> validator,
        IMapper mapper)
    {
        var validationResult = await validator.ValidateAsync(userUpdateDto);
        if (!validationResult.IsValid)
        {
            return Results.BadRequest(validationResult.Errors);
        }

        var user = await userService.UpdateUserAsync(id, userUpdateDto);
        var userResponse = mapper.Map<UserViewResponse>(user);
        return Results.Ok(userResponse);
    }

    internal static async Task<IResult> DeleteUser(
        string id,
        IUserService userService)
    {
        var result = await userService.DeleteUserAsync(id);
        return result ? Results.Ok("User successfully deleted") : Results.NotFound($"User with the id of: {id} does not exist");
    }

    internal static async Task<IResult> AuthenticateUser(
        [FromBody] AuthenticateRequest authenticateRequest,
        IUserService userService,
        IValidator<AuthenticateRequest> validator)
    {
        var validationResult = await validator.ValidateAsync(authenticateRequest);
        if (!validationResult.IsValid)
        {
            return Results.BadRequest(validationResult.Errors);
        }
        
        var tokenResponse = await userService.LoginAsync(authenticateRequest);
        return Results.Ok(tokenResponse);
    }

    internal static async Task<IResult> RefreshUserToken(
        [FromBody] RefreshTokenRequest refreshTokenRequest,
        IUserService userService,
        IValidator<RefreshTokenRequest> validator)
    {
        var validationResult = await validator.ValidateAsync(refreshTokenRequest);
        if (!validationResult.IsValid)
        {
            return Results.BadRequest(validationResult.Errors);
        }
        
        var tokenResponse = await userService.RefreshTokenAsync(refreshTokenRequest);
        return Results.Ok(tokenResponse);
    }
}