# 02 — Pack Togo (cible principale)

Le Togo **n'a pas** d'Implementation Guide FHIR national contraignant (contrairement à la France). Le cadre réel combine : une **loi de protection des données**, un **HMIS national (DHIS2)**, et de bonnes pratiques régionales (**OpenHIE**, **OMS**). Beaucoup de latitude technique → viser des standards ouverts et l'interopérabilité DHIS2.

## Protection des données personnelles

| Élément | Détail |
| --- | --- |
| **Loi n°2019-014** du 29 octobre 2019 | Protection des données à caractère personnel : collecte, traitement, transmission, stockage, usage, protection. |
| **Autorité : IPDCP** | Instance de Protection des Données à Caractère Personnel (Lomé). En cours d'opérationnalisation. |
| Obligations types | Base légale du traitement, information/consentement, sécurité, notification, droits des personnes. Données de santé = sensibles. |

> Équivalent local du RGPD. Enregistrement/déclaration probable auprès de l'IPDCP à prévoir. Vérifier les décrets d'application et le régime spécifique aux données de santé.

## Souveraineté & hébergement

- Le Togo pousse la **localisation des données de santé** (construction d'un data center national).
- ⚠️ **Héberger les données santé au Togo / dans un cloud souverain acceptable**. Ne pas exporter vers cloud US/UE sans base légale.

## HMIS national — DHIS2

- Depuis **2021**, la production des données de santé passe par **DHIS2** (remplace registres/dossiers papier) — Système National d'Information Sanitaire (SNIS).
- ⚠️ **Interopérabilité DHIS2 = exigence de facto** pour le reporting national.
  - Reporting agrégé via **ADX** (Aggregate Data Exchange) ou l'API DHIS2.
  - Données individuelles : **DHIS2 supporte FHIR** (programme FHIR↔DHIS2, ex. « DHIS2 FHIR adapter ») → mapper les ressources FHIR de Lafie vers les data elements DHIS2.
- Lafie = système **individuel/EMR au point de soin** ; DHIS2 = **agrégation nationale**. Lafie **alimente** DHIS2, ne le remplace pas.

## Architecture de référence — OpenHIE

Cadre recommandé pour les pays à ressources limitées (largement déployé en Afrique). Composants à considérer comme cibles d'intégration :

| Composant OpenHIE | Rôle | Équivalent Lafie |
| --- | --- | --- |
| **Client Registry (CR)** | Index maître patients (MPI) | Module Identité (PIXm/PDQm) |
| **Facility Registry (FR)** | Référentiel établissements | `Organization` / `Location` |
| **Health Worker Registry (HWR)** | Référentiel professionnels | `Practitioner` / `PractitionerRole` |
| **Terminology Service (TS)** | Terminologies | Module Terminology |
| **Shared Health Record (SHR)** | Dossier partagé | Entrepôt FHIR Lafie |
| **HMIS** | Reporting agrégé | Connecteur DHIS2 |
| **Interoperability Layer** | Bus/routage (ex. OpenHIM) | FHIR Gateway |

## OMS

- **WHO SMART Guidelines** — guides cliniques calculables au format FHIR (L1→L4). Utile si Lafie implémente des protocoles de soins standardisés (ex. PCIME, VIH, palu, vaccination).
- **ICD-10 / ICD-11** pour codage diagnostics et reporting OMS.

## Identité patient au Togo

- Pas d'INS-équivalent aussi formalisé qu'en France. Possibilités : identifiant national (NIF / e-ID Togo), numéro d'assurance (**AMU** — Assurance Maladie Universelle), ou MPI interne.
- ⚠️ **À confirmer** : quel identifiant santé fait autorité. En attendant, MPI interne + `Identifier` avec `system` propre.

## À faire pour le pack Togo

1. Modéliser l'`Identifier` patient togolais (system/OID à définir) via l'abstraction d'identité.
2. **Connecteur DHIS2** (ADX + FHIR adapter) pour le reporting SNIS.
3. Conformité **loi 2019-014** : registre des traitements, consentement, sécurité, hébergement local.
4. S'aligner **OpenHIE** (interfaces CR/FR/HWR/SHR/TS) pour intégration future dans l'écosystème national.
5. (Optionnel) WHO SMART Guidelines pour protocoles de soins.

## À vérifier (sources incertaines)

- Décrets d'application de la loi 2019-014 + régime données de santé.
- Existence d'un identifiant santé national officiel + son OID.
- Version/instance DHIS2 nationale et modalités d'intégration.
- Stratégie e-santé nationale formelle (coordination signalée comme faible).

**Sources :**
- [Loi togolaise protection des données — Assemblée Nationale](https://assemblee-nationale.tg/lois_adoptees/loi-relative-a-la-protection-des-donnees-a-caractere-personnel/)
- [IPDCP](https://ipdcp.tg/)
- [Manuel SNIS Togo (DHIS2) — WHO AFRO](https://files.aho.afro.who.int/afahobckpcontainer/production/files/MOP_SNIS_TOGO_2%C3%A8me_Edition_VF.pdf)
