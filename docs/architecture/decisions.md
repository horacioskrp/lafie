# Journal des décisions d'architecture (ADR)

Décisions structurantes de Lafie. Format léger. Statut au 2026-07-21 : **validé**, aucun code écrit.

## ADR-001 — Modular monolith hexagonal

**Décision.** Un modular monolith (ports/adapters) plutôt que microservices.
**Pourquoi.** Stade cadrage : coût opérationnel des microservices injustifié. Les frontières DDD + Outbox permettent une extraction ultérieure sans réécriture.
**Conséquence.** Frontières de modules strictes, vérifiées par tests d'architecture en CI.

## ADR-002 — DDD tactique + noyau agnostique + packs de conformité

**Décision.** Noyau clinique sans aucune règle nationale ; conformité par pays via ports/adapters (inversion de dépendance).
**Pourquoi.** Cible multi-juridiction (Togo/UE/USA/France) → pas de conformité unique.
**Conséquence.** **Ports** définis dans `Lafie.Shared` (BuildingBlocks) ; **adapters par pays** dans `Lafie.Interop.Infrastructure` (`Togo/Eu/Us/Fr`), sélectionnés par tenant via DI. Le noyau ne référence jamais un pack. Voir [`../conformite/06-conformance-packs.md`](../conformite/06-conformance-packs.md).

## ADR-002b — Structure par domaine fonctionnel (Lafie.*) ✅ validé

**Décision.** Modular monolith par domaine fonctionnel : `Api` / `Web` / `Mobile` + `BuildingBlocks` (`SharedKernel`, `Shared`, `Infrastructure`) + `Modules` (Identity, Organization, Patient, Clinical, Pharmacy, Laboratory, Billing, **Terminology**, **Interop**). Nommage `Lafie.*` (cohérent avec le repo).
**Pourquoi.** Lisibilité, convention répandue (Modular Monolith / eShop). Terminology + Interop ajoutés pour couvrir l'interop santé/FHIR absente des modules métier.
**Conséquence.** Chaque module = 4 couches Domain/Application/Infrastructure/Api. Voir la structure complète dans [README.md](README.md) §2.

## ADR-003 — CQRS pragmatique (pas d'event sourcing initial) ✅ validé

**Décision.** Séparation commands/queries (MediatR). Read model = projections dans la même base. **Pas d'event sourcing** au départ.
**Pourquoi.** Simplicité et vitesse de livraison ; l'ES ajoute une complexité non justifiée maintenant.
**Conséquence.** Event sourcing activable **par module** plus tard si un besoin d'audit/temporalité l'exige. Domain events dispatchés vers integration events via Outbox.

## ADR-004 — Outbox transactionnel + bus in-process

**Décision.** Integration events publiés via Outbox, consommés par un bus in-process ; abstraction prête pour un broker externe.
**Pourquoi.** Fiabilité de livraison (idempotence) sans infra broker maintenant ; migration vers RabbitMQ/Kafka non bloquante.

## ADR-005 — Persistance : schema-per-module + DB-per-région ✅ validé

**Décision.** Un schéma PostgreSQL par module (pas de FK cross-schema) ; une base **par région** (souveraineté/résidence).
**Pourquoi.** Isolation logique des modules + exigences de résidence des données (Togo local / HDS FR / HIPAA US).
**Conséquence.** Un `DbContext` EF Core par module ; tenant → région → connexion + pack. Pas de base unique multi-pays. Forme domaine = source de vérité ; FHIR en JSONB pour audit/échange.

## ADR-006 — Clients fins, domaine côté serveur ✅ validé

**Décision.** MAUI Blazor Hybrid + Blazor Web consomment `Lafie.Api` ; logique domaine côté serveur ; UI partagée via Razor Class Library.
**Pourquoi.** Une seule source de vérité métier ; « plusieurs versions depuis un socle » via composants partagés.
**Conséquence.** Offline-first MAUI = extension future (sous-ensemble local + synchro), non retenue au départ. À rouvrir si la connectivité terrain au Togo l'impose.

## ADR-007 — FHIR R4 + IPS comme pivot ; Firely SDK

**Décision.** FHIR R4 (4.0.1) au cœur, IPS comme format d'échange pivot inter-pays, (dé)sérialisation via Firely `Hl7.Fhir.R4`.
**Pourquoi.** Standard international portable Togo/UE/USA ; IPS adopté UE + OMS.
**Conséquence.** Module Interop = anti-corruption layer domaine ↔ FHIR. Validation de profils selon le pack actif.

## ADR-008 — Premier jalon : squelette de solution seul ✅ validé

**Décision.** Livrer d'abord la structure de solution (projets, frontières, building blocks, tests d'architecture) **sans logique métier**.
**Pourquoi.** Figer les frontières avant d'écrire du domaine.
**Conséquence.** Voir la section 11 de [README.md](README.md). Création **en attente d'un go explicite**.

## Stack retenue

.NET 10 · ASP.NET Core · Firely `Hl7.Fhir.R4` · EF Core + Npgsql · MediatR · FluentValidation · Outbox/bus in-process · MAUI Blazor Hybrid + Blazor Web + RCL · NetArchTest/ArchUnitNET · Testcontainers · OpenTelemetry.

Solution au format **`Lafie.slnx`** (XML, défaut .NET 10). Squelette Phase 0 livré (26 projets, build 0/0). ⚠️ Gotcha : **Smart App Control (Enforce)** bloque le chargement des DLL locales non signées (`0x800711C7`) → exécution du host reportée (WSL/Docker ou désactivation SAC). Détails : [README.md](README.md) §13.

## Points à trancher plus tard

- Qualification **DM logiciel** (MDR UE + FDA US) si aide à la décision clinique → conditionne ISO 13485/14971/IEC 62304.
- Offline-first MAUI selon connectivité Togo.
- Passage éventuel à un broker externe (si extraction de modules).
- Adoption **.NET Aspire** pour l'orchestration locale (optionnel).
