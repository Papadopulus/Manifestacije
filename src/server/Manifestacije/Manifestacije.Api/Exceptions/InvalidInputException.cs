namespace Manifestacije.Api.Exceptions;

public sealed class InvalidInputException : Exception
{
    public InvalidInputException() : base()
    {
    }

    public InvalidInputException(string message) : base(message)
    {
    }
}