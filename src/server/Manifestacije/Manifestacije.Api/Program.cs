using FluentValidation;
using Manifestacije.Api;
using Manifestacije.Api.Endpoints.Internal;
using Manifestacije.Api.Services;
using Manifestacije.Api.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// DI
builder.Services.AddSingleton<IUserService, UserService>();

builder.Services.AddValidatorsFromAssemblyContaining<Program>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseEndpoints<IApiMarker>();

app.Run();
