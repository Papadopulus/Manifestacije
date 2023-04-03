namespace Manifestacije.Api.Contracts.Requests;

public sealed class UploadImagesRequest
{
    public IFormFileCollection Files { get; set; }
}