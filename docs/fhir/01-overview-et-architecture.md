# 01 — Vue d'ensemble et architecture de l'IG

## Identité de l'IG

| Paramètre | Valeur |
| --- | --- |
| `id` | `ans.fhir.fr.mesures` |
| `canonical` | `https://interop.esante.gouv.fr/ig/fhir/mesures` |
| Titre | Guide d'implémentation FHIR - Mesures de santé |
| Éditeur | ANS (esante.gouv.fr) |
| Version | 3.2.0 |
| Version FHIR | **4.0.1 (R4)** |
| Juridiction | France (ISO 3166 : FR) |
| Langue par défaut | fr-FR |

## Dépendances (packages FHIR)

À provisionner dans tout serveur/validateur FHIR de Lafie :

| Package | Version | Rôle |
| --- | --- | --- |
| `hl7.fhir.fr.core` | 2.1.0 | Profils socle France (Patient, Encounter, Practitioner, Organization, Observations FR de base…) |
| `hl7.fhir.uv.phd` | 1.0.0 | Personal Health Device — profil `PhdDevice` pour objets connectés |
| `ans.fr.terminologies` | latest | Terminologies ANS (NOS / Serveur Multi-Terminologies) |

Utilise aussi l'**extension SNOMED CT France** via `expansion-params.json`.

> **Attention versions (vérifié sur registry.fhir.org, 2026-07-21).** L'IG épingle des versions plus **anciennes** que les dernières publiées :
> - `hl7.fhir.fr.core` : IG **2.1.0** — dernière publiée **2.2.0**
> - `hl7.fhir.uv.phd` : IG **1.0.0** — dernière publiée **2.0.0** (changement de **majeure** : PhdDevice diffère)
> - `ans.fhir.fr.mesures` (l'IG) : **3.2.0** = à jour
>
> **Utiliser les versions épinglées par l'IG** (2.1.0 / 1.0.0), pas les `latest`, pour rester conforme. Ne monter de version qu'après une release de l'IG les adoptant.

## Périmètre fonctionnel

L'IG modélise **l'alimentation de mesures de santé** vers l'entrepôt national **MES** (Mon Espace Santé). Trois familles :

1. **Signes vitaux** — poids, taille, IMC, température, tension artérielle, fréquence cardiaque, saturation O2, fréquence respiratoire, périmètre crânien, périmètre abdominal, douleur, pas/jour.
2. **Biologie** (suivi patient) — cholestérol (LDL, HDL, total, triglycérides, aspect), glycémie (glucose sanguin, interstitiel, IGG), HbA1c, regroupés dans un `DiagnosticReport`.
3. **Objets connectés** — dispositif de mesure décrit via `PhdDevice` (IHE PCD / Continua).

## Principes structurants (à respecter dans Lafie)

- **Tout est une `Observation` FHIR** profilée. Chaque type de mesure = un profil dérivé soit de `fr-core-observation-*`, soit du profil international `vitalsigns`.
- **Réutilisation par RuleSet** : un socle commun de contraintes (`ObservationResultsMesures`) est appliqué à tous les profils via `insert`. → En C#, factoriser dans une classe/`base` ou un builder commun.
- **Terminologies liées** (`binding`) avec force `required` / `extensible` selon les champs. → Valider côté domaine avant persistance.
- **Traçabilité de la source** : `Observation.meta.source` = OID de la solution émettrice ; `meta.profile` = URL canonique du profil (obligatoire pour la validation).
- **Dispositif référencé** : si la mesure vient d'un objet connecté, `Observation.device` → `Reference(PhdDevice)` obligatoire.
- **Échange par transaction Bundle** (voir [05](05-flux-alimentation-bundle.md)), aligné sur la transaction IHE **PCH-01** (Communicate FHIR PHD data), profil **IHE POU** (Personal Health Device Observation Upload).

## Ressources FHIR mises en jeu

| Ressource | Usage dans l'IG |
| --- | --- |
| `Observation` | Cœur : chaque mesure |
| `Device` (profil `PhdDevice`) | Dispositif de mesure |
| `DiagnosticReport` (profil `MesDiagnosticReport`) | Regroupement des résultats de biologie |
| `Bundle` (type `transaction`) | Enveloppe d'échange |
| `Patient`, `Encounter`, `Practitioner`, `Organization`, `CareTeam`, `RelatedPerson`, `PractitionerRole` | Référencés (via fr-core) |
| `OperationOutcome` | Retour d'erreurs de validation |

## Organisation du dépôt source (FSH)

```
input/fsh/
  aliases.fsh                    # alias d'URL canoniques
  RuleSet-observations.fsh       # socle commun ObservationResultsMesures
  MesFrObservation*.fsh          # profils signes vitaux
  MesObservation*.fsh            # profils signes vitaux (hors fr-core)
  MesBundleFluxAlimentation.fsh  # bundle signes vitaux
  Extensions/                    # 4 extensions Mesures
  BiologyProfile/                # profils + ruleset + bundle biologie
  ValueSets/                     # value sets locaux (ex. method glucose)
  Examples/                      # instances d'exemple
sushi-config.yaml                # config de l'IG (versions, deps, pages)
```

> En FSH, un profil = `Profile: X` / `Parent: <profil parent>` / une série de règles `* chemin contrainte`. Ces règles se traduisent directement en contraintes de validation et en modèle de domaine.
