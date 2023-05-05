﻿namespace Manifestacije.Api.Models;

public sealed class Partner : ModelBase
{
    public required string Name { get; set; } 
    public required string PhoneNumber { get; set; } 
    public required string Email { get; set; } 
    public List<LocationPartial> Locations { get; set; } = new();
    public required string Url { get; set; } 
    public bool IsUpsert { get; set; } = false;
}