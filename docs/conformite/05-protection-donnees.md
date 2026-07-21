# 05 — Protection des données & hébergement

Les données de santé sont **sensibles** dans toutes les juridictions. Les principes se recoupent (base légale, sécurité, droits, traçabilité) mais l'**hébergement** et la **certification** diffèrent fortement.

## Matrice réglementaire

| Région | Loi / cadre | Autorité | Statut données santé | Hébergement |
| --- | --- | --- | --- | --- |
| **Togo** | Loi n°2019-014 (2019) | **IPDCP** | Données sensibles | **Local / souverain** (data center national visé) |
| **Europe** | **RGPD** + **EHDS** | CNIL & équivalents / EDPB | Catégorie particulière (art. 9) | **UE** ; **HDS certifié** si France |
| **USA** | **HIPAA** + Cures Act | OCR (HHS) | PHI | Cloud **HIPAA-eligible** + **BAA** |

## Principes communs (à implémenter une fois, réutiliser partout)

- **Base légale / consentement** du traitement, tracé et révocable.
- **Minimisation** des données + limitation de finalité.
- **Chiffrement** au repos et en transit.
- **Contrôle d'accès** granulaire (RBAC/ABAC) + principe du moindre privilège.
- **Audit trail** inaltérable de tout accès aux données de santé (aligné **IHE ATNA**) — sert RGPD, HIPAA **et** loi togolaise.
- **Droits des personnes** : accès, rectification, effacement (selon régime), portabilité.
- **Notification de violation** (délais variables — ex. 72 h RGPD).
- **Registre des traitements** + **DPIA/AIPD** pour les traitements à risque.
- **Rétention & purge** paramétrables par juridiction.

## Divergences structurantes pour l'architecture

| Sujet | Togo | UE | USA |
| --- | --- | --- | --- |
| Localisation données | Locale/souveraine | UE (adéquation hors UE) | US, cloud HIPAA |
| Certification hébergeur | (à confirmer) | HDS si France | BAA + HIPAA-eligible |
| Transfert transfrontalier | Encadré | Clauses types / adéquation | Encadré (contrats) |
| Notification violation | Selon loi 2019-014 | 72 h à l'autorité | Breach Notification Rule |

## Conséquences architecture Lafie

- **Multi-tenant régionalisé** : isoler le stockage **par juridiction** (instances/DB PostgreSQL par région) pour respecter la souveraineté (Togo local, UE en UE, US HIPAA). Pas de base unique multi-pays.
- **Couche protection des données transverse** (bounded context `DataProtection` / cross-cutting) :
  - service de **consentement** (modèle FHIR `Consent`),
  - **audit trail** centralisé (ATNA-like, event-sourced),
  - politique de **rétention/purge** paramétrable,
  - gestion des **demandes des personnes** (accès/effacement/portabilité).
- **Chiffrement & secrets** : au repos (DB, backups) + en transit (TLS), gestion des clés par région.
- **Paramétrage par pack** : chaque pack déclare ses règles (localisation, délais de notification, terminologies de consentement, exigences d'hébergement) ; le noyau les applique.
- ⚠️ **Choix d'hébergeur** : Supabase / cloud générique **ne convient pas** tel quel pour les données de santé (ni HDS FR, ni HIPAA, ni souveraineté Togo). Prévoir infra dédiée conforme par région.

> Voir [06-conformance-packs.md](06-conformance-packs.md) pour la traduction en modules DDD.
