using FluentValidation;

namespace Manifestacije.Api.Validators;

public sealed class CategoryCreateRequestValidator:AbstractValidator<CategoryCreateRequest>
{
    public CategoryCreateRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty();
    }
}