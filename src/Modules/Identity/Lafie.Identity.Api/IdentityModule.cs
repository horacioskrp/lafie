using Microsoft.Extensions.DependencyInjection;

namespace Lafie.Identity.Api;

/// <summary>Point d'entrée DI du module Identity (squelette : n'enregistre rien encore).</summary>
public static class IdentityModule
{
    public static IServiceCollection AddIdentityModule(this IServiceCollection services)
    {
        // TODO(phase suivante) : DbContext, handlers, ports du module Identity.
        return services;
    }
}
