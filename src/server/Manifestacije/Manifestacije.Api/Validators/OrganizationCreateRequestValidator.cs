using FluentValidation;

namespace Manifestacije.Api.Validators;

public sealed class OrganizationCreateRequestValidator : AbstractValidator<OrganizationCreateRequest>
{
    public OrganizationCreateRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty();
    }
}