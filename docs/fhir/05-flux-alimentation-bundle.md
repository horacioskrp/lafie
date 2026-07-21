# 05 — Flux d'alimentation (transaction Bundle)

Le flux d'écriture d'une mesure reprend la transaction IHE **PCH-01** (*Communicate FHIR PHD data*) du profil **IHE POU** (*Personal Health Device Observation Upload*). Il s'appuie sur l'interaction FHIR **`transaction`** : une requête **HTTP POST** dont le corps est un `Bundle` de type `transaction`.

## Bundle signes vitaux — `MesBundleFluxAlimentation`

```
Profile: MesBundleFluxAlimentation
Parent:  Bundle
* type = #transaction
* entry contains mes-observation 1..1 and mes-device 0..1
* entry[mes-observation].resource only <un des 11 profils Observation MES>
* entry[mes-observation].request.method = #POST
* entry[mes-observation].request.url = "Observation"
* entry[mes-device].resource only PhdDevice
* entry[mes-device].request.method = #POST
* entry[mes-device].request.url = "Device"
```

Empaquette **jusqu'à 2 ressources** :
1. Une `Observation` (profil MES) — **obligatoire**.
2. Un `Device` (`PhdDevice`) — **optionnel**, référencé par `Observation.device`.

## Bundle biologie — `MesBundleFluxAlimentationBiologie`

Empaquette les observations de biologie **+ un `DiagnosticReport`** (1..1) :

- entrées `Observation` optionnelles (LDL, HDL, trigly, total, aspect, glycémie), chacune en `POST Observation` ;
- `mes-diagnostic-report` **1..1** en `POST DiagnosticReport`.

Invariants (severity error) :
- `mesures-inv-1` : si **HDL** présent (code `2085-9`) alors **cholestérol total** (`2093-3`) doit être présent.
- `mesures-inv-2` : réciproque (total présent ⇒ HDL présent).

## Anatomie d'un `entry`

Chaque `entry` = `{ fullUrl?, resource, request }`.

```jsonc
{
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    {
      "fullUrl": "11234563-069d-112d-829b-...",        // requis pour l'Observation
      "resource": {
        "resourceType": "Observation",
        "meta": {
          "source": "<OID solution éditeur>",           // système émetteur
          "profile": ["https://interop.esante.gouv.fr/ig/fhir/mesures/StructureDefinition/mesures-fr-observation-bp"]
        },
        "device": { "reference": "Device/3bc44de3-..." } // préfixe Device/ + uuid seul
      },
      "request": { "method": "POST", "url": "Observation" }
    },
    {
      "resource": {
        "resourceType": "Device",
        "meta": { "profile": ["http://hl7.org/fhir/uv/phd/StructureDefinition/PhdDevice"] },
        "id": "3bc44de3-..."
      },
      "request": {
        "method": "POST",
        "url": "Device",
        "ifNoneExist": "identifier=urn:oid:<OID PHD>|<Identifier PHD>"  // conditional create
      }
    }
  ]
}
```

### Règles obligatoires

- `Bundle.type = "transaction"`.
- Chaque `entry.request` : `method = POST` + `url = <resourceType>`.
- `fullUrl` **obligatoire** sur l'Observation (exigence de validation FHIR).
- `meta.profile` obligatoire sur Observation **et** Device (permet la validation de conformité).
- `Observation.device.reference` : préfixe `Device/` + **uuid seul**.

### `ifNoneExist` (conditional create du Device)

Format : `identifier=urn:oid:<OID>|<Identifier>` — regex : `identifier=urn:oid:([0-9]+[\.[0-9]+]+)\|([a-zA-Z0-9]+[-[a-zA-Z0-9]+]+)`.

- Device déjà présent (couple oid/identifier) → non recréé, **`200 Success`**.
- Sinon → créé, **`201 Created`**, identité unique = oid + identifier.

### `meta.source`

Code du système source (issuer). **Facultatif** :
- fourni → validé ;
- absent → renseigné par MES à partir de l'OID du référentiel.

## Réponse

Succès : **HTTP 200 OK**, corps = `Bundle` type `transaction-response`, une entrée `response` par ressource :

```jsonc
{
  "resourceType": "Bundle",
  "type": "transaction-response",
  "entry": [
    { "response": { "status": "201 Created", "location": "Observation/urn:oid:<OID-MES>|<uuid>" } },
    { "response": { "status": "201 Created", "location": "Device/urn:oid:<OID-DEVICE>|<id>" } }
  ]
}
```

### Codes d'erreur HTTP (niveau transport / auth)

| Statut | Cas |
| --- | --- |
| 400 | Bad Request (ex. ID_TOKEN / JWT invalide) |
| 401 | access_token invalide |
| 403 | idPe de la requête ≠ idPe de l'id_token ; ou consentement non donné |
| 409 | Conflit d'OID (id_token vs écosystème) |
| 422 | Unprocessable Entity (aucun bundle, ou échecs de validation) |

### Erreurs de validation (422 + `OperationOutcome`)

Pour toute ressource invalide : **422** + une ou plusieurs `OperationOutcome` (niveau `error`/`fatal`). Catégories :

**Structure du bundle** — type de ressource non supporté (seuls Observation/Device en POST), device conditional-create manquant, `ifNoneExist` invalide, observation manquante.

**Lien Observation ↔ Device** — `Observation.device.reference` obligatoire ; cohérence `Observation.device.reference` ↔ `Device.id`.

**Observation** — `meta.profile` manquant ; OID de `meta.source` hors éditeur racine ; valeur (`valueQuantity`) absente (observations sans valeur refusées) ; **IMC non créable** ; `subject.identifier` (oid/IDPE) obligatoire ; `extension.moment` obligatoire/interdit selon le cas ; `extension.numberOfDays` obligatoire/interdit selon le cas.

**Device** — `meta.profile` manquant.

Structure `OperationOutcome` : `issue[].severity` (ValueSet issue-severity), `issue[].code` (ValueSet issue-type), `issue[].diagnostics`. Seuls **fatal** et **error** provoquent un code HTTP d'erreur.

## Implémentation Lafie

- **Frontière d'échange** : un adaptateur (infrastructure) qui construit/parse les `Bundle` transaction et transaction-response.
- **Client FHIR** authentifié (OAuth : id_token/access_token, idPe, gestion du consentement) vers l'entrepôt MES.
- **CQRS** : une commande `SubmitMeasurementBundle` → validation domaine → construction Bundle → POST → interprétation de la réponse → événement `MeasurementSubmitted` / `MeasurementRejected`.
- **Idempotence Device** via `ifNoneExist` : gérer côté domaine l'identité (OID + identifier) du dispositif.
- **Validation en amont** (avant envoi réseau) pour éviter les 422 : rejouer localement les invariants (moment/numberOfDays, HDL⇔total, valeur présente, IMC non soumis, profils/URL canoniques renseignés).
- Mapper les `OperationOutcome` reçus vers des erreurs de domaine exploitables.
