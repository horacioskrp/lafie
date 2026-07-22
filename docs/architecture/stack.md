# Stack technique cible

Stack de référence de Lafie. **Persistance = Dapper** (décision utilisateur, cf. [decisions.md](decisions.md) ADR-009) — la ligne « EF Core » de la spec d'origine est **écartée** ; ses patterns sont réinterprétés pour Dapper (voir §Réconciliation).

## Socle

| Domaine | Choix |
| --- | --- |
| Runtime | **.NET 10**, C# latest |
| API | **Minimal APIs** |
| CQRS / mediation | **[Mediator](https://github.com/martinothamar/Mediator)** (martinothamar, **source-generated** — pas de réflexion runtime) |
| Validation | **FluentValidation** |
| Accès données | **Dapper + Npgsql** sur PostgreSQL (SQL explicite, pas d'EF Core) |
| Erreurs HTTP | **RFC 9457 `ProblemDetails`** |
| Doc API | **OpenAPI + [Scalar](https://scalar.com/)** (UI de référence) |
| Observabilité | **Serilog** (logs structurés) + **OpenTelemetry** (traces/metrics/logs) + health probes |
| Conteneurs | **Docker Compose** (Postgres, puis Valkey/MinIO) |

## Auth & identité

- **JWT** (émission / refresh) + **ASP.NET Identity** : rôles, **permissions fines**, politiques de mot de passe, **auth rate-limitée**, sessions, **impersonation**.
- ⚠️ **Friction Dapper** : ASP.NET Identity suppose EF Core par défaut. En Dapper : soit **stores custom** (`IUserStore`/`IRoleStore`…), soit un provider Dapper communautaire, soit **JWT-only** avec un modèle d'utilisateur maison. À trancher au démarrage du module **Identity**.

## Multitenancy

- **[Finbuckle.MultiTenant](https://www.finbuckle.com/)** : résolution du tenant, provisioning, **isolation par défaut**, migrations/seed par tenant.
- Finbuckle est **EF-agnostique au cœur** (middleware + `ITenantInfo`) → compatible Dapper : le tenant résolu sélectionne la **connexion / le schéma** utilisés par Dapper. Aligné sur le **DB-per-région** (cf. ADR-005).

## Cross-cutting (phases ultérieures)

- **HybridCache** sur **Valkey** (compatible Redis)
- **Hangfire** (jobs en arrière-plan)
- **S3 / MinIO** (stockage objet, URLs présignées) — cohérent avec le stockage pixels DICOM hors base
- **Mailing**, **idempotency**, **quotas**, **rate limiting**, **API versioning**

## Réconciliation des patterns EF → Dapper

La spec citait des mécanismes EF ; équivalents Dapper :

| Pattern (spec EF) | Mise en œuvre Dapper |
| --- | --- |
| Soft-delete (interceptor) | Colonne `deleted_at` + **filtre SQL systématique** (`where deleted_at is null`), via convention/helper de requête |
| Audit (interceptor) | Colonnes `created_at/by`, `updated_at/by` renseignées dans les **repositories/handlers** (ou un décorateur de commande) |
| Domain events | Collectés sur l'agrégat (`Entity.Raise`), publiés **après commit** via **Outbox + `IEventBus`** (déjà en place) |
| Specification pattern | **Query objects / builders SQL** optionnels ; sinon SQL explicite par cas d'usage |
| Tenant-isolated `DbContext` | **Finbuckle** résout le tenant → sélection connexion/schéma pour Dapper |
| Migrations EF | **SQL brut** versionné (`db/init`, puis outil type DbUp/roundhouse si besoin) |

## Adoption par phases

| Phase | Éléments |
| --- | --- |
| **Baseline (maintenant)** | .NET 10 · Minimal APIs · **Mediator** · FluentValidation · **Dapper/Npgsql** · Docker/Postgres · **ProblemDetails** · **OpenAPI + Scalar** · **Serilog + OpenTelemetry** · health probes |
| **Auth** (module Identity) | JWT + ASP.NET Identity (rôles, permissions, refresh, rate-limit, impersonation) |
| **Multitenancy** | Finbuckle (résolution, provisioning, isolation) — avec DB-per-région |
| **Scale / cross-cutting** | HybridCache/Valkey · Hangfire · S3/MinIO · mailing · idempotency · quotas · rate limiting · API versioning |

> État actuel : **baseline légère livrée** — Dapper + Docker/Postgres + **Mediator** (source-gen, `AddMediator()`) + **ProblemDetails** (`AddProblemDetails` + `UseExceptionHandler`) + **OpenAPI + Scalar** (`/openapi/v1.json`, `/scalar`). Reste dans la baseline : **Serilog + OpenTelemetry** + health probes (juste après). Puis module **Organization**.
