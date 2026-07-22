using Lafie.Identity.Api;
using Lafie.Infrastructure.Persistence;
using Lafie.Interop.Api;
using Lafie.Organization.Api;
using Lafie.Patient.Api;
using Lafie.Terminology.Api;

var builder = WebApplication.CreateBuilder(args);

// Persistance Dapper/Npgsql partagée.
var connectionString = builder.Configuration.GetConnectionString("Postgres")
    ?? "Host=localhost;Port=5433;Database=lafie;Username=lafie;Password=lafie";
builder.Services.AddLafiePersistence(connectionString);

// Enregistrement des modules — Phase 0 (socle).
// Chaque Add*Module est un point d'entrée DI vide pour l'instant.
builder.Services
    .AddIdentityModule()
    .AddOrganizationModule()
    .AddPatientModule()
    .AddTerminologyModule()
    .AddInteropModule();

var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "ok", phase = "0-skeleton" }));

app.MapGet("/health/db", async (DatabaseHealth db, CancellationToken ct) =>
    await db.IsReachableAsync(ct)
        ? Results.Ok(new { database = "up" })
        : Results.StatusCode(StatusCodes.Status503ServiceUnavailable));

app.Run();
