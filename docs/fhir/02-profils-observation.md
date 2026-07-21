# 02 — Profils Observation

Tous les profils de mesure sont des `Observation`. Ils partagent un **socle commun** appliqué par RuleSet, puis ajoutent leurs contraintes propres.

## Socle commun — RuleSet `ObservationResultsMesures`

Inséré (`* insert ObservationResultsMesures`) dans **tous** les profils. Contraintes :

| Élément | Contrainte |
| --- | --- |
| `meta.source` | URI du système émetteur, forme OID : `urn:oid:xx.xx.xx` |
| `extension[supportingInfo]` | 0..1 — `workflow-supportingInfo`, autres ressources pertinentes du dossier |
| `extension[MesReasonForMeasurement]` | 0..1 — motif de la mesure (texte libre) |
| `subject` | `Reference(fr-core-patient)` |
| `encounter` | `Reference(fr-core-encounter)` |
| `performer` | `Reference(CareTeam \| RelatedPerson \| Patient \| Practitioner \| PractitionerRole \| Organization)` |

> **Implémentation** : modéliser une entité/agrégat de base `MeasurementObservation` portant ces champs communs. Les profils concrets en héritent.

## Signes vitaux

Parent = profil fr-core correspondant (sauf indication). Chaque profil ajoute typiquement : `method` (MS + binding NOS), `device` (`Reference(PhdDevice)`), `interpretation` (ValueSet HL7, extensible).

| Profil (Id) | Titre | Parent | Valeur / unité | Terminologies clés |
| --- | --- | --- | --- | --- |
| `mesures-fr-observation-body-weight` | Poids | fr-core-observation-body-weight | Quantity **kg** (UCUM) | method: J145 |
| `mesures-fr-observation-bodyheight` | Taille | fr-core-observation-body-height | Quantity **cm** | method: J146 |
| `mesures-fr-observation-bmi` | IMC | fr-core-observation-bmi | Quantity kg/m² | *calculé — non créable côté MES* |
| `mesures-fr-observation-body-temperature` | Température | fr-core-observation-body-temperature | Quantity °C | bodySite: J151, method: J152 |
| `mesures-fr-observation-bp` | Pression artérielle | fr-core-observation-bp | composants systolique/diastolique mmHg | bodySite: J149, method: J150 |
| `mesures-fr-observation-heartrate` | Fréquence cardiaque | fr-core-observation-heartrate | Quantity /min | method: J147 |
| `mesures-fr-observation-oxygen-sat` | Saturation O2 | fr-core-observation-saturation-oxygen | Quantity % | — |
| `mesures-fr-observation-resp-rate` | Fréquence respiratoire | fr-core-observation-resp-rate | Quantity /min | — |
| `mesures-observation-head-circumference` | Périmètre crânien | headcircum (FHIR core) | Quantity cm | — |
| `mesures-observation-waist-circumference` | Périmètre abdominal | vitalsigns | Quantity cm | — |
| `mesures-observation-pain-severity` | Sévérité douleur | vitalsigns | score | method: J159 |
| `mesures-observation-steps-by-day` | Pas par jour | vitalsigns | count | method: J158 |

### Exemple : Pression Artérielle (`MesFrObservationBp`)

```
Profile: MesFrObservationBp
Parent:  $FrObservationBp          // fr-core-observation-bp
Id:      mesures-fr-observation-bp

* insert ObservationResultsMesures
* extension contains mesures-moment-of-measurement named MesMomentOfMeasurement 0..1
* category[VSCat].coding.display = "vital-signs"
* subject 1..1
* effective[x] only dateTime
* bodySite from JDV-J149-BodySiteBP-MES (required)
* bodySite.coding.system 1..    // system + code obligatoires
* bodySite.coding.code 1..
* method MS
* method from JDV-J150-MethodBP-MES (extensible)
* device only Reference(PhdDevice)
* device MS
* interpretation from http://hl7.org/fhir/ValueSet/observation-interpretation (extensible)
```

### Exemple : Poids (`MesFrObservationBodyWeight`)

```
* value[x] only Quantity
* valueQuantity = http://unitsofmeasure.org#kg   // unité fixée kg (UCUM)
* valueQuantity.system 1..
* valueQuantity.code 1..
* dataAbsentReason.coding.system 1..
* dataAbsentReason.coding.code 1..
* method from JDV-J145-MethodBodyWeight-MES (extensible)
* device only Reference(PhdDevice)
```

### Points d'attention signes vitaux

- `effective[x]` restreint à `dateTime` sur plusieurs profils (pas de Period).
- `system` **et** `code` toujours obligatoires quand un `Coding` est présent (bodySite, method, valeur, dataAbsentReason).
- **IMC non créable** : côté MES l'IMC est calculé à la volée → toute tentative de POST renvoie une erreur (`Bmi observation cannot be created`).
- `device` en Must-Support ; **obligatoire** si la mesure provient d'un objet connecté.

## Biologie

Socle biologie = RuleSet `ObservationResultsBiologyMesures`, qui **insère** `ObservationResultsMesures` puis ajoute :

| Ajout | Contrainte |
| --- | --- |
| `extension[mes-original-data]` | 0..1 — valeur d'origine si conversion d'unité (ex. g/L → mmol/L) |
| `method` | MS, `from jdv-technique-biologie-cisis (extensible)` |
| `referenceRange` | 0..1, MS — intervalle de référence fortement recommandé |

### Profils biologie

| Profil (Id) | Titre | Parent | Notes |
| --- | --- | --- | --- |
| `mesures-observation-cholesterol-ldl` | Cholestérol LDL | vitalsigns | LOINC dédié |
| `mesures-observation-cholesterol-hdl` | Cholestérol HDL | vitalsigns | code 2085-9 |
| `mesures-observation-cholesterol-total` | Cholestérol total | vitalsigns | code 2093-3 |
| `mesures-observation-cholesterol-trigly` | Triglycérides | vitalsigns | — |
| `mesures-observation-cholesterol-aspect` | Aspect du sérum | vitalsigns | — |
| `mesures-observation-glucose` | Glycémie | vitalsigns | 3 types (voir ci-dessous) |
| `mesures-observation-hb1ac` | HbA1c | vitalsigns | % |

### Glycémie (`MesObservationGlucose`) — cas particulier

Gère **3 indicateurs** via le même profil :
- Glucose **sanguin** (mg/dl) — extension `MesMomentOfMeasurement` utilisée (contexte : à jeun, postprandial…).
- Glucose **interstitiel** (mg/dl) — extension `MesNumberOfDays` requise.
- **Index de Gestion de Glycémie (IGG)** (%) — estimation HbA1c — extension `MesNumberOfDays` requise.

```
* code from JDV-J154-TypeGlucose-MES (extensible)     // type de glycémie
* extension[MesMomentOfMeasurement].value[x] from JDV-J157-MomentGlucose-MES (required)
* extension[MesNumberOfDays] 0..1
* effective[x] only dateTime
* value[x] only Quantity
* valueQuantity.system = "http://unitsofmeasure.org"
* valueQuantity.code from JDV-J163-GlucoseUnits-MES (required)
* method from method-glucose-vs (extensible)
* device only Reference(PhdDevice)
```

Règles conditionnelles (renvoyées en erreur si violées) :
- `moment` obligatoire pour le glucose sanguin ; interdit sinon.
- `numberOfDays` obligatoire pour interstitiel/IGG ; interdit sinon.

### DiagnosticReport biologie (`MesDiagnosticReport`)

Regroupe les résultats. Parent = `DiagnosticReport`.

```
* code = http://loinc.org#11502-2  "Compte rendu du laboratoire"
* result contains ldl-cholesterol / hdl-cholesterol / total-cholesterol /
                  trigly-cholesterol / cholesterol-aspect / glycemie  (chacun 0..1, MS)
* result[ldl-cholesterol] only Reference(mesures-observation-cholesterol-ldl)
  ... (une slice Reference par profil d'observation)
```

Invariant `mes-ir` (error) : l'intervalle de référence est obligatoire si la donnée provient d'un compte rendu de biologie.

## Résumé pour l'implémentation

- Un **type de mesure = un profil = une variante d'agrégat** avec ses invariants.
- Facteur commun : le socle `ObservationResultsMesures` (+ biologie).
- Les **bindings de terminologie** sont des règles de validation métier → voir [04](04-terminologies-valuesets.md).
- Les **extensions** portent des données métier structurées → voir [03](03-extensions.md).
