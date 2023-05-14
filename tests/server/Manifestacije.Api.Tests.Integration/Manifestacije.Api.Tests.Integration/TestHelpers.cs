﻿namespace Manifestacije.Api.Tests.Integration;

internal static class TestHelpers
{
    internal static Func<EquivalencyAssertionOptions<TExpectation>, EquivalencyAssertionOptions<TExpectation>>
        Config<TExpectation>()
    {
        return options =>
        {
            options.Using<DateTime>(ctx =>
                ctx.Subject.Should().BeCloseTo(ctx.Expectation, TimeSpan.FromMilliseconds(100))).WhenTypeIs<DateTime>();
            return options;
        };
    }
}