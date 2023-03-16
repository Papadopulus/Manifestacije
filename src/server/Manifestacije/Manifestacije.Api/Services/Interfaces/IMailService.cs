namespace Manifestacije.Api.Services.Interfaces;

public interface IMailService
{
    Task<bool> SendEmailAsync(IEnumerable<string> to, string subject, string body);
    Task<bool> SendEmailAsync(string to, string subject, string body);
}