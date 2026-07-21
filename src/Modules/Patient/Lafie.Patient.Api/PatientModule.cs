using Microsoft.Extensions.DependencyInjection;

namespace Lafie.Patient.Api;

/// <summary>Point d'entrée DI du module Patient (squelette : n'enregistre rien encore).</summary>
public static class PatientModule
{
    public static IServiceCollection AddPatientModule(this IServiceCollection services)
    {
        // TODO(phase suivante) : DbContext, handlers, ports du module Patient.
        return services;
    }
}
