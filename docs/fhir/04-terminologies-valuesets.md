# 04 — Terminologies et ValueSets

L'IG s'appuie sur des systèmes de codes standard **et** sur les jeux de valeurs (JDV) du **NOS** (Nomenclature des Objets de Santé) publiés par l'ANS.

## Systèmes de codes de référence

| Système | URL | Usage |
| --- | --- | --- |
| UCUM | `http://unitsofmeasure.org` | Unités de mesure (kg, cm, mmHg, mg/dL, %…) |
| LOINC | `http://loinc.org` | Codes des observations et documents (ex. `11502-2` compte rendu labo, `2085-9` HDL, `2093-3` chol. total) |
| SNOMED CT (ext. FR) | via `expansion-params.json` | Concepts cliniques |
| observation-category | `http://terminology.hl7.org/CodeSystem/observation-category` | Catégorie (`vital-signs`) |
| observation-interpretation | `http://hl7.org/fhir/ValueSet/observation-interpretation` | Interprétation (extensible) |
| ContinuaDeviceIdentifiers | `http://hl7.org/fhir/uv/phd/CodeSystem/ContinuaDeviceIdentifiers` | Identifiants dispositifs Continua |

## Jeux de valeurs NOS / ANS (JDV)

Base : `https://mos.esante.gouv.fr/NOS/JDV_<code>-ENS/FHIR/JDV-<code>-ENS`

| Alias | JDV | Champ ciblé | Force |
| --- | --- | --- | --- |
| J145-MethodBodyWeight | méthode pesée | `method` (poids) | extensible |
| J146-MethodBodyHeight | méthode taille | `method` (taille) | extensible |
| J147-MethodHeartrate | méthode FC | `method` (fréq. cardiaque) | extensible |
| J149-BodySiteBP | site tension | `bodySite` (PA) | required |
| J150-MethodBP | méthode tension | `method` (PA) | extensible |
| J151-BodySiteBodyTemperature | site température | `bodySite` (temp.) | — |
| J152-MethodBodyTemperature | méthode température | `method` (temp.) | — |
| J153-TypeDiabete | type de diabète | contexte glycémie | — |
| J154-TypeGlucose | type de glucose | `code` (glycémie) | extensible |
| J155-MethodGlucoseSanguin | méthode glucose sanguin | `method` | — |
| J156-MethodGlucoseInterstitiel | méthode glucose interstitiel | `method` | — |
| J157-MomentGlucose | moment glucose | ext. `MesMomentOfMeasurement` | required |
| J158-MethodStepsByDay | méthode pas/jour | `method` | — |
| J159-MethodPainSeverity | méthode douleur | `method` | — |
| J163-GlucoseUnits | unités glucose | `valueQuantity.code` (glycémie) | required |
| J164-GlucoseNumberOfDays | nb de jours glucose | ext. `MesNumberOfDays` | required |

### Terminologie biologie (CISIS)

| Alias | URL | Usage |
| --- | --- | --- |
| jdv-technique-biologie-cisis | `https://smt.esante.gouv.fr/fhir/ValueSet/jdv-technique-biologie-cisis` | `method` des observations biologie (extensible) |

### ValueSet local

- `method-glucose-vs` (défini dans l'IG, `input/fsh/ValueSets/methodglucose.fsh`) — méthodes de mesure du glucose (extensible).

## Force des bindings — sémantique

| Force | Règle de validation |
| --- | --- |
| `required` | La valeur **doit** appartenir au ValueSet. Rejet sinon. |
| `extensible` | Utiliser le ValueSet si un code adéquat existe ; sinon un autre code est toléré. |
| `preferred` / `example` | Indicatif. |

## Implémentation Lafie

- **Ne pas coder en dur** les jeux de valeurs. Prévoir un **module Terminologie** (borné DDD) qui :
  - charge/expande les ValueSets depuis un serveur de terminologie (SMT ANS / serveur FHIR interne) ;
  - valide un `Coding` contre un ValueSet + force de binding ;
  - met en cache les expansions (PostgreSQL + cache mémoire).
- Exposer une abstraction `ITerminologyValidator.Validate(coding, valueSetUrl, bindingStrength)`.
- Les codes fréquents (UCUM, catégories) peuvent être des constantes ; les JDV NOS doivent rester **résolus dynamiquement** (ils évoluent).
- Prévoir la dépendance au **serveur multi-terminologies (SMT)** de l'ANS et à l'extension SNOMED CT France (`expansion-params.json`).
