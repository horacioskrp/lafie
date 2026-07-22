# Architecture Lafie (validée)

Architecture cible de Lafie, **validée** le 2026-07-21. Statut : conception figée, **aucun code** encore écrit. Premier jalon convenu : **squelette de solution seul** (structure + frontières, sans logique métier).

Décisions structurantes : [decisions.md](decisions.md). Catalogue complet des modules & roadmap : [modules.md](modules.md).

## 1. Style directeur

**Modular monolith** par **domaine fonctionnel** (style Modular Monolith / eShop), hexagonal (ports/adapters) + **DDD tactique** + **CQRS pragmatique** + **event-driven in-process via Outbox**.

Un seul déployable. Frontières de modules strictes → extraction en services possible plus tard sans réécriture. L'Outbox rend le passage à un broker (RabbitMQ/Kafka) non bloquant.

## 2. Structure de la solution

```
Lafie.slnx                          solution .NET : backend (Api, BuildingBlocks, Modules) + tests
├── src                             ← BACKEND (.NET)
│   ├── Api
│   │   └── Lafie.Api               ASP.NET Core host, FHIR REST facade, SMART on FHIR, composition des modules
│   ├── BuildingBlocks
│   │   ├── Lafie.SharedKernel      types domaine de base (AggregateRoot, ValueObject, DomainEvent, Result)
│   │   ├── Lafie.Shared            contrats inter-modules : integration events, API publiques,
│   │   │                           abstractions CQRS (ICommand/IQuery, IEventBus) + PORTS de conformité
│   │   └── Lafie.Infrastructure    technique partagé : Dapper/Npgsql (connection factory), Outbox + bus in-process,
│   │                               wrappers FHIR (Firely Hl7.Fhir.R4), auth OIDC/SMART, audit ATNA, télémétrie
│   └── Modules
│       ├── Identity                utilisateurs, professionnels, rôles, authent./autoris.
│       ├── Organization            établissements, services, unités, localisations
│       ├── Patient                 dossier patient, MPI, identifiants
│       ├── Clinical                rencontres, observations, diagnostics, soins
│       ├── Pharmacy                médicaments, prescription, dispensation
│       ├── Laboratory              demandes labo, résultats, comptes rendus
│       ├── Billing                 facturation, prises en charge, assurance
│       ├── Terminology   (ajouté)  service multi-code (LOINC/SNOMED/ICD/ATC), validation de binding
│       └── Interop       (ajouté)  FHIR Gateway (IPS/Bundle), connecteur DHIS2, échange documents,
│                                   ADAPTERS de conformité par pays (Togo/UE/US/FR)
├── clients                         ← FRONTEND (hors solution .NET, toolchain Node)
│   └── web                         React + TypeScript + Vite (SPA) + Dockerfile (nginx)
└── tests
    ├── Lafie.ArchitectureTests     frontières de modules (NetArchTest/ArchUnitNET)
    ├── <Module>.UnitTests          domaine + handlers
    └── Lafie.IntegrationTests      Postgres (Testcontainers)
```

> **Séparation clients / backend.** Le frontend est une **SPA React + TypeScript (Vite)** sous `clients/web`, avec sa **propre toolchain Node** et son **propre `Dockerfile`** (build Node → **nginx**). Il **ne fait pas partie de la solution .NET** (`Lafie.slnx` = backend + tests). Client **fin** : il consomme l'API par HTTP via **`/api`** (proxy nginx en conteneur, proxy Vite en dev → pas de CORS). L'image Docker de l'API n'inclut pas les clients (`clients/` exclu via `.dockerignore`). **Mobile** : ultérieur (React Native ou PWA), hors périmètre actuel.

Chaque module sous `Modules/` = **4 projets** : `Lafie.<Module>.Domain`, `.Application`, `.Infrastructure`, `.Api`.

> **Ajouts par rapport à la liste initiale** : `Terminology` et `Interop` (nécessaires à l'interop santé/FHIR et non couverts par les modules purement métier). **Consent** (protection des données) : modélisé via `Consent` FHIR — logé dans `Interop` (ou un futur module `DataProtection` si le besoin grossit) ; l'**audit ATNA** est transverse (`BuildingBlocks/Infrastructure`).

## 3. Rôle des BuildingBlocks

| Projet | Contenu | Dépendances |
| --- | --- | --- |
| `Lafie.SharedKernel` | `Entity`, `AggregateRoot`, `ValueObject`, `DomainEvent`, `Result`, identifiants forts | aucune |
| `Lafie.Shared` | integration events, interfaces publiques de module, abstractions CQRS, **ports de conformité** | SharedKernel |
| `Lafie.Infrastructure` | Dapper/Npgsql (`IDbConnectionFactory`), Outbox + bus in-process, wrappers FHIR (Firely), auth OIDC/SMART, audit ATNA, OpenTelemetry | Shared |

## 4. Couches par module (hexagonal)

```
Domain          agrégats, value objects, invariants, domain events   (dép. SharedKernel)
   ▲
Application     commands/queries + handlers, ports du module          (dép. Domain, Shared)
   ▲
Infrastructure  Dapper/Postgres, impl. ports, clients externes        (dép. Application, BuildingBlocks/Infrastructure)
   ▲
Api (module)    endpoints, enregistrement DI, intégration host
```

## 5. Communication inter-modules

Aucun module ne référence un autre (ni Domain ni Infrastructure). Deux canaux seulement :

| Canal | Usage | Techno |
| --- | --- | --- |
| **Integration events** (async) | réaction cross-module (préféré) | Outbox transactionnel → bus in-process (dans `Lafie.Shared` + `Lafie.Infrastructure`) |
| **Public module API** (sync) | requête/lecture ponctuelle | contrats publics exposés via `Lafie.Shared` |

Frontières vérifiées en CI par **tests d'architecture**.

## 6. CQRS + fiabilité (validé : pragmatique)

- **Commands/Queries** (handlers). Write model = agrégats persistés via **Dapper** (SQL explicite). Read model = **projections / requêtes SQL** dédiées. **Pas d'event sourcing** au départ ; activable par module plus tard.
- **Domain events** → handlers application → **integration events** publiés via **Outbox** (livraison garantie, idempotence).

## 7. Persistance PostgreSQL (validé : schema-per-module + DB-per-région)

- **Un schéma PostgreSQL par module** (`identity`, `patient`, `organization`, …), pas de FK cross-schema. Accès **Dapper** ; schémas/tables gérés en **SQL brut** (scripts, pas de migrations EF).
- **Une base par région** (Togo / UE / US) → **souveraineté & résidence des données**. Pas de base unique multi-pays.
- **Source de vérité = forme domaine** (relationnel). FHIR JSON conservé en **JSONB** dans `Interop` (audit/échange).
- **Tenant → région → pack actif + connexion DB** résolus au bootstrap.

## 8. Conformité multi-juridiction (validé : ports dans Shared, adapters dans Interop)

- **Ports** définis dans `Lafie.Shared` : `IPatientIdentityResolver`, `IProfileValidator`, `ITerminologyProvider`, `IAuthenticationScheme`, `INationalReportingConnector` (DHIS2 = Togo), `IConsentPolicy`, `IDataResidencyPolicy`, `IDocumentExchange`.
- **Adapters par pays** dans `Lafie.Interop.Infrastructure` (dossiers `Togo/`, `Eu/`, `Us/`, `Fr/`), sélectionnés **par tenant/région** via DI au bootstrap.
- Le noyau (modules métier) dépend uniquement des **ports** — jamais d'un pack. Détail conceptuel : [`../conformite/06-conformance-packs.md`](../conformite/06-conformance-packs.md).

## 9. Clients (validé : clients fins, domaine serveur)

- **Frontend = SPA React + TypeScript (Vite)** sous `clients/web`, séparé du backend (toolchain Node, Dockerfile nginx propre). Voir §2.
- Client **fin** : toute la logique domaine reste **côté serveur** (`Lafie.Api`) ; le front consomme l'API par HTTP via `/api` (proxy nginx/Vite).
- **Mobile** : ultérieur — **React Native** (partage de code TS avec le web) ou **PWA**. Non retenu au départ.

## 10. Transverses

AuthN/Z (OIDC + scopes SMART on FHIR) · Audit ATNA (`BuildingBlocks/Infrastructure`) · Validation (FluentValidation + validation profils FHIR selon pack) · Observabilité (OpenTelemetry) · Localisation (fr/en + par pays).

## 11. Stack

> Stack cible complète (Mediator, Finbuckle, JWT+Identity, HybridCache/Valkey, Hangfire, MinIO, Serilog+OTel, Scalar…) et adoption par phases : **[stack.md](stack.md)**. Tableau condensé ci-dessous.

| Besoin | Choix |
| --- | --- |
| Runtime | .NET 10 (C#) — SDK installé 10.0.x |
| API | ASP.NET Core (+ SMART on FHIR) |
| FHIR | Firely SDK `Hl7.Fhir.R4` |
| Accès données | **Dapper + Npgsql** (SQL explicite, pas d'EF Core) |
| CQRS/mediator | **Mediator** (martinothamar, source-generated) |
| Validation | FluentValidation |
| Multitenancy | Finbuckle (phase ultérieure) |
| Auth | JWT + ASP.NET Identity (phase Identity) |
| Doc API | OpenAPI + Scalar |
| Observabilité | Serilog + OpenTelemetry |
| Events | Outbox + bus in-process (abstraction broker-ready) |
| Frontend | React + TypeScript + Vite (SPA) ; nginx en conteneur |
| Tests archi | NetArchTest / ArchUnitNET |
| Tests intégration | Testcontainers (PostgreSQL) |
| Observabilité | OpenTelemetry |

## 12. Premier jalon (validé : squelette seul)

Objectif : **figer les frontières** avant toute logique métier.

Contenu prévu du squelette (à créer sur **go explicite**) :
1. `Lafie.sln` + arborescence `src/` complète (projets créés, référencés, **vides**).
2. `BuildingBlocks` : `SharedKernel` + `Shared` (abstractions CQRS + ports de conformité) + `Infrastructure` (stubs Outbox/bus/EF/FHIR).
3. Les 9 modules (`Identity`, `Organization`, `Patient`, `Clinical`, `Pharmacy`, `Laboratory`, `Billing`, `Terminology`, `Interop`) créés **vides** avec les 4 couches et les dépendances inter-couches correctes.
4. `Api` / `Web` / `Mobile` : hôtes minimaux (démarrent, aucun endpoint métier).
5. `Lafie.ArchitectureTests` posant les règles de frontières (le squelette les fait passer).
6. Aucun agrégat métier, aucune règle nationale, aucune migration — **structure uniquement**.

## 13. État du squelette (livré le 2026-07-21)

Squelette **Phase 0 créé** : `Lafie.slnx` (format solution XML .NET 10) + **25 projets** (backend + tests ; le frontend React est hors solution .NET).

- **Build** : `dotnet build Lafie.slnx` → **0 erreur, 0 warning**.
- **Tests d'architecture** : 3 règles (isolation Domain, indépendance des modules, isolation SharedKernel) — vertes quand l'environnement autorise le chargement des DLL.
- Projets vides (markers d'assembly + `Add*Module` stubs), building blocks stubs (`Entity`, `AggregateRoot`, `ValueObject`, `Result`, CQRS, `IEventBus`, ports de conformité, Outbox, bus in-process). Aucune logique métier.

### Incrément data (2026-07-22)

- **Docker Compose** : Postgres (`5433:5432`) + API (`8081:8080`), `Dockerfile` multi-stage. Run Linux → **contourne SAC**.
- **Dapper/Npgsql** : `IDbConnectionFactory` + `DatabaseHealth` dans `Lafie.Infrastructure` ; `AddLafiePersistence(connectionString)`.
- **Schémas par module** créés au démarrage via `db/init/01-schemas.sql` (`organization, identity, patient, terminology, interop`).
- **Vérifié** : `docker compose up --build` → `/health` = 200, `/health/db` = `{"database":"up"}` (Dapper `select 1`). Commandes : `docker compose up -d` / `down`.

### Baseline légère (2026-07-22)

- **Mediator** (martinothamar, source-generated) — `AddMediator()` (remplace les interfaces CQRS maison, `Cqrs.cs` supprimé).
- **ProblemDetails** RFC 9457 — `AddProblemDetails()` + `UseExceptionHandler()`.
- **OpenAPI + Scalar** — `AddOpenApi()` / `MapOpenApi()` + `MapScalarApiReference()`.
- **Vérifié** (conteneur) : `/openapi/v1.json` = 200, `/scalar` = 200 (UI de référence).
- Reste baseline : **Serilog + OpenTelemetry** + health probes. Puis module **Organization**.

### Gotchas environnement (machine de dev)

- **Format solution** : `.NET 10` génère `Lafie.slnx` (XML), pas `.sln`. Commandes : `dotnet build Lafie.slnx`.
- **Frontend React** (`clients/web`) : SPA React+TS+Vite, `docker compose up` la sert sur **http://localhost:3000** (nginx), proxy `/api` → backend. Mobile natif = ultérieur (React Native/PWA).
- ⚠️ **Smart App Control (Enforce)** bloque l'exécution/chargement des DLL locales non signées (`0x800711C7`, non déterministe). Le **build réussit** ; **exécuter `Lafie.Api` et certains runs de tests échouent** tant que SAC n'est pas contourné. Options : WSL2/Docker Linux (recommandé, SAC ne s'y applique pas), désactiver SAC (irréversible), ou signer les assemblies. Décision reportée.
