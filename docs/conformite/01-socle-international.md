# 01 — Socle international commun

Standards **agnostiques pays**, au centre de l'architecture. Ils fonctionnent au Togo, en UE et aux USA. Tout le reste (packs nationaux) vient se greffer dessus.

## Interopérabilité — données cliniques

| Standard | Rôle | Notes |
| --- | --- | --- |
| **HL7 FHIR R4 (4.0.1)** | Modèle de ressources + API REST | Base de tout. Version R4 = la plus déployée. |
| **FHIR International Base** | Profils de base internationaux | Point de départ neutre avant profils nationaux. |
| **IPS — International Patient Summary** | Résumé patient portable (HL7/CEN EN 17269 / ISO 27269) | Adopté UE, base OMS. **Pivot d'échange multi-pays.** |
| **HL7 v2.x** | ADT (admission), ORM/ORU (labo/résultats) | Omniprésent en hôpital, surtout USA. À supporter en entrée/sortie. |
| **DICOM** | Imagerie médicale | Universel. |
| **CDA** | Documents cliniques (XML) | Encore requis dans certains échanges (CI-SIS FR, US C-CDA). |

## Identité & échange (profils IHE)

| Profil IHE | Rôle |
| --- | --- |
| **MHD** (Mobile access to Health Documents) | Partage de documents via FHIR (remplace/complète XDS.b) |
| **XDS.b** | Partage de documents (registres/dépôts) |
| **PIXm / PDQm** | Résolution & recherche d'identité patient (FHIR) — **clé pour l'abstraction d'identité multi-pays** |
| **ATNA** | Audit trail & sécurité des nœuds |
| **PDQ / PIX** (v2) | Équivalents HL7 v2 |

## Authentification & autorisation

| Standard | Rôle |
| --- | --- |
| **OAuth 2.0 / OpenID Connect** | Socle d'auth commun (USA, UE, Togo) |
| **SMART on FHIR** | Lancement d'apps + scopes FHIR — **exigé aux USA (ONC)**, utile partout |
| **UDAP** | (USA, avancé) confiance dynamique inter-organisations |

> Les mécanismes **nationaux** d'auth pro (Pro Santé Connect FR, e-CPS…) sont des **adaptateurs** au-dessus d'OIDC, définis dans les packs.

## Terminologies (service central)

| Terminologie | Domaine | Licence |
| --- | --- | --- |
| **LOINC** | Observations, biologie, documents | Libre (inscription) |
| **SNOMED CT International** | Concepts cliniques | **Licence pays requise** (via IHTSDO/membre national) |
| **UCUM** | Unités de mesure | Libre |
| **ICD-10 / ICD-11** | Diagnostics, mortalité/morbidité (OMS) | Libre |
| **ATC / DDD** | Médicaments (OMS) | Libre |
| **CVX, RxNorm** | (USA) vaccins, médicaments | Libre |

> ⚠️ **SNOMED CT** : le Togo n'est peut-être pas membre → vérifier le droit d'usage. Fallback possible : ICD + LOINC + terminologies OMS. Le service de terminologie doit gérer **plusieurs systèmes de codes en parallèle** et des équivalences.

## Ce que le noyau Lafie doit fournir

- Modèle de domaine mappable **FHIR R4** (sérialisation via Firely SDK `Hl7.Fhir.R4`).
- Génération/consommation d'un **IPS** (patient summary) comme format d'échange pivot.
- Endpoints **FHIR REST** + capacité **SMART on FHIR**.
- **Service de terminologie** multi-code (LOINC, SNOMED, ICD, ATC…) avec validation de binding.
- Connecteurs **HL7 v2** (ADT/ORU) et **DICOM** (au moins référencement d'études via `ImagingStudy`).
- Journalisation **ATNA-like** (audit trail) — utile pour toutes les juridictions (traçabilité RGPD/HIPAA).
- Résolution d'identité patient via **PIXm/PDQm** (abstraction — voir [06](06-conformance-packs.md)).

> Règle : **rien de spécifique à un pays dans le noyau.** Une donnée nationale (INS, MRN, NIF togolais) est traitée comme un `Identifier` FHIR générique + `system` (OID/URI) propre au pack.
