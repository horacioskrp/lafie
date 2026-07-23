# Frontend & Design System — Lafie Navigator

Frontend web de Lafie : **SPA React + TypeScript + Vite** (`clients/lafie-navigator`), hors solution .NET.
Client **fin** : consomme l'API .NET par HTTP via **`/api`** (proxy nginx en conteneur, proxy Vite en dev → pas de CORS).

- Code : [`clients/lafie-navigator`](../../clients/lafie-navigator)
- Thème : [`clients/lafie-navigator/src/theme.ts`](../../clients/lafie-navigator/src/theme.ts)
- Décision de bascule vers React : [`../architecture/decisions.md`](../architecture/decisions.md) ADR-012

## 1. Stack

| Besoin | Choix | Statut |
| --- | --- | --- |
| Base | **React 19 + TypeScript + Vite** | ✅ |
| UI | **Fluent UI v9** (`@fluentui/react-components`) | ✅ |
| Données serveur | **TanStack Query** | ✅ |
| Routage | **TanStack Router** | ➕ câblé au 1er écran multi-routes |
| Tables/grilles | **TanStack Table** | ➕ câblé au 1er tableau |
| Formulaires | **React Hook Form** + `@hookform/resolvers` (zodResolver) | ✅ (dép.) |
| Validation | **Zod** | ✅ (dép.) |
| i18n | **i18next** + **react-i18next** + language-detector | ✅ (FR défaut, EN) |
| Dates / fuseaux | **Luxon** | ✅ |
| Tests unitaires/composant | **Vitest** + **Testing Library** (sous `src/`) | ✅ |
| Tests e2e | **Playwright** (sous `e2e/`) | ✅ (config) |
| PWA | **vite-plugin-pwa** (installable + cache assets) | ✅ |
| Charts | **`@fluentui/react-charting`** (défaut) + **Recharts** (secours) | ⏸️ différé (à `npm install` au 1er graphe) |
| Lint | **oxlint** | ✅ |

**Non retenu au départ :** Zustand (TanStack Query + état d'URL suffisent), offline-data (cf. §PWA), client OpenAPI généré (recommandé — voir §À venir).

### Génération depuis OpenAPI (recommandé, à venir)

Le backend expose OpenAPI (`/openapi/v1.json` + UI Scalar `/scalar`). Générer le client typé (**orval** ou **openapi-typescript**) → hooks **TanStack Query** + schémas **Zod** synchronisés au contrat backend, zéro DTO à la main.

## 2. Design system — couleurs

Palette accessible, ton santé/océan.

| Rôle | Couleur | Usage |
| --- | --- | --- |
| **Primaire** (action / focus) | `#00728B` | Bleu-océan équilibré. Boutons, focus, liens, sélection. Rampe de marque Fluent. |
| **Secondaire** (accents / badges) | `#009664` | Vert. États **positifs**, validations, **indicateurs de santé**, pastilles/badges. |
| **Dégradé** | `#00728B` → `#009664` | **Avec parcimonie** : bannière de profil, splashscreen, header de carte d'abonnement / pass santé. |
| **Fond / neutres** | `#F4F8FA` | Fond très clair **légèrement bleuté** (réduit la fatigue visuelle vs blanc pur). |

### Mise en œuvre (`src/theme.ts`)

- `lafieBrand: BrandVariants` — rampe 10→160 **ancrée sur `#00728B`** (`brand[80]` = couleur d'action). `createLightTheme(lafieBrand)` → `lafieLightTheme` (+ `lafieDarkTheme` prêt pour plus tard).
- `lafieColors` — hors rampe Fluent :
  - `secondary: '#009664'`
  - `background: '#F4F8FA'`
  - `gradient: 'linear-gradient(135deg, #00728B 0%, #009664 100%)'`
- Fond de page `#F4F8FA` posé dans [`src/index.css`](../../clients/lafie-navigator/src/index.css) (remplace le CSS du scaffold Vite + son dark-scheme).
- `FluentProvider theme={lafieLightTheme}` dans [`src/main.tsx`](../../clients/lafie-navigator/src/main.tsx).

> La rampe de marque est **approximée à la main** ; affinable via le [Fluent UI Theme Designer](https://react.fluentui.dev/) en repartant de `#00728B`.

### Règles d'usage

- **Primaire** : une seule couleur d'action dominante (Fluent l'applique via les tokens `colorBrand*`). Ne pas multiplier les couleurs d'action.
- **Secondaire** : réservée au **positif/santé** (statut « ok », validations). Éviter de l'utiliser comme 2ᵉ couleur d'action.
- **Dégradé** : **parcimonie** — surfaces d'en-tête / mise en avant, jamais en fond général ni sur du texte long.
- **Fond** : `#F4F8FA` pour le canevas ; les cartes/surfaces restent en `colorNeutralBackground1` (blanc) pour le contraste.
- **Accessibilité** : viser contraste WCAG AA ; Fluent v9 gère l'a11y des composants. Vérifier le texte sur dégradé (utiliser `colorNeutralForegroundOnBrand`).

## 3. Structure

```
clients/lafie-navigator/
├── src/
│   ├── main.tsx        FluentProvider(theme) + QueryClientProvider + i18n
│   ├── App.tsx         page d'accueil (bannière dégradé, statuts backend)
│   ├── theme.ts        rampe de marque + lafieColors
│   ├── i18n.ts         init i18next (FR/EN)
│   ├── index.css       fond #F4F8FA, reset minimal
│   ├── App.test.tsx    tests Vitest/RTL
│   └── test/setup.ts   jest-dom + stubs jsdom (matchMedia/ResizeObserver)
├── e2e/                tests Playwright
├── vite.config.ts      plugins React + PWA, proxy /api, config Vitest
├── Dockerfile          build Node → nginx
└── nginx.conf          SPA fallback + proxy /api → backend
```

## 4. Commandes

```bash
npm run dev        # dev server http://localhost:3000 (proxy /api -> :8081)
npm run build      # tsc -b && vite build (+ service worker PWA)
npm run test       # Vitest (unit/composant)
npm run test:e2e   # Playwright (app sur :3000 requise + npx playwright install)
npm run lint       # oxlint
```

## 5. Conteneur & réseau

- `docker compose up --build web` (racine du repo) → **http://localhost:3000** (nginx).
- `nginx.conf` : sert le SPA (fallback `index.html`) + **proxy `/api/` → `api:8080`** (strip du préfixe → pas de CORS).
- Image découplée du backend ; l'image API n'inclut pas les clients (`clients/` dans son `.dockerignore`).

## 6. Tests

- **Vitest + Testing Library** : composants/logique, sous `src/**/*.{test,spec}.{ts,tsx}` (e2e exclu).
- **Playwright** : parcours de bout en bout, sous `e2e/` (nécessite l'app servie + navigateurs `npx playwright install`).

## 7. PWA

- **Installable** + **cache des assets** (shell offline) via `vite-plugin-pwa` (`registerType: autoUpdate`).
- ⚠️ **Offline des DONNÉES cliniques** (cache API + synchro + conflits) = **chantier séparé** (IndexedDB), non fourni par le plugin.
- ⚠️ Gotcha : après un rebuild, **recharger** la page pour que le service worker serve les assets à jour (sinon rendu stale).

## 8. À venir

- Client **OpenAPI généré** (orval/openapi-typescript) → hooks Query + Zod.
- **TanStack Router** (navigation) + **Table** (grilles EMR) au 1er besoin réel.
- **Charts** : `npm install @fluentui/react-charting recharts` au 1er graphe (pont de thème v8/v9 pour Fluent charting).
- **Mobile** : React Native (partage de code TS) ou PWA — ultérieur.
