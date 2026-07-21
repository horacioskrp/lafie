namespace Lafie.Infrastructure.Messaging;

/// <summary>
/// Message stocké transactionnellement dans le même commit que la modification
/// métier (pattern Outbox), puis publié de façon fiable par un dispatcher.
/// Squelette : structure seule, aucun traitement encore branché.
/// </summary>
public sealed class OutboxMessage
{
    public Guid Id { get; init; } = Guid.NewGuid();

    public required string Type { get; init; }

    public required string Payload { get; init; }

    public DateTimeOffset OccurredOn { get; init; } = DateTimeOffset.UtcNow;

    public DateTimeOffset? ProcessedOn { get; set; }

    public string? Error { get; set; }
}
