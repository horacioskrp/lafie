using Lafie.Shared.Messaging;

namespace Lafie.Infrastructure.Messaging;

/// <summary>
/// Bus d'événements in-process (squelette). L'abstraction <see cref="IEventBus"/>
/// reste identique le jour où l'on branche un broker externe (RabbitMQ/Kafka).
/// </summary>
public sealed class InProcessEventBus : IEventBus
{
    public Task PublishAsync(IIntegrationEvent integrationEvent, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(integrationEvent);

        // TODO(phase suivante) : router vers les handlers enregistrés + Outbox.
        return Task.CompletedTask;
    }
}
