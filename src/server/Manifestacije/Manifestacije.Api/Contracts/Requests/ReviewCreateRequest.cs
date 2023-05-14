using System.Text.Json.Serialization;

namespace Manifestacije.Api.Contracts.Requests;

public class ReviewCreateRequest
{
    [JsonIgnore] public string UserId { get; set; } = default!;
    public required string EventId { get; init; }
    public required ushort OrganizationRating { get; init; }
    public required ushort EventRating { get; init; }
    public string? Comment { get; set; }
}