namespace Lafie.SharedKernel;

/// <summary>
/// Résultat d'une opération, succès ou échec, sans recourir aux exceptions
/// pour le flux de contrôle métier.
/// </summary>
public class Result
{
    protected Result(bool isSuccess, string? error)
    {
        if (isSuccess && error is not null)
        {
            throw new InvalidOperationException("Un succès ne porte pas d'erreur.");
        }

        if (!isSuccess && string.IsNullOrWhiteSpace(error))
        {
            throw new InvalidOperationException("Un échec doit porter une erreur.");
        }

        IsSuccess = isSuccess;
        Error = error;
    }

    public bool IsSuccess { get; }

    public bool IsFailure => !IsSuccess;

    public string? Error { get; }

    public static Result Success() => new(true, null);

    public static Result Failure(string error) => new(false, error);

    public static Result<T> Success<T>(T value) => new(value, true, null);

    public static Result<T> Failure<T>(string error) => new(default, false, error);
}

/// <summary>Résultat portant une valeur en cas de succès.</summary>
public sealed class Result<T> : Result
{
    private readonly T? _value;

    internal Result(T? value, bool isSuccess, string? error)
        : base(isSuccess, error) => _value = value;

    public T Value => IsSuccess
        ? _value!
        : throw new InvalidOperationException("Pas de valeur sur un résultat en échec.");
}
