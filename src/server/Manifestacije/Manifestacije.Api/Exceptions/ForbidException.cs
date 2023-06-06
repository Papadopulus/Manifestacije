namespace Manifestacije.Api.Exceptions;

public class ForbidException : Exception
{
    public ForbidException()
    {
        
    }
    
    public ForbidException(string message) : base(message)
    {
        
    }
}