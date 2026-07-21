# 07 — SaMD : logiciel dispositif médical

**SaMD** = *Software as a Medical Device* (logiciel dispositif médical). Question **transverse et réglementaire** : dès qu'une fonctionnalité de Lafie a une **finalité médicale** (diagnostic, aide à la décision, calcul influençant un traitement), elle peut être qualifiée dispositif médical → obligations lourdes (marquage CE en UE, autorisation FDA aux USA).

> À décider **tôt** : la qualification conditionne tout le processus de développement (qualité, risque, cycle de vie, traçabilité).

## Définition (IMDRF)

Logiciel destiné à une ou plusieurs **finalités médicales**, qui remplit ces finalités **sans faire partie du matériel** d'un dispositif médical. Un DME/HIS de simple **tenue de dossier et de workflow n'est en général PAS** un SaMD ; ce sont des **fonctionnalités précises** qui basculent en SaMD.

### Lafie est-il SaMD ?

- **Noyau EMR/HIS** (dossier, rencontres, saisie, facturation, workflow) : **non SaMD** a priori.
- **Bascule possible en SaMD** pour toute fonction qui **interprète des données pour orienter une décision clinique** : aide à la décision (CDS) active, calcul de dose/score de risque, alerte d'interaction médicamenteuse contraignante, triage, analyse d'image, algorithme IA/ML diagnostique.

→ **La qualification se fait par fonctionnalité/module**, pas sur le produit entier.

## Catégorisation du risque (IMDRF)

Croise **(A) l'importance de l'information** pour la décision de santé × **(B) la gravité de la situation clinique** :

| Situation \ Information | Éclairer la prise en charge | Piloter la prise en charge | Traiter/diagnostiquer |
| --- | --- | --- | --- |
| Non critique | I | II | III |
| Sérieuse | II | III | III |
| Critique | III | III | **IV** |

Catégorie IV = risque le plus élevé.

## Cadres par juridiction

| Zone | Cadre | Points clés |
| --- | --- | --- |
| **UE** | **MDR 2017/745** (MDSW) | Qualification + classification (**Règle 11** → souvent classe IIa/IIb/III), **marquage CE**, organisme notifié, guidance **MDCG 2019-11**. |
| **USA** | **FDA** (21 CFR) | Voies 510(k) / De Novo / PMA ; guidance **Clinical Decision Support** (Cures Act §3060 — certains CDS exemptés) ; **PCCP** (plan de changement) pour l'IA/ML. |
| **Togo / Afrique** | (à confirmer) | Pas de régime SaMD local fort ; s'aligne souvent CE/FDA + **guidance OMS**. Vérifier l'exigence de l'autorité togolaise. |
| **International** | **IMDRF** | Cadre de référence de qualification/risque repris par UE, USA, etc. |

## Normes qualité si SaMD

| Norme | Objet |
| --- | --- |
| **ISO 13485** | Système de management de la qualité des DM |
| **ISO 14971** | Gestion des risques (dossier de risque) |
| **IEC 62304** | Cycle de vie du logiciel DM — classes de sûreté **A / B / C** |
| **IEC 62366-1** | Ingénierie de l'aptitude à l'utilisation (usability) |
| **ISO/IEC 82304-1** | Produits logiciels de santé |
| **IEC 81001-5-1** | Sécurité (cybersécurité) du logiciel santé |
| **IA/ML** | **GMLP** (Good Machine Learning Practice), **AI Act UE** (IA médicale = à haut risque) |

## Impact sur l'architecture Lafie

Le **modular monolith** aide à **cantonner le périmètre SaMD** — principe clé : **isoler les fonctions à finalité médicale dans des modules dédiés** pour que le marquage/certification ne s'étende pas à tout le produit.

- **Isolation** : garder le noyau EMR **non-SaMD** ; placer CDS / calculs / IA dans des **bounded contexts séparés** (ex. futur module `ClinicalDecisionSupport`), clairement délimités.
- **Traçabilité IEC 62304** : exigences → conception → code → tests, reliés (matrice de traçabilité). Le découpage modulaire + tests d'architecture y contribuent.
- **Dossier de risque (ISO 14971)** par module SaMD ; classe de sûreté 62304 (A/B/C) déterminant la rigueur.
- **Gestion du changement / versionnage / dossier de conception** (Design History File).
- **Registre des fonctions candidates SaMD** : tenir une liste vivante des fonctionnalités susceptibles de basculer en DM, avec leur qualification.

## Décision par défaut (à valider)

- **Lafie cœur = NON-SaMD** (tenue de dossier, workflow, échange de données).
- **Tout ajout d'aide à la décision / calcul clinique / IA** déclenche une **évaluation de qualification** avant développement, et si SaMD : module isolé + processus qualité (13485/14971/62304).
- Ne pas embarquer de CDS contraignant dans le noyau sans cette évaluation.

## À vérifier

- Régime dispositif médical de l'autorité **togolaise** (reconnaissance CE/FDA ? exigences locales ?).
- Périmètre exact des exemptions **CDS** (UE MDCG, FDA Cures Act) applicables aux futures fonctions de Lafie.
- Statut **AI Act UE** si fonctions IA.

> Lié : [`05-protection-donnees.md`](05-protection-donnees.md) (sécurité/traçabilité), [`../architecture/modules.md`](../architecture/modules.md) (où loger un module SaMD).
