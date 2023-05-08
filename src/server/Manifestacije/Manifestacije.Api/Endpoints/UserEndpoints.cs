using FluentValidation;
using Manifestacije.Api.Endpoints.Internal;
using Manifestacije.Api.Extensions;
using Manifestacije.Api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace Manifestacije.Api.Endpoints;

public sealed class UserEndpoints : IEndpoints
{
    private const string BaseRoute = "/users";
    private const string AuthRoute = "/authenticate";
    private const string RefreshRoute = "/refresh";
    private const string ResetPassword = "/reset-password";

    public static void DefineEndpoints(IEndpointRouteBuilder app)
    {
        app.MapPost(BaseRoute, CreateUser)
            .AllowAnonymous();
        app.MapGet(BaseRoute, GetAllUsers)
            .RequireAuthorization(RolesEnum.Admin.ToString());
        app.MapGet(BaseRoute + "/{id}", GetUserById)
            .RequireAuthorization(RolesEnum.User.ToString());
        app.MapPut(BaseRoute + "/{id}", UpdateUser)
            .RequireAuthorization(RolesEnum.User.ToString());
        app.MapDelete(BaseRoute + "/{id}", DeleteUser)
            .RequireAuthorization(RolesEnum.Admin.ToString());

        app.MapPost(AuthRoute, AuthenticateUser)
            .AllowAnonymous();
        app.MapPost(AuthRoute + RefreshRoute, RefreshUserToken)
            .AllowAnonymous();

        app.MapGet(ResetPassword + "/{email}", SendPasswordReset)
            .AllowAnonymous();
        app.MapPost(ResetPassword, CreateNewPassword)
            .AllowAnonymous();
    }

    internal static async Task<IResult> SendPasswordReset(
        string email,
        IUserService userService)
    {
        var success = await userService.SendEmailResetPasswordAsync(email);
        return !success
            ? Results.NotFound($"User with the email of: {email} does not exist")
            : Results.Ok("We sent email with token");
    }

    internal static async Task<IResult> CreateNewPassword(
        IUserService userService,
        [FromBody] PasswordResetRequest passwordResetRequest,
        IValidator<PasswordResetRequest> validator)
    {
        var validationResult = await validator.ValidateAsync(passwordResetRequest);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var success = await userService.ResetPasswordAsync(passwordResetRequest.Token, passwordResetRequest.Password);
        return !success ? Results.BadRequest("Invalid token") : Results.Ok("Password successfully reset");
    }

    internal static async Task<IResult> CreateUser(
        [FromBody] UserCreateRequest userCreateDto,
        IUserService userService,
        IValidator<UserCreateRequest> validator,
        IValidator<OrganizationCreateRequest> organizationValidator)
    {
        var validationResult = await validator.ValidateAsync(userCreateDto);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        if (userCreateDto.Organization is not null)
        {
            validationResult = await organizationValidator.ValidateAsync(userCreateDto.Organization);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }
        }

        var user = await userService.CreateUserAsync(userCreateDto);
        var userResponse = UserMapper.UserToUserViewResponse(user);
        return Results.Created($"{BaseRoute}/{user.Id}", userResponse);
    }

    internal static async Task<IResult> GetAllUsers(
        [AsParameters] UserQueryFilter queryFilter,
        IUserService userService)
    {
        var users = await userService.GetAllUsersAsync(queryFilter);
        var usersResponse = UserMapper.UserToUserViewResponseEnumerable(users);
        return Results.Ok(usersResponse);
    }

    internal static async Task<IResult> GetUserById(
        string id,
        IUserService userService)
    {
        var user = await userService.GetUserByIdAsync(id);
        return user is null
            ? Results.NotFound($"User with the id of: {id} does not exist")
            : Results.Ok(UserMapper.UserToUserViewResponse(user));
    }

    internal static async Task<IResult> UpdateUser(
        HttpContext context,
        string id,
        [FromBody] UserUpdateRequest userUpdateDto,
        IUserService userService,
        IValidator<UserUpdateRequest> validator)
    {
        if (id != context.User.GetUserId() && context.User.GetRole() != RolesEnum.Admin.ToString())
        {
            return Results.Forbid();
        }

        var validationResult = await validator.ValidateAsync(userUpdateDto);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var user = await userService.UpdateUserAsync(id, userUpdateDto);
        return user is null
            ? Results.NotFound("There is no user with specified id")
            : Results.Ok(UserMapper.UserToUserViewResponse(user));
    }

    internal static async Task<IResult> DeleteUser(
        string id,
        IUserService userService)
    {
        var result = await userService.DeleteUserAsync(id);
        return result
            ? Results.Ok("User successfully deleted")
            : Results.NotFound($"User with the id of: {id} does not exist");
    }

    internal static async Task<IResult> AuthenticateUser(
        [FromBody] AuthenticateRequest authenticateRequest,
        IUserService userService,
        IValidator<AuthenticateRequest> validator)
    {
        var validationResult = await validator.ValidateAsync(authenticateRequest);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var tokenResponse = await userService.AuthenticateAsync(authenticateRequest);
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
            throw new ValidationException(validationResult.Errors);
        }

        var tokenResponse = await userService.RefreshTokenAsync(refreshTokenRequest);
        return Results.Ok(tokenResponse);
    }
}