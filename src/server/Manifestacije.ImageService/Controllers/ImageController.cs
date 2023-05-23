using Microsoft.AspNetCore.Mvc;

namespace Manifestacije.ImageService.Controllers;

[ApiController]
[Route("[controller]")]
public class ImageController : ControllerBase
{
    private readonly string _imagePath = Path.Combine("wwwroot", "images");

    [HttpPost]
    public async Task<IActionResult> Post([FromForm] IFormFile imageRequest)
    {
        if (!imageRequest.ContentType.StartsWith("image/") && !imageRequest.ContentType.StartsWith("video/"))
            return BadRequest("Image is not present");

        var newName = Guid.NewGuid().ToString();
        if (imageRequest.ContentType.StartsWith("image/"))
            newName += ".jpg";
        else
            newName += ".mp4";

        var path = Path.Combine(_imagePath, newName);
        Directory.CreateDirectory(_imagePath);

        await using (var stream = new FileStream(path, FileMode.Create))
        {
            await imageRequest.CopyToAsync(stream);
        }

        return Ok(newName);
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
            Directory.CreateDirectory(_imagePath);

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
        try
        {
            var image = System.IO.File.OpenRead(Path.Combine(_imagePath, name));
            return File(image, "image/jpeg");
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return NotFound("Image not found");
        }
    }
}