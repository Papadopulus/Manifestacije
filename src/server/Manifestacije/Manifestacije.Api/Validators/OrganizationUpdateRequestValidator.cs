using FluentValidation;

namespace Manifestacije.Api.Validators;

public sealed class OrganizationUpdateRequestValidator : AbstractValidator<OrganizationUpdateRequest>
{
    public OrganizationUpdateRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty();
    }
}