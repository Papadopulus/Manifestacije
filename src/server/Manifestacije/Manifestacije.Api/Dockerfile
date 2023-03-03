FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base

WORKDIR /app
EXPOSE 80
EXPOSE 443
ENV ASPNETCORE_ENVIRONMENT=Production

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Manifestacije/Manifestacije.Api.csproj", "Manifestacije.Api/"]
RUN dotnet restore "Manifestacije/Manifestacije.Api.csproj"
COPY . .
WORKDIR "/src/Manifestacije.Api"
RUN dotnet build "Manifestacije.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Manifestacije.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Manifestacije.Api.dll"]