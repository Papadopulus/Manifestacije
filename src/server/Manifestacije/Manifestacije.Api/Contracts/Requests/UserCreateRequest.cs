﻿namespace Manifestacije.Api.Contracts.Requests;

public sealed class UserCreateRequest
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }

    public OrganizationCreateRequest? Organization { get; set; }
}