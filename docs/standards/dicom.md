# DICOM — imagerie médicale

**DICOM** = *Digital Imaging and Communications in Medicine*. Norme internationale pour les **images médicales** (leurs métadonnées, le réseau et le workflow). Standard **agnostique pays** → il vit dans le **socle**, pas dans un pack de conformité (seuls les profils de dé-identification varient par juridiction).

Périmètre Lafie : module **Radiology / Imaging** (workflow, commandes) + module **Interop** (connectivité DICOM / DICOMweb / PACS). Phase 2.

## Modèle d'information

Hiérarchie : **Patient → Study → Series → Instance** (image/objet). Chaque objet = un **SOP Instance** d'une **SOP Class** (IOD — Information Object Definition), décrit par des **tags DICOM** (ex. `(0010,0010)` PatientName, `(0020,000D)` StudyInstanceUID).

Identifiants pivots : `StudyInstanceUID`, `SeriesInstanceUID`, `SOPInstanceUID` (UIDs globaux).

## Services réseau

### DIMSE (classique, TCP)

| Service | Rôle |
| --- | --- |
| **C-STORE** | Envoyer/recevoir des objets (images) |
| **C-FIND** | Requêter (Patient/Study/Series) |
| **C-MOVE / C-GET** | Récupérer des objets |
| **Modality Worklist (MWL)** | Fournir la liste de travail aux modalités (issue des commandes) |
| **MPPS** | *Modality Performed Procedure Step* — état d'avancement de l'examen |
| **Storage Commitment** | Confirmer l'archivage durable |

### DICOMweb (RESTful — **préféré** pour web/mobile)

| Service | Rôle |
| --- | --- |
| **STOW-RS** | Store (envoi d'objets) via HTTP |
| **QIDO-RS** | Query (recherche d'études/séries/instances) |
| **WADO-RS / WADO-URI** | Retrieve (récupération d'objets, métadonnées, rendus) |

> Pour un client **web (React)**, privilégier **DICOMweb** (HTTP/JSON) plutôt que le DIMSE classique.

## Place dans l'architecture Lafie

| Élément | Où | Rôle |
| --- | --- | --- |
| Workflow d'imagerie | **Radiology** (Domain/Application) | Commande d'examen, état, compte rendu |
| SCP/SCU DIMSE + DICOMweb | **Interop.Infrastructure** | C-STORE SCP (réception images), MWL SCP (worklist), MPPS, client DICOMweb |
| Orchestration de la demande | **Orders (CPOE)** | émet la `ServiceRequest` d'imagerie consommée par Radiology |
| Stockage pixels | **PACS / VNA / object storage** | **PAS** dans la base métier — n'y garder que les **références** (UIDs, endpoint WADO) |

**Flux type** : `Orders` crée une demande → `Radiology` publie une entrée **Modality Worklist** → la modalité réalise l'examen, renvoie **MPPS** + images via **C-STORE / STOW-RS** → `Interop` reçoit, indexe (UIDs, métadonnées) → `Radiology` rattache le compte rendu.

## Pont DICOM ↔ FHIR

| FHIR | Correspondance DICOM |
| --- | --- |
| `ImagingStudy` | référence une Study DICOM (UIDs) + `Endpoint` WADO-RS pour la récupération |
| `Endpoint` | URL du service DICOMweb (WADO-RS) |
| `ServiceRequest` | demande d'imagerie (Orders) |
| `DiagnosticReport` (+ `Observation`) | compte rendu de radiologie |
| `Patient` / `ImagingStudy.subject` | patient DICOM (rapproché via MPI, pas l'ID DICOM brut) |

Ne pas exposer les identifiants DICOM comme identité patient : rapprocher via le **MPI** (module Patient).

## Implémentation .NET

- **fo-dicom (Fellow Oak DICOM)** — bibliothèque .NET de référence : parsing, réseau **SCU/SCP** (C-STORE/C-FIND/MWL/MPPS), **client DICOMweb** (STOW/QIDO/WADO), codecs de transfert (JPEG, JPEG2000), rendu d'images.
- **Visualisation** : consommer DICOMweb depuis un **viewer web** (type OHIF, intégrable dans le front React) ou rendre des frames côté serveur. Éviter d'embarquer le pixel data brut dans l'UI directement.

## Sécurité & conformité

- **DICOM TLS** pour les échanges réseau ; contrôle d'accès applicatif.
- **Dé-identification** (DICOM **PS3.15**, *Confidentiality Profiles*) obligatoire pour usage secondaire / partage — **profils variables par juridiction** (RGPD / HIPAA / loi togolaise) → paramétrer via le pack de conformité (`IConsentPolicy` / `IDataResidencyPolicy`).
- **Audit** des accès aux images → journal **ATNA** (module DataProtection / `Lafie.Infrastructure`).
- **SaMD** : un simple stockage/affichage d'images n'est pas SaMD ; une **analyse d'image assistée / IA** l'est (voir [`../conformite/07-samd.md`](../conformite/07-samd.md)).

## À faire (Phase 2 — module Radiology + Interop)

1. Intégrer **fo-dicom** dans `Interop.Infrastructure`.
2. Exposer **DICOMweb** (STOW/QIDO/WADO) + **C-STORE SCP** + **Modality Worklist SCP**.
3. Mapper Study DICOM ↔ `ImagingStudy` FHIR ; rapprochement patient via MPI.
4. Déléguer le stockage pixels à un **PACS/VNA/object storage** ; n'indexer que les références.
5. Dé-identification PS3.15 pilotée par le pack de conformité.
6. Viewer DICOMweb pour Web/Mobile.
