using Microsoft.AspNetCore.Mvc;

namespace Manifestacije.ImageService.Controllers;

[ApiController]
[Route("[controller]")]
public class ImageController : ControllerBase
{
    private readonly string _imagePath = Path.Combine("wwwroot", "images");

    [HttpPost]
    public async Task<IActionResult> Post([FromForm] List<ImageRequest> imageRequest)
    {
        List<(int, string)> images = new();
        foreach (var req in imageRequest)
        {
            if (!req.File.ContentType.StartsWith("image/") && !req.File.ContentType.StartsWith("video/"))
                return BadRequest("Image is not present");

            var newName = Guid.NewGuid().ToString();
            if (req.File.ContentType.StartsWith("image/"))
                newName += ".jpg";
            else
                newName += ".mp4";

            var path = Path.Combine(_imagePath, newName);

            await using (var stream = new FileStream(path, FileMode.Create))
            {
                await req.File.CopyToAsync(stream);
            }
            images.Add((req.OrderNumber, newName));
        }

        return Ok(images);
    }
    
    [HttpPost("onlyfiles")]
    public async Task<IActionResult> Post([FromForm] List<IFormFile> imageRequest)
    {
        List<string> images = new();
        foreach (var req in imageRequest)
        {
            if (!req.ContentType.StartsWith("image/") && !req.ContentType.StartsWith("video/"))
                return BadRequest("Image is not present");

            var newName = Guid.NewGuid().ToString();
            if (req.ContentType.StartsWith("image/"))
                newName += ".jpg";
            else
                newName += ".mp4";

            var path = Path.Combine(_imagePath, newName);

            await using (var stream = new FileStream(path, FileMode.Create))
            {
                await req.CopyToAsync(stream);
            }
            images.Add(newName);
        }

        return Ok(images);
    }

    [HttpGet("{name}")]
    public IActionResult Get(string name)
    {
        var image = System.IO.File.OpenRead(Path.Combine(_imagePath, name));
        return File(image, "image/jpeg");
    }
}