﻿namespace Manifestacije.Api.Models;

public sealed class Organization : ModelBase
{
    public required string Name { get; set; } 
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? InstagramUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? YoutubeUrl { get; set; }
    public string? LinkedInUrl { get; set; }
}