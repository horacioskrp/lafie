namespace Lafie.SharedKernel;

/// <summary>
/// Base d'une entité du domaine. Porte les <see cref="IDomainEvent"/> levés
/// pendant les opérations métier, collectés puis publiés par l'infrastructure.
/// </summary>
public abstract class Entity
{
    private readonly List<IDomainEvent> _domainEvents = [];

    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    protected void Raise(IDomainEvent domainEvent) => _domainEvents.Add(domainEvent);

    public void ClearDomainEvents() => _domainEvents.Clear();
}
