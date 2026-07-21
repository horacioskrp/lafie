# 03 — Extensions Mesures

Quatre extensions métier définies par l'IG, toutes de contexte `Observation`.

## MesReasonForMeasurement — Motif de la mesure

| | |
| --- | --- |
| Id | `mesures-reason-for-measurement` |
| Contexte | `Observation` |
| Valeur | `string` (texte libre) |
| Cardinalité (dans socle) | 0..1 |

Motif exprimé librement (ex. diabète, surpoids, hypercholestérolémie, risque cardiovasculaire, suivi).

```
Extension: MesReasonForMeasurement
Id: mesures-reason-for-measurement
* ^context.expression = "Observation"
* value[x] only string
```

## MesMomentOfMeasurement — Moment de la mesure

| | |
| --- | --- |
| Id | `mesures-moment-of-measurement` |
| Contexte | `Observation` |
| Valeur | `CodeableConcept` (coding 0..1, `system` + `code` obligatoires) |
| Cardinalité | 0..1 |

Utilisée notamment pour le **glucose sanguin** ; la valeur est alors liée (`required`) au JDV `J157-MomentGlucose`.

```
* value[x] only CodeableConcept
* valueCodeableConcept.coding ..1
* valueCodeableConcept.coding.system 1..
* valueCodeableConcept.coding.code 1..
```

## MesNumberOfDays — Nombre de jours

| | |
| --- | --- |
| Id | `mesures-number-of-days` |
| Contexte | `Observation` |
| Valeur | `CodeableConcept` lié (`required`) au JDV `J164-GlucoseNumberOfDays` |
| Cardinalité | 0..1 |

Utilisée pour le glucose **interstitiel** et l'**IGG** (période de mesure).

## MesOriginalData — Valeur originale

| | |
| --- | --- |
| Id | `mesures-original-data` |
| Contexte | `Observation` |
| Structure | **extension complexe** (3 sous-extensions) |
| Cardinalité (biologie) | 0..1 |

Conserve la donnée **telle que mesurée** quand une conversion d'unité a eu lieu (ex. g/L → mmol/L).

| Sous-extension | Card | Valeur | Rôle |
| --- | --- | --- | --- |
| `has-been-converted` | 1..1 | `boolean` (= true) | Indique qu'une conversion a eu lieu |
| `original-code` | 1..1 | `CodeableConcept` | Code LOINC d'origine (niveau de comparabilité) |
| `original-value` | 1..1 | `Quantity` | Valeur originale mesurée |

```
* extension contains has-been-converted 1..1 and original-code 1..1 and original-value 1..1
* extension[has-been-converted].valueBoolean = true
* extension[original-code].value[x] only CodeableConcept
* extension[original-value].value[x] only Quantity
```

## Implémentation Lafie

- Modéliser chaque extension comme un **value object** rattaché à l'observation.
- `MesOriginalData` : value object composite `{ HasBeenConverted, OriginalCode (Coding), OriginalValue (Quantity) }` — à remplir automatiquement dès qu'une conversion d'unité est appliquée dans le domaine.
- Les extensions à binding `required` (`MesNumberOfDays`, valeur de `MesMomentOfMeasurement` pour glucose) doivent être **validées contre la terminologie** avant persistance.
- Au (dé)sérialisation FHIR : mapper via l'URL canonique `<canonical>/StructureDefinition/<Id>`, ex. `https://interop.esante.gouv.fr/ig/fhir/mesures/StructureDefinition/mesures-original-data`.
