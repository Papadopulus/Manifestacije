﻿namespace Manifestacije.Api.Services.Interfaces;

public interface ICurrentUserService
{
    string? UserId { get; }
    string? Role { get; }
}