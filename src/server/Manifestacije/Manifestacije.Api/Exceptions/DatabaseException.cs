namespace Manifestacije.Api.Exceptions;

public class DatabaseException : Exception
{
    public DatabaseException() : base()
    {
        
    }
    
    public DatabaseException(string message) : base(message)
    {
        
    }
}