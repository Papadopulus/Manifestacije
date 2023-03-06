using FluentValidation;
using Manifestacije.Api;
using Manifestacije.Api.Database;
using Manifestacije.Api.Endpoints.Internal;
using Manifestacije.Api.Repositories;
using Manifestacije.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Automapper
builder.Services.AddAutoMapper(typeof(IApiMarker));

// Repositories
builder.Services.AddSingleton<IUserRepository, UserRepository>();

// Services
builder.Services.AddSingleton<IUserService, UserService>();

// Database
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));

builder.Services.AddValidatorsFromAssemblyContaining<IApiMarker>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseEndpoints<IApiMarker>();

app.Run();
