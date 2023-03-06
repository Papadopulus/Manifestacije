namespace Manifestacije.Api.Exceptions;

public class InvalidInputException : Exception
{
    public InvalidInputException() : base()
    {
        
    }
    
    public InvalidInputException(string message) : base(message)
    {
        
    }
}