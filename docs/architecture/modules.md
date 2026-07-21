# Catalogue des modules Lafie

Proposition de découpage fonctionnel du HIS/EMR en **bounded contexts** (modules). Statut : **proposition à valider/affiner**. Chaque module = 4 couches (`Domain`/`Application`/`Infrastructure`/`Api`), nommage `Lafie.<Module>.*`.

Légende : ✅ déjà validé · ➕ proposé · Phase = jalon de livraison (voir §Roadmap).

## A. Administration & identité

| Module | Périmètre | Ressources FHIR clés | Dépend de | Phase |
| --- | --- | --- | --- | --- |
| **Identity** ✅ | Utilisateurs, authentification/autorisation, professionnels de santé, rôles, habilitations | `Practitioner`, `PractitionerRole` | — | 0 |
| **Organization** ✅ | Établissements, services, unités de soins, salles, **lits**, localisations | `Organization`, `Location`, `HealthcareService` | — | 0 |
| **Patient** ✅ | Démographie, **MPI** (index maître), identifiants (INS/NIF/MRN), proches, couverture | `Patient`, `RelatedPerson` | Terminology | 0 |

## B. Parcours clinique

| Module | Périmètre | Ressources FHIR clés | Dépend de | Phase |
| --- | --- | --- | --- | --- |
| **Scheduling** ➕ | Rendez-vous, créneaux, ressources, files d'attente | `Appointment`, `Slot`, `Schedule` | Patient, Organization | 1 |
| **Encounter (ADT)** ➕ | Admission / sortie / transfert, affectation de lit, gestion des rencontres | `Encounter`, `EpisodeOfCare` | Patient, Organization | 1 |
| **Clinical** ✅ | Cœur EMR : observations/signes vitaux, diagnostics (conditions), problèmes, allergies, notes cliniques, actes, plans de soins | `Observation`, `Condition`, `AllergyIntolerance`, `Procedure`, `CarePlan`, `ClinicalImpression` | Patient, Encounter, Terminology | 1 |
| **Orders (CPOE)** ➕ | Prescription connectée : orchestration des demandes (labo, imagerie, médicaments, adressage) | `ServiceRequest`, `MedicationRequest`, `Task` | Clinical | 1 |
| **Pharmacy** ✅ | Livret thérapeutique, prescription, dispensation, administration (MAR), stock médicaments | `Medication`, `MedicationRequest`, `MedicationDispense`, `MedicationAdministration` | Orders, Terminology | 1 |
| **Laboratory** ✅ | Demandes labo, prélèvements, résultats, comptes rendus, interop LIS | `ServiceRequest`, `Specimen`, `Observation`, `DiagnosticReport` | Orders, Terminology | 1 |
| **Radiology / Imaging** ➕ | Demandes d'imagerie, **DICOM / DICOMweb**, intégration PACS/VNA, comptes rendus. Lib .NET : **fo-dicom**. Voir [`standards/dicom.md`](../standards/dicom.md) | `ServiceRequest`, `ImagingStudy`, `DiagnosticReport` | Orders | 2 |
| **Nursing / Care** ➕ | Évaluations infirmières, tâches de soins, tournées de constantes, exécution MAR | `Task`, `Observation`, `CarePlan` | Clinical, Encounter | 2 |

## C. Support & logistique

| Module | Périmètre | Ressources FHIR clés | Dépend de | Phase |
| --- | --- | --- | --- | --- |
| **Inventory / Stock** ➕ | Fournitures médicales, entrepôt, mouvements, seuils (mutualisable avec Pharmacy) | `InventoryItem`, `SupplyRequest`, `SupplyDelivery` | Organization | 2 |
| **Documents (DMS)** ➕ | Gestion documentaire, pièces scannées, stockage des comptes rendus | `DocumentReference`, `Binary` | — | 2 |

## D. Financier

| Module | Périmètre | Ressources FHIR clés | Dépend de | Phase |
| --- | --- | --- | --- | --- |
| **Billing** ✅ | Tarification, facturation, encaissement | `ChargeItem`, `Invoice` | Encounter, Clinical | 1 |
| **Insurance / Coverage** ➕ | Payeurs, couverture (**AMU** Togo), prises en charge, réclamations (X12 US) | `Coverage`, `Claim`, `ClaimResponse` | Patient, Billing | 2 |

## E. Interopérabilité & pilotage (plateforme)

| Module | Périmètre | Ressources FHIR clés | Dépend de | Phase |
| --- | --- | --- | --- | --- |
| **Terminology** ✅ | Service multi-code (LOINC/SNOMED/ICD/ATC), validation de binding, expansions | `CodeSystem`, `ValueSet`, `ConceptMap` | — | 0 |
| **Interop** ✅ | FHIR Gateway (IPS/Bundle), **connecteur DHIS2**, HL7v2/DICOM ingress, échange documents, **adapters de conformité par pays** | `Bundle`, `MessageHeader`, `Consent` | (ports) | 0 |
| **DataProtection** ➕ | **Consentement** (`Consent` FHIR), droits des personnes (accès/rectification/effacement/portabilité), politique de rétention, pilotage de l'audit d'accès | `Consent`, `AuditEvent` | (transverse) | 1 |
| **Reporting & Analytics** ➕ | Indicateurs, tableaux de bord, agrégats **SNIS/DHIS2** | `Measure`, `MeasureReport` | Interop | 2 |
| **Notifications** ➕ | SMS / e-mail / push (rappels de RDV — clé mobile Togo) | `Communication`, `CommunicationRequest` | Scheduling | 1 |

## Transverse (BuildingBlocks, pas des modules)

- **Audit ATNA** — écriture du journal inaltérable des accès → `Lafie.Infrastructure` (bas niveau). La **consultation/politique** d'audit est exposée par le module **DataProtection**.
- Auth OIDC/SMART, config, télémétrie → `Lafie.Infrastructure`.

> Décision : **Consent** est désormais dans un **module `DataProtection` dédié** (RGPD/HIPAA/loi 2019-014), pas dans Interop.

## Spécialités (phase ultérieure — pas encore des modules)

Candidats phase 3, pertinents selon la cible : **Emergency/Triage**, **Surgery / Bloc opératoire**, **Maternité/Obstétrique** (santé maternelle Togo), **Immunisation/PEV** (vaccination OMS), **Banque du sang**.

## Roadmap de livraison (Togo d'abord)

| Phase | Modules | Objectif |
| --- | --- | --- |
| **0 — Socle** | BuildingBlocks + Identity, Organization, Patient, Terminology, Interop | Fondations + interop/identité. Cible du **squelette**. |
| **1 — MVP soins (Togo)** | Scheduling, Encounter (ADT), Clinical, Orders, Pharmacy, Laboratory, Billing, DataProtection, Notifications | **Périmètre MVP confirmé.** Parcours de soins de bout en bout + facturation de base + conformité données. |
| **2 — Extension** | Radiology, Nursing, Inventory, Documents, Insurance, Reporting | Ancillaires, logistique, couverture AMU, reporting SNIS. |
| **3 — Spécialités** | Emergency, Surgery, Maternité, Immunisation, Banque du sang | Services spécialisés. |

## Règles de dépendances

- Aucun module ne référence un autre directement. Les liens « Dépend de » se traduisent en **integration events** (Outbox) ou **API publiques** exposées via `Lafie.Shared`.
- `Orders (CPOE)` est un **orchestrateur** : il émet des demandes que Pharmacy/Laboratory/Radiology consomment par événement (chorégraphie), pas par appel direct.
- `Terminology` et `Interop` sont des **modules supports** transverses au parcours clinique.

## Décisions actées (2026-07-21)

- **Nursing** : ✅ module dédié (Phase 2).
- **Encounter (ADT)** : ✅ module dédié, séparé de `Clinical` (Phase 1).
- **Consent** : ✅ module **`DataProtection`** dédié (Phase 1), pas dans Interop.
- **Insurance / Coverage** : ✅ module séparé de `Billing` (Phase 2).
- **Périmètre MVP Togo** : ✅ = **Phase 1** (Scheduling, Encounter, Clinical, Orders, Pharmacy, Laboratory, Billing, DataProtection, Notifications), sur socle Phase 0.

## Catalogue figé

**Phase 0 (5)** : Identity, Organization, Patient, Terminology, Interop.
**Phase 1 (9)** : Scheduling, Encounter, Clinical, Orders, Pharmacy, Laboratory, Billing, DataProtection, Notifications.
**Phase 2 (6)** : Radiology, Nursing, Inventory, Documents, Insurance, Reporting.
**Phase 3** : Emergency, Surgery, Maternité, Immunisation/PEV, Banque du sang.

→ **20 modules** cadrés (Phases 0–2) + spécialités Phase 3.
