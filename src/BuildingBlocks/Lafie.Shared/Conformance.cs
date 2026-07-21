namespace Lafie.Shared.Conformance;

// Ports de conformité multi-juridiction. Le noyau dépend UNIQUEMENT de ces
// abstractions ; les adapters par pays (Togo/UE/US/FR) vivent dans
// Lafie.Interop.Infrastructure et sont sélectionnés par tenant/région via DI.
// Cf. docs/conformite/06-conformance-packs.md — signatures à préciser en phase suivante.

/// <summary>Résout et valide l'identité d'un patient (INS-FR, NIF-Togo, MRN/MPI-US…).</summary>
public interface IPatientIdentityResolver;

/// <summary>Valide une ressource FHIR contre les profils du pack actif.</summary>
public interface IProfileValidator;

/// <summary>Résout et valide les codes (LOINC/SNOMED/ICD/ATC + jeux de valeurs nationaux).</summary>
public interface ITerminologyProvider;

/// <summary>Schéma d'authentification pro/patient (OIDC/SMART + adapters nationaux).</summary>
public interface IAuthenticationScheme;

/// <summary>Connecteur de reporting national (ex. DHIS2 pour le Togo).</summary>
public interface INationalReportingConnector;

/// <summary>Politique de consentement (RGPD / HIPAA / loi togolaise 2019-014).</summary>
public interface IConsentPolicy;

/// <summary>Politique de résidence et de rétention des données par région.</summary>
public interface IDataResidencyPolicy;

/// <summary>Échange de documents de santé (IHE MHD/XDS, eHDSI, C-CDA…).</summary>
public interface IDocumentExchange;
