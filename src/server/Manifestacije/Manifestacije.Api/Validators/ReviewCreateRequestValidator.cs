using FluentValidation;

namespace Manifestacije.Api.Validators;

public class ReviewCreateRequestValidator : AbstractValidator<ReviewCreateRequest>
{
    public ReviewCreateRequestValidator()
    {
        RuleFor(x => x.EventRating)
            .GreaterThanOrEqualTo((ushort)1)
            .LessThanOrEqualTo((ushort)10);
        RuleFor(x => x.OrganizationRating)
            .GreaterThanOrEqualTo((ushort)1)
            .LessThanOrEqualTo((ushort)10);
    }
}