﻿namespace Manifestacije.Api.Contracts.Requests;

public sealed class PasswordResetRequest
{
    public required string Token { get; set; }
    public required string Password { get; set; }
}