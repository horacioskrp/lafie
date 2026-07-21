using Microsoft.Extensions.DependencyInjection;

namespace Lafie.Interop.Api;

/// <summary>Point d'entrée DI du module Interop (squelette : n'enregistre rien encore).</summary>
public static class InteropModule
{
    public static IServiceCollection AddInteropModule(this IServiceCollection services)
    {
        // TODO(phase suivante) : FHIR Gateway, IPS, connecteur DHIS2, adapters de conformité.
        return services;
    }
}
