namespace Lafie.SharedKernel;

/// <summary>
/// Racine d'agrégat : seule porte d'entrée transactionnelle d'un agrégat DDD.
/// </summary>
/// <typeparam name="TId">Type de l'identifiant fort de l'agrégat.</typeparam>
public abstract class AggregateRoot<TId> : Entity
    where TId : notnull
{
    protected AggregateRoot(TId id) => Id = id;

    // Requis par les ORM (matérialisation).
    protected AggregateRoot() => Id = default!;

    public TId Id { get; protected set; }
}
