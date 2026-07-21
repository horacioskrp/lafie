# 03 — Pack Europe (UE)

Cible « si possible ». En UE, viser les **standards européens transversaux** (IPS/EHDS) plutôt qu'un IG national, sauf déploiement dans un pays précis (France → pack ANS séparé, Allemagne → gematik, etc.).

## Protection des données

| Élément | Détail |
| --- | --- |
| **RGPD (GDPR)** | Règlement (UE) 2016/679. Données de santé = **catégorie particulière** (art. 9) → interdiction de principe sauf exceptions (soins, consentement explicite…). |
| Obligations | Base légale, minimisation, DPO si requis, registre des traitements, DPIA (analyse d'impact), droits des personnes, notification de violation (72 h). |
| **Localisation** | Transferts hors UE encadrés (décision d'adéquation / clauses types). Héberger en UE par défaut. |

## European Health Data Space (EHDS)

- Règlement européen créant un espace de données de santé. Deux usages :
  - **Usage primaire** : accès et **portabilité** des données par le patient et les soignants (dossier électronique interopérable).
  - **Usage secondaire** : réutilisation encadrée (recherche, pilotage) via organismes d'accès aux données.
- Impose des **formats européens d'échange** (s'appuie sur l'**EEHRxF** — European EHR exchange Format) et des exigences pour les systèmes DME/EHR mis sur le marché UE.
- ⚠️ EHDS impose à terme des exigences de **conformité et d'auto-certification** aux fabricants de systèmes de DME. À suivre : calendrier d'application progressif.

## Interopérabilité UE

| Standard | Rôle |
| --- | --- |
| **IPS — International Patient Summary** | Résumé patient (déjà au socle). Format pivot UE. |
| **eHDSI / MyHealth@EU** | Services transfrontaliers : Patient Summary + ePrescription/eDispensation entre États membres. |
| **HL7 Europe IGs** | Patient Summary EU, Laboratory Report, etc. |
| **EEHRxF** | Format d'échange EHR cible de l'EHDS (patient summary, prescription, imagerie, labo, comptes rendus). |

## Dispositif médical (DM logiciel)

- **Règlement MDR (UE) 2017/745** : un logiciel à finalité médicale (diagnostic, aide à la décision, traitement) est un **dispositif médical** → **marquage CE**, classe de risque, organisme notifié selon la classe.
- Implique : **ISO 13485** (système qualité), **ISO 14971** (gestion des risques), **IEC 62304** (cycle de vie logiciel DM), documentation technique, surveillance après commercialisation.
- ⚠️ Un simple EMR de saisie n'est généralement pas DM ; **l'aide à la décision clinique** ou le **calcul influençant une décision** peut basculer Lafie en DM. **Décision à prendre tôt** — elle contraint tout le process de dev.

## À faire pour le pack UE

1. Génération/consommation **IPS** conforme (déjà au socle) + alignement **EEHRxF** quand stabilisé.
2. **Conformité RGPD** by design (voir [05](05-protection-donnees.md)) : DPIA, registre, consentement, droits.
3. Hébergement **UE**.
4. Veille **EHDS** (exigences DME + calendrier) et **MDR** (qualification DM).
5. Si déploiement pays précis : ajouter le pack national (France ANS = `docs/fhir/`, etc.).
