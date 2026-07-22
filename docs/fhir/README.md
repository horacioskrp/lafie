# Pack France (ANS) — FHIR « Mesures de santé »

> ⚠️ **Portée.** Ce dossier documente le **pack de conformité France** (ANS), qui est **un pack parmi plusieurs** (Togo, UE, USA — voir [`docs/conformite/`](../conformite/README.md)). Lafie vise **Togo en priorité**, puis UE et USA. Le contenu ci-dessous s'applique **uniquement** à un déploiement France, **et** sert de **modèle de bonnes pratiques** de structuration FHIR réutilisable pour les autres packs. Ne pas le prendre pour la cible de conformité de Togo/UE/USA.

Documentation de référence pour l'implémentation de l'interopérabilité **HL7 FHIR** en contexte **France**.

Base normative : **Guide d'Implémentation FHIR « Mesures de santé »** de l'ANS (Agence du Numérique en Santé).

- Source : <https://github.com/ansforge/IG-fhir-mesures-de-sante>
- IG publié : <https://interop.esante.gouv.fr/ig/fhir/mesures>
- Version IG : **3.2.0** (dernière release) — FHIR **R4 (4.0.1)** — Juridiction : France
- Docs synchronisées sur `main` HEAD au **2026-07-07** (10 commits post-release 3.2.0 déjà intégrés ; non encore publiés en release officielle)

Ces documents synthétisent l'IG (écrit en FHIR Shorthand / FSH) sous une forme directement exploitable pour coder les modules Lafie (modular monolith DDD, C#, CQRS/event-driven, PostgreSQL/Dapper ; frontend React/TS/Vite).

## Sommaire

| Doc | Contenu |
| --- | --- |
| [01-overview-et-architecture.md](01-overview-et-architecture.md) | Périmètre de l'IG, dépendances, versions, principes |
| [02-profils-observation.md](02-profils-observation.md) | Les 11+ profils Observation (signes vitaux + biologie), champs et contraintes |
| [03-extensions.md](03-extensions.md) | Les 4 extensions métier Mesures |
| [04-terminologies-valuesets.md](04-terminologies-valuesets.md) | Systèmes de codes (LOINC, UCUM, SNOMED, NOS/JDV) et bindings |
| [05-flux-alimentation-bundle.md](05-flux-alimentation-bundle.md) | Transaction Bundle, requêtes/réponses HTTP, gestion d'erreurs |
| [06-mapping-lafie.md](06-mapping-lafie.md) | Correspondance IG ↔ modules et modèle de domaine Lafie |

## Avertissement de portée

L'IG ANS « Mesures de santé » couvre **un domaine précis** : l'alimentation de mesures (signes vitaux, biologie de suivi, objets connectés) vers l'entrepôt national MES. Il **ne couvre pas** l'ensemble d'un HIS/EMR (admission, encounter complet, prescription, imagerie, facturation…).

Pour Lafie, il sert de :
1. **Fondation de conformité** pour tout ce qui touche aux mesures/observations et aux dispositifs.
2. **Modèle de bonnes pratiques** (structuration FHIR, terminologies FR, patterns de flux) à répliquer pour les autres domaines FHIR à venir (Patient, Encounter, DiagnosticReport élargi, etc.).

Les profils s'appuient sur **fr-core** (`hl7.fhir.fr.core` 2.1.0) et le profil international **PhdDevice** (`hl7.fhir.uv.phd` 1.0.0). Ces dépendances constituent le socle FHIR FR à intégrer.
