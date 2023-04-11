using FluentValidation;

namespace Manifestacije.Api.Validators;

public class LocationUpdateRequestValidator : AbstractValidator<LocationUpdateRequest>
{
    public LocationUpdateRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty();
    }
}