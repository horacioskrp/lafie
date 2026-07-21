namespace Lafie.Shared.Messaging;

/// <summary>
/// Événement d'intégration : contrat public échangé <b>entre modules</b>
/// (le seul couplage autorisé, via le bus). Publié de façon fiable par l'Outbox.
/// </summary>
public interface IIntegrationEvent
{
    Guid EventId { get; }

    DateTimeOffset OccurredOn { get; }
}

/// <summary>Base immuable d'un événement d'intégration.</summary>
public abstract record IntegrationEvent : IIntegrationEvent
{
    public Guid EventId { get; init; } = Guid.NewGuid();

    public DateTimeOffset OccurredOn { get; init; } = DateTimeOffset.UtcNow;
}

/// <summary>
/// Bus de publication des événements d'intégration. Implémentation in-process
/// au départ ; l'abstraction reste prête pour un broker externe.
/// </summary>
public interface IEventBus
{
    Task PublishAsync(IIntegrationEvent integrationEvent, CancellationToken cancellationToken = default);
}
