# 04 — Pack USA

Cible « si possible ». Cadre le **plus lourd** (HIPAA + certification ONC). À planifier comme un chantier distinct.

## Profils & données

| Standard | Rôle |
| --- | --- |
| **US Core (`hl7.fhir.us.core`)** | Socle FHIR US — équivalent de fr-core. Base obligatoire de tout échange US. |
| **USCDI** (US Core Data for Interoperability) | Ensemble minimal de classes/éléments de données à supporter. Versionné (v3, v4…). |
| **C-CDA** | Documents cliniques (encore requis dans de nombreux échanges). |
| **HL7 v2** | ADT, résultats labo (ORU) — omniprésent en hôpital US. |
| **X12** | Transactions administratives/facturation (claims 837, éligibilité 270/271…). |
| **NCPDP** | Prescription électronique (pharmacie). |

## Réglementation

| Élément | Détail |
| --- | --- |
| **HIPAA** | Privacy Rule (usage/divulgation PHI) + Security Rule (garanties admin/physiques/techniques) + Breach Notification. **BAA** (Business Associate Agreement) obligatoire avec sous-traitants/hébergeurs. |
| **21st Century Cures Act** | **Information blocking** interdit : ne pas entraver l'accès/échange des données. |
| **ONC Certification (HTI-1)** | Critères de certification des EHR : **FHIR + US Core + SMART on FHIR + Bulk Data** requis pour l'API standardisée. |
| **CMS Interoperability** | **Patient Access API** (FHIR) pour payeurs, Provider Directory, etc. |

## Authentification

- **SMART on FHIR** (déjà au socle) — **exigé** par la certification ONC (scopes, EHR launch / standalone launch).
- **Bulk Data (Flat FHIR)** — export population (`$export`) requis par ONC.
- **UDAP** — confiance dynamique B2B (avancé).

## Terminologies US spécifiques

| Terminologie | Domaine |
| --- | --- |
| **RxNorm** | Médicaments |
| **CVX** | Vaccins |
| **CPT / HCPCS** | Actes (facturation) — **licence AMA pour CPT** |
| **LOINC, SNOMED CT US Edition, ICD-10-CM** | Observations, concepts, diagnostics |

## Hébergement

- Cloud **HIPAA-eligible** avec **BAA** signé (AWS/Azure/GCP proposent des offres conformes).
- Chiffrement au repos + en transit, audit, contrôle d'accès (garanties Security Rule).

## À faire pour le pack USA

1. Profils **US Core** + couverture **USCDI** (version cible).
2. API **FHIR + SMART on FHIR + Bulk Data** conforme **ONC**.
3. **Conformité HIPAA** (Privacy + Security + Breach), BAA hébergeur.
4. Terminologies US (RxNorm, CVX, ICD-10-CM, CPT sous licence).
5. Respect **information blocking** (Cures Act).
6. (Selon produit) X12/NCPDP pour facturation/prescription.

> ⚠️ Le pack USA est un engagement conséquent (certification, HIPAA). Ne l'ouvrir qu'après stabilisation du noyau + pack Togo.
