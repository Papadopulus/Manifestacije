using FluentValidation;

namespace Manifestacije.Api.Validators;

public class PasswordResetRequestValidator : AbstractValidator<PasswordResetRequest>
{
    public PasswordResetRequestValidator()
    {
        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(64)
            .Must(x => x.Contains('.')
                       || x.Contains('_')
                       || x.Contains('-')
                       || x.Contains('@')
                       || x.Contains('#')
                       || x.Contains('$')
                       || x.Contains('?')
                       || x.Contains('!')
                       || x.Contains('&')
                       || x.Contains('|')
                       || x.Contains('*')
                       || x.Contains('%')
                       || x.Contains('^')
                       || x.Contains('/')
                       || x.Contains('\\')
                       || x.Contains('~')
                       || x.Contains('`')
                       || x.Contains('+')
                       || x.Contains('=')
                       || x.Contains('(')
                       || x.Contains(')')
                       || x.Contains('[')
                       || x.Contains(']')
                       || x.Contains('{')
                       || x.Contains('}')
            )
            .WithMessage("Password must contain at least one special character")
            .Must(x => x.Any(char.IsUpper))
            .WithMessage("Password must contain at least one uppercase letter")
            .Must(x => x.Any(char.IsLower))
            .WithMessage("Password must contain at least one lowercase letter")
            .Must(x => x.Any(char.IsDigit))
            .WithMessage("Password must contain at least one digit");

        RuleFor(x => x.Token)
            .NotEmpty();
    }
}