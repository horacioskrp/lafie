# Documentation Lafie

**Lafie** — plateforme open source de gestion hospitalière et de dossier médical électronique (**HIS/EMR**), moderne, modulaire et interopérable.

**Architecture cible :** C# **modular monolith** en **DDD**, **MAUI Blazor** (multi-version desktop/mobile/web), communication **event-driven + CQRS**, **PostgreSQL**, interopérabilité **HL7 / FHIR**.

**Cibles de déploiement :** **Togo** (principale), **Europe** (UE), **USA** (si possible).

> Statut : **cadrage / conception**. Aucune implémentation à ce stade.

## Dossiers

| Dossier | Contenu |
| --- | --- |
| [`architecture/`](architecture/README.md) | **Architecture validée** : modular monolith DDD/CQRS, découpage solution .NET, packs enfichables, persistance, clients MAUI/Blazor, stack + journal des décisions (ADR) + [catalogue des modules](architecture/modules.md). |
| [`conformite/`](conformite/README.md) | **Cadre de conformité multi-juridiction** : socle international, packs Togo / UE / USA, protection des données, design des conformance packs. **Point d'entrée pour la stratégie d'interopérabilité.** |
| [`standards/`](standards/dicom.md) | **Normes techniques internationales** (deep-dives). Aujourd'hui : [DICOM](standards/dicom.md) (imagerie). |
| [`fhir/`](fhir/README.md) | **Pack France (ANS)** — IG FHIR « Mesures de santé » : profils Observation, extensions, terminologies, flux Bundle. Sert aussi de **modèle de bonnes pratiques** FHIR pour les autres packs. |

## Par où commencer

1. [`conformite/README.md`](conformite/README.md) — la stratégie d'ensemble (noyau agnostique + packs).
2. [`conformite/01-socle-international.md`](conformite/01-socle-international.md) — les standards communs (FHIR R4, IPS, IHE, SMART, terminologies).
3. [`conformite/02-togo.md`](conformite/02-togo.md) — la cible principale.
4. [`fhir/`](fhir/README.md) — l'exemple concret et abouti d'un pack national (France).
