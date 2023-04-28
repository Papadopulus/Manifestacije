using FluentValidation;

namespace Manifestacije.Api.Validators;

public class PartnerUpdateRequestValidator : AbstractValidator<PartnerUpdateRequest>
{
    public PartnerUpdateRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty();
        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            .MaximumLength(15);
    }
}