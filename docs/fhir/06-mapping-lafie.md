# 06 — Correspondance IG ANS ↔ architecture Lafie (pack France)

Comment le socle FHIR « Mesures de santé » se traduit dans l'architecture cible de Lafie : **modular monolith C# / DDD / CQRS event-driven / PostgreSQL** ; frontend **React/TS/Vite**.

> ⚠️ **Portée France.** Ce mapping concerne le **pack France (ANS)** uniquement (INS, MES, HDS, fr-core…). Pour la cible réelle **multi-juridiction** (Togo/UE/USA) et le design des packs enfichables, voir [`docs/conformite/06-conformance-packs.md`](../conformite/06-conformance-packs.md). Les contextes ci-dessous (`Measurements`, `Biology`, `Devices`, `Terminology`, `Interop`) appartiennent au **noyau agnostique** ; seuls les éléments **INS / MES / HDS / profils ANS** sont spécifiques au pack France.

> Statut : **cadrage**. Rien n'est encore implémenté. Ce document oriente les choix, il ne fige pas le code.

## Bounded contexts concernés

| Contexte (module) | Responsabilité | Éléments IG rattachés |
| --- | --- | --- |
| **Measurements** | Saisie/gestion des mesures de santé | Profils Observation (signes vitaux), extensions, invariants |
| **Biology** | Résultats de biologie de suivi | Profils biologie, DiagnosticReport, RuleSet biologie |
| **Devices** | Objets connectés / dispositifs | Profil PhdDevice, identité OID+identifier, conditional create |
| **Terminology** | Résolution/validation des codes | LOINC, UCUM, SNOMED, JDV NOS, SMT ANS |
| **Interop / FHIR Gateway** | Sérialisation FHIR + échange | Bundle transaction, client MES, OAuth, OperationOutcome |
| **Patient / Encounter** *(socle fr-core)* | Références patient/rencontre | fr-core-patient, fr-core-encounter, performers |

Chaque module = frontière DDD isolée. Communication inter-modules par **événements** (in-process bus, alignés CQRS).

## Modèle de domaine (esquisse)

- **Agrégat `Measurement`** (contexte Measurements) — racine par observation :
  - identité, `subject` (PatientRef), `encounter` (EncounterRef), `performer`, `effective`, `value` (Quantity), `method`, `bodySite`, `interpretation`, `device` (DeviceRef), `meta.source` ;
  - value objects : `Quantity { value, unit(UCUM), system, code }`, `Coding { system, code, display }` ;
  - extensions comme value objects : `ReasonForMeasurement`, `MomentOfMeasurement`, `NumberOfDays`, `OriginalData`.
  - spécialisations par type (Poids, Taille, PA, Température, FC, SpO2, FR, Périmètres, Douleur, Pas/jour) portant leurs invariants (unité fixe, effective=dateTime, bindings).
- **Agrégat `BiologyReport`** (contexte Biology) — mappe `DiagnosticReport` : regroupe des `BiologyObservation` (LDL/HDL/total/trigly/aspect/glycémie), impose `referenceRange`, invariants HDL⇔total.
- **Agrégat `Device`** (contexte Devices) — identité (OID + identifier), profil PhdDevice, idempotence.

> **IMC** : ne pas modéliser comme mesure créable — c'est une **valeur dérivée** (calcul poids/taille²). Aligne le domaine sur la règle MES (« Bmi observation cannot be created »).

## Flux CQRS / événements

```
Command  SubmitMeasurement(cmd)
   -> Domain validation (invariants + terminology)
   -> persist (PostgreSQL, forme domaine)
   -> Event  MeasurementRecorded
        -> [handler] FHIR Gateway : build Bundle(transaction) -> POST MES
             -> success  -> Event MeasurementSubmitted   (status/location)
             -> 422/erreur -> Event MeasurementRejected  (OperationOutcome -> erreurs domaine)
```

- **Commandes** : `SubmitMeasurement`, `SubmitBiologyReport`, `RegisterDevice`.
- **Requêtes** : lecture des mesures/rapports (projections read-model).
- **Événements** : `MeasurementRecorded`, `MeasurementSubmitted`, `MeasurementRejected`, `DeviceRegistered`.

## Persistance PostgreSQL

- Stocker la **forme domaine** (tables relationnelles par agrégat), pas le JSON FHIR brut comme source de vérité.
- Conserver éventuellement le **payload FHIR** (JSONB) à titre d'audit/traçabilité (`meta.source`, bundle envoyé, transaction-response reçue).
- Cache des **expansions de ValueSets** (contexte Terminology).

## Couche Interop (FHIR Gateway)

- Sérialisation R4 (4.0.1). Envisager la lib **Firely .NET SDK (Hl7.Fhir.R4)** pour (dé)sérialiser et valider contre les profils (packages `hl7.fhir.fr.core`, `hl7.fhir.uv.phd`, `ans.fr.terminologies`).
- Provisionner un **validateur FHIR** avec ces packages (validation locale avant envoi → évite les 422).
- Client HTTP FHIR authentifié (OAuth : id_token, access_token, idPe, consentement) vers l'entrepôt **MES**.
- URL canoniques des profils = `https://interop.esante.gouv.fr/ig/fhir/mesures/StructureDefinition/<id>`.

## Frontend (React/TS/Vite)

- Le socle domaine + interop reste **côté serveur** (.NET) ; le front React consomme l'API par HTTP.
- La saisie de mesures (formulaires par type) applique les règles de validation **côté serveur** → une seule source de vérité.
- Les objets connectés (PhdDevice) : capture ultérieure côté mobile (React Native / passerelle device), puis même pipeline CQRS serveur.

## Prochaines étapes suggérées (non engagées)

1. Bootstrap solution : modular monolith (un projet par bounded context + Shared Kernel).
2. Intégrer Firely SDK + provisionner les packages FHIR (fr-core, phd, terminologies ANS).
3. Modéliser l'agrégat `Measurement` + 1 ou 2 profils pilotes (Poids, PA) de bout en bout.
4. Implémenter le contexte Terminology (validation binding).
5. Implémenter la FHIR Gateway (Bundle transaction + client MES simulé).
6. Étendre aux profils biologie + DiagnosticReport.

> Attendre validation explicite avant d'implémenter (cf. consigne : ne rien coder pour l'instant).
