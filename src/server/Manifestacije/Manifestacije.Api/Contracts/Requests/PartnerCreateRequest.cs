﻿namespace Manifestacije.Api.Contracts.Requests;

public class PartnerCreateRequest
{
    public required string Name { get; set; } 
    public required string PhoneNumber { get; set; } 
    public required string Email { get; set; } 
    public required string Url { get; set; } 
    public List<string> Locations { get; set; } = new();
}