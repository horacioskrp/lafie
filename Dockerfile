# --- build ---
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
# On ne restaure/publie que le host API (backend) — les clients ne sont pas dans l'image.
RUN dotnet restore src/Api/Lafie.Api/Lafie.Api.csproj
RUN dotnet publish src/Api/Lafie.Api/Lafie.Api.csproj -c Release -o /app/publish --no-restore

# --- runtime ---
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Lafie.Api.dll"]
