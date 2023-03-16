using FluentValidation;

namespace Manifestacije.Api.Validators;

public class UploadImagesRequestValidator : AbstractValidator<UploadImagesRequest>
{
    public UploadImagesRequestValidator()
    {
        RuleForEach(x => x.Files)
            .Must(x => x.ContentType.StartsWith("image/") || x.ContentType.StartsWith("video/"))
            .WithMessage("File must be an image or video");
    }
}