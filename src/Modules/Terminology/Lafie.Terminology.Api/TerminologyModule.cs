using Microsoft.Extensions.DependencyInjection;

namespace Lafie.Terminology.Api;

/// <summary>Point d'entrée DI du module Terminology (squelette : n'enregistre rien encore).</summary>
public static class TerminologyModule
{
    public static IServiceCollection AddTerminologyModule(this IServiceCollection services)
    {
        // TODO(phase suivante) : DbContext, handlers, ports du module Terminology.
        return services;
    }
}
