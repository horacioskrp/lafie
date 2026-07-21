namespace Lafie.Shared.Cqrs;

/// <summary>Marqueur d'une commande (intention de modification d'état).</summary>
public interface ICommand;

/// <summary>Commande retournant une valeur.</summary>
public interface ICommand<TResponse>;

/// <summary>Requête de lecture retournant une valeur (jamais d'effet de bord).</summary>
public interface IQuery<TResponse>;

/// <summary>Gestionnaire d'une commande sans valeur de retour.</summary>
public interface ICommandHandler<in TCommand>
    where TCommand : ICommand
{
    Task HandleAsync(TCommand command, CancellationToken cancellationToken = default);
}

/// <summary>Gestionnaire d'une commande avec valeur de retour.</summary>
public interface ICommandHandler<in TCommand, TResponse>
    where TCommand : ICommand<TResponse>
{
    Task<TResponse> HandleAsync(TCommand command, CancellationToken cancellationToken = default);
}

/// <summary>Gestionnaire d'une requête.</summary>
public interface IQueryHandler<in TQuery, TResponse>
    where TQuery : IQuery<TResponse>
{
    Task<TResponse> HandleAsync(TQuery query, CancellationToken cancellationToken = default);
}
