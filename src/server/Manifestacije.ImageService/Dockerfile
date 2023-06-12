FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Manifestacije.ImageService.csproj", "src/server/Manifestacije.ImageService/"]
RUN dotnet restore "Manifestacije.ImageService.csproj"
COPY . .
WORKDIR "/src/Manifestacije.ImageService"
RUN dotnet build "Manifestacije.ImageService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Manifestacije.ImageService.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Manifestacije.ImageService.dll"]
