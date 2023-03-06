using FluentValidation;
using Manifestacije.Api.Contracts.Requests;

namespace Manifestacije.Api.Validators;

public class AuthenticateRequestValidator : AbstractValidator<AuthenticateRequest>
{
    public AuthenticateRequestValidator()
    {
        
    }
}