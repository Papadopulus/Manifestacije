using FluentValidation;

namespace Manifestacije.Api.Validators;

public sealed class LocationCreateRequestValidator : AbstractValidator<LocationCreateRequest>
{
    public LocationCreateRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(64);
    }
}