using Microsoft.Extensions.DependencyInjection;

namespace Lafie.Organization.Api;

/// <summary>Point d'entrée DI du module Organization (squelette : n'enregistre rien encore).</summary>
public static class OrganizationModule
{
    public static IServiceCollection AddOrganizationModule(this IServiceCollection services)
    {
        // TODO(phase suivante) : DbContext, handlers, ports du module Organization.
        return services;
    }
}
