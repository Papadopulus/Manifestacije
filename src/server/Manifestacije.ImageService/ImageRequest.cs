namespace Manifestacije.ImageService;

public class ImageRequest
{
    public required IFormFile File { get; set; }
    public int OrderNumber { get; set; }
}