﻿namespace Manifestacije.Api.Contracts.Requests;

public sealed class UserUpdateRequest
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}