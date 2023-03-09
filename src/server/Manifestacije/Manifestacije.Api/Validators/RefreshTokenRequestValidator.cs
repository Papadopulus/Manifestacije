using FluentValidation;
using Manifestacije.Api.Contracts.Requests;

namespace Manifestacije.Api.Validators;

public class RefreshTokenRequestValidator : AbstractValidator<RefreshTokenRequest>
{
    public RefreshTokenRequestValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty();
    }
}