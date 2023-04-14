using FluentValidation;

namespace Manifestacije.Api.Validators;

public class PartnerCreateRequestValidator : AbstractValidator<PartnerCreateRequest>
{
    public PartnerCreateRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty();
        RuleFor(x => x.Email)
            .EmailAddress();
        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            .MaximumLength(15);
        RuleFor(x => x.Url)
            .NotEmpty();
    }
}