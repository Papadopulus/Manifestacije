﻿using FluentValidation;

namespace Manifestacije.Api.Validators;

public class EventUpdateRequestValidator : AbstractValidator<EventUpdateRequest>
{
    public EventUpdateRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty();

        RuleFor(x => x.Description)
            .NotEmpty();

        RuleForEach(x => x.ImageUrls)
            .NotEmpty();

        RuleForEach(x => x.Guests)
            .NotEmpty();

        RuleForEach(x => x.Competitors)
            .NotEmpty();

        RuleForEach(x => x.Sponsors)
            .NotEmpty();

        RuleFor(x => x.StartingDate)
            .NotEmpty()
            .GreaterThan(DateTime.UtcNow);

        RuleFor(x => x.EndingDate)
            .NotEmpty()
            .GreaterThan(DateTime.UtcNow);

        RuleFor(x => x)
            .Must(x => x.StartingDate < x.EndingDate);

        RuleFor(x => x.Capacity)
            .GreaterThan((ulong)0);

        RuleFor(x => x.Street)
            .NotEmpty();
    }
}