namespace Manifestacije.Api.Contracts.Responses;

public sealed class OrganizationViewResponse
{
    public required string Id { get; set; } 
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