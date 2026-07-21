# Cadre de conformité multi-juridiction — Lafie

Lafie vise **plusieurs juridictions** : **Togo** (cible principale), **Europe** (UE), **USA** (si possible). Il n'existe donc **pas** une conformité unique. Ce dossier définit :

1. le **socle international commun** (agnostique pays) ;
2. les exigences **par juridiction** ;
3. le **design des « conformance packs »** enfichables dans l'architecture DDD.

> ⚠️ L'IG ANS France (« Mesures de santé », dossier [`docs/fhir/`](../fhir/README.md)) n'est **pas** la cible de conformité : c'est **un pack parmi d'autres** (France) et surtout un **modèle de bonnes pratiques** de structuration FHIR. Ne pas le confondre avec une obligation pour Togo/UE/USA.

## Principe directeur

```
        ┌─────────────────────────────────────────┐
        │   NOYAU CLINIQUE — agnostique pays        │
        │   FHIR R4 + IPS + SMART on FHIR + IHE      │
        └─────────────────────────────────────────┘
              ▲            ▲            ▲
     ┌────────┴───┐  ┌─────┴────┐  ┌───┴────────┐
     │ Pack Togo  │  │ Pack UE  │  │ Pack USA   │   (+ Pack France ANS)
     │ OpenHIE    │  │ IPS/EHDS │  │ US Core    │
     │ DHIS2      │  │ GDPR/MDR │  │ HIPAA/ONC  │
     └────────────┘  └──────────┘  └────────────┘
```

Le **noyau** ne connaît aucune règle nationale. Chaque **pack** apporte : profils/terminologies spécifiques, règles d'identité patient, auth, hébergement, reporting, contraintes de protection des données.

## Sommaire

| Doc | Contenu |
| --- | --- |
| [01-socle-international.md](01-socle-international.md) | Standards communs à toutes les cibles |
| [02-togo.md](02-togo.md) | Loi 2019-014, IPDCP, DHIS2, OpenHIE |
| [03-europe.md](03-europe.md) | GDPR, EHDS, IPS/MyHealth@EU, MDR |
| [04-usa.md](04-usa.md) | US Core, USCDI, HIPAA, ONC/Cures Act |
| [05-protection-donnees.md](05-protection-donnees.md) | Matrice protection données + hébergement/souveraineté |
| [06-conformance-packs.md](06-conformance-packs.md) | Design technique des packs enfichables (DDD/CQRS) |
| [07-samd.md](07-samd.md) | **SaMD** — qualification logiciel dispositif médical (IMDRF/MDR/FDA, ISO 13485/14971/IEC 62304) |

## Priorités (cible Togo d'abord)

1. **Noyau FHIR R4 + IPS** — fondation neutre.
2. **Pack Togo** : OpenHIE-compatible + connecteur **DHIS2** + conformité **loi 2019-014**.
3. **Pack UE** : IPS/EHDS + GDPR (largement couvert par le noyau + protection données).
4. **Pack USA** : US Core + HIPAA (le plus lourd — à planifier séparément).

## Décisions transverses à trancher tôt

- **Qualification SaMD / Dispositif Médical** — si aide à la décision clinique : MDR 2017/745 (UE) + FDA (USA). Impacte tout le cycle de dev (ISO 13485, ISO 14971, IEC 62304). Détail : [07-samd.md](07-samd.md).
- **Stratégie d'hébergement multi-région** — souveraineté Togo / UE / HIPAA US (voir [05](05-protection-donnees.md)).
- **Modèle d'identité patient abstrait** — pas d'INS en dur (voir [06](06-conformance-packs.md)).
