using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;

namespace Manifestacije.Api.Services;

public class MailService : IMailService
{
    private readonly string _displayName;
    private readonly string _from;
    private readonly string _password;
    private readonly string _port;
    private readonly string _smtpServer;
    private readonly string _userName;

    public MailService(IConfiguration configuration)
    {
        _from = configuration["EmailConfiguration:From"]!;
        _smtpServer = configuration["EmailConfiguration:SmtpServer"]!;
        _port = configuration["EmailConfiguration:Port"]!;
        _userName = configuration["EmailConfiguration:UserName"]!;
        _password = configuration["EmailConfiguration:Password"]!;
        _displayName = configuration["EmailConfiguration:DisplayName"]!;
    }

    public async Task<bool> SendEmailAsync(IEnumerable<string> to,
        string subject,
        string body)
    {
        using var client = new SmtpClient();
        await client.ConnectAsync(_smtpServer, int.Parse(_port), true);
        client.AuthenticationMechanisms.Remove("XOAUTH2");
        await client.AuthenticateAsync(_userName, _password);
        var message = CreateMessage(to, subject, body);
        await client.SendAsync(message);

        return true;
    }

    public async Task<bool> SendEmailAsync(string to,
        string subject,
        string body)
    {
        using var client = new SmtpClient();
        await client.ConnectAsync(_smtpServer, int.Parse(_port), true);
        client.AuthenticationMechanisms.Remove("XOAUTH2");
        await client.AuthenticateAsync(_userName, _password);
        var message = CreateMessage(new[] { to }, subject, body);
        await client.SendAsync(message);

        return true;
    }

    private MimeMessage CreateMessage(IEnumerable<string> to,
        string subject,
        string body)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_displayName, _from));
        message.To.AddRange(to.Select(x => new MailboxAddress(x, x)));
        message.Subject = subject;
        message.Body = new TextPart(TextFormat.Html) { Text = $"<h2 style='color:red;'>{body}</h2>" };

        return message;
    }
}