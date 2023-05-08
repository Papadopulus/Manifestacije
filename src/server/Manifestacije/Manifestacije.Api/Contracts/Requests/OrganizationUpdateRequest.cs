namespace Manifestacije.Api.Contracts.Requests;

public sealed class OrganizationUpdateRequest
{
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? InstagramUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? YoutubeUrl { get; set; }
    public string? LinkedInUrl { get; set; }
}