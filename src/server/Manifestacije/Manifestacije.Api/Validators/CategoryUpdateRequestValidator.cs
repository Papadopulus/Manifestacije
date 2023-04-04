using FluentValidation;

namespace Manifestacije.Api.Validators;

public sealed class CategoryUpdateRequestValidator:AbstractValidator<CategoryUpdateRequest>
{
    public CategoryUpdateRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotNull();
    }
}