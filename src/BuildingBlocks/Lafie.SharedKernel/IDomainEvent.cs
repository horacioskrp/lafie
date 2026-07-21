namespace Lafie.SharedKernel;

/// <summary>
/// Événement de domaine : fait métier survenu à l'intérieur d'un agrégat.
/// Interne au module ; il est traduit en événement d'intégration pour le cross-module.
/// </summary>
public interface IDomainEvent;
