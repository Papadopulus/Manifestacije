namespace Manifestacije.Api.Contracts.Requests;

public class UploadImagesRequest
{
    public IFormFileCollection Files { get; set; }
}