# 06 — Design des « conformance packs »

Comment traduire la conformité multi-juridiction dans l'architecture Lafie (**modular monolith C# / DDD / CQRS event-driven / PostgreSQL** ; frontend **React/TS/Vite**), sans polluer le noyau avec des règles nationales.

## Principe

- **Noyau clinique** = FHIR R4 + IPS + logique métier soignante. **Zéro** règle nationale.
- **Conformance pack** = module enfichable apportant les règles d'**une juridiction** : profils, terminologies, identité, auth, hébergement, reporting, protection des données.
- Sélection du pack **à la configuration/au déploiement** (par tenant/région), pas en dur.

```
Core (agnostique)  ── dépend de ──▶  Abstractions (ports)
                                        ▲
Pack Togo / UE / USA / France ── implémentent ──┘  (adapters)
```

Le noyau définit des **interfaces (ports)** ; chaque pack fournit les **implémentations (adapters)**. Inversion de dépendance : le noyau ne référence jamais un pack.

> **Emplacement retenu (validé).** Les **ports** ci-dessous vivent dans `BuildingBlocks/Lafie.Shared`. Les **adapters par pays** vivent dans `Modules/Interop/Lafie.Interop.Infrastructure` (dossiers `Togo/`, `Eu/`, `Us/`, `Fr/`), sélectionnés par tenant/région via DI. Il n'y a **pas** de projets `Lafie.Conformance.*` séparés (structure par domaine fonctionnel — voir [`../architecture/README.md`](../architecture/README.md) §8). Les noms `Conformance.*` employés plus bas sont **conceptuels**, pas des projets.

## Ports à définir dans le noyau (projet `Lafie.Shared`)

| Port (interface) | Rôle | Exemples d'implémentations par pack |
| --- | --- | --- |
| `IPatientIdentityResolver` | Résoudre/valider l'identité patient | Togo: MPI + NIF ; FR: INS/INSi ; US: MRN+MPI (PIXm) |
| `IProfileValidator` | Valider une ressource contre les profils | Togo: FHIR base/IPS ; FR: ANS+fr-core ; US: US Core |
| `ITerminologyProvider` | Résoudre/valider les codes | multi (LOINC/SNOMED/ICD/ATC) + JDV FR / RxNorm US |
| `IAuthenticationScheme` | Auth pro/patient | OIDC générique ; FR: Pro Santé Connect/e-CPS ; US: SMART/UDAP |
| `INationalReportingConnector` | Reporting national | **Togo: DHIS2 (ADX/FHIR)** ; autres: néant/registres |
| `IConsentPolicy` | Modèle de consentement | RGPD / HIPAA / loi 2019-014 |
| `IDataResidencyPolicy` | Localisation & rétention | Togo local / UE / US HIPAA |
| `IDocumentExchange` | Échange de documents | IHE MHD/XDS ; eHDSI (UE) ; C-CDA (US) |

## Découpage en bounded contexts

| Contexte | Rôle | Noyau ou pack |
| --- | --- | --- |
| **Clinical Core** | Patients, encounters, observations, prescriptions, résultats | Noyau |
| **Terminology** | Service multi-terminologies | Noyau (données par pack) |
| **Identity** | MPI, résolution identité (PIXm/PDQm) | Noyau + adapters pack |
| **Interop / FHIR Gateway** | Sérialisation FHIR, IPS, API REST, SMART | Noyau |
| **DataProtection** | Consentement, audit ATNA, rétention, droits | Noyau (règles par pack) |
| **Conformance.Togo** | OpenHIE, DHIS2, loi 2019-014 | Pack |
| **Conformance.EU** | IPS/EHDS, RGPD, MDR | Pack |
| **Conformance.US** | US Core, HIPAA, ONC, X12 | Pack |
| **Conformance.FR** | ANS (Mesures…), fr-core, INS, HDS | Pack (cf. `docs/fhir/`) |

Chaque `Conformance.*` = un ou plusieurs **modules DDD isolés**, communication avec le noyau par **événements** (CQRS/event-driven).

## Multi-tenant & résidence des données

- **Isolation par région** (souveraineté/HDS/HIPAA) : instance/DB **PostgreSQL par juridiction**. Pas de base unique multi-pays.
- Un tenant est rattaché à **une juridiction** → détermine le pack actif, l'hébergement, les terminologies.
- Le routage (quel pack, quelle DB, quelles règles) est résolu au **bootstrap du tenant**.

## Sérialisation & validation FHIR

- **Firely .NET SDK (`Hl7.Fhir.R4`)** pour (dé)sérialisation.
- Validateur alimenté par les **packages FHIR du pack actif** :
  - Togo/UE: FHIR base + **IPS** ;
  - FR: `hl7.fhir.fr.core` 2.1.0 + IG ANS (voir [`docs/fhir/01`](../fhir/01-overview-et-architecture.md) pour les versions épinglées) ;
  - US: `hl7.fhir.us.core`.
- **Valider en amont** (avant tout échange réseau) selon le pack, pour éviter les rejets côté systèmes nationaux.

## Backend et frontend

- Toute la logique (noyau + ports + Firely + validation) reste **côté serveur** (.NET) : source de vérité unique.
- Le **frontend React/TS (Vite)** consomme l'API par HTTP ; aucune règle de conformité n'y est dupliquée.
- Le pack actif est injecté (DI) côté serveur selon le tenant/déploiement.

## Trajectoire recommandée

1. **Noyau + Terminology + Interop (IPS)** — agnostique.
2. **DataProtection** (consentement, audit, rétention) — commun.
3. **Pack Togo** (OpenHIE + DHIS2 + loi 2019-014) — cible principale.
4. **Pack UE** (IPS/EHDS + RGPD) — extension naturelle du noyau.
5. **Pack US** (US Core + HIPAA + ONC) — chantier séparé, plus lourd.
6. **Pack FR** (ANS) — si besoin France ; déjà largement spécifié dans `docs/fhir/`.

> Rien n'est implémenté à ce stade (cadrage). Ce design oriente les choix ; il sera affiné au bootstrap de la solution.
