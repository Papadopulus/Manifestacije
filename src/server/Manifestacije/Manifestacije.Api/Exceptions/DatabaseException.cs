namespace Manifestacije.Api.Exceptions;

public sealed class DatabaseException : Exception
{
    public DatabaseException() : base()
    {
    }

    public DatabaseException(string message) : base(message)
    {
    }
}