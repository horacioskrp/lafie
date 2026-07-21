using Lafie.Identity.Api;
using Lafie.Interop.Api;
using Lafie.Organization.Api;
using Lafie.Patient.Api;
using Lafie.Terminology.Api;

var builder = WebApplication.CreateBuilder(args);

// Enregistrement des modules — Phase 0 (socle).
// Chaque Add*Module est un point d'entrée DI vide pour l'instant.
builder.Services
    .AddIdentityModule()
    .AddOrganizationModule()
    .AddPatientModule()
    .AddTerminologyModule()
    .AddInteropModule();

var app = builder.Build();

app.UseHttpsRedirection();

app.MapGet("/health", () => Results.Ok(new { status = "ok", phase = "0-skeleton" }));

app.Run();
