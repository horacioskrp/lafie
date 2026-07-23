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

## 3. Structure — feature-based (vertical slices)

Rangement **par domaine** (miroir des modules backend), pas par type. Inspiré de *bulletproof-react*.

```
clients/lafie-navigator/
├── e2e/                              Playwright
├── src/
│   ├── main.tsx                      point d'entrée → <AppProviders>
│   ├── app/                          COMPOSITION ROOT (bootstrap)
│   │   ├── providers/
│   │   │   ├── AppProviders.tsx      Fluent(thème) + Query + i18n + Router
│   │   │   └── queryClient.ts
│   │   ├── router/router.tsx         TanStack Router (code-based)
│   │   └── layout/AppShell.tsx       coquille (nav/header à venir) + <Outlet/>
│   ├── features/                     TRANCHES PAR DOMAINE (miroir backend)
│   │   └── dashboard/
│   │       ├── pages/                DashboardPage(.tsx/.test.tsx)
│   │       ├── api/ components/ model/ hooks/ locales/   (au besoin)
│   │       └── index.ts              API publique (barrel mince)
│   ├── shared/                       CROSS-CUTTING réutilisable
│   │   ├── ui/                       design system (GradientBanner, StatusDot, …)
│   │   ├── api/http.ts               wrapper HTTP (+ generated/ OpenAPI à venir)
│   │   ├── theme/theme.ts            rampe de marque + lafieColors
│   │   ├── i18n/index.ts             init i18next (FR/EN)
│   │   ├── lib/ config/ hooks/ types/  (au besoin)
│   ├── styles/index.css              fond #F4F8FA, reset
│   └── test/setup.ts                 Vitest (jest-dom + stubs jsdom)
├── vite.config.ts · Dockerfile · nginx.conf · tsconfig.*
```

### Règles d'import

| Couche | Peut importer | Interdit |
| --- | --- | --- |
| `app/` | `features`, `shared` | — |
| `features/X` | `shared`, sa propre arbo | internes d'un autre feature |
| `shared/` | `shared` | `features`, `app` |

- Un feature s'importe **uniquement via son `index.ts`**. Besoin partagé entre 2 features → remonter dans `shared/`.

### Alias de chemins

`@app/*` · `@features/*` · `@shared/*` (configurés dans `tsconfig.app.json` `paths` + `vite.config.ts` `resolve.alias`). Ex : `import { StatusDot } from '@shared/ui'`.

### Optimisation

- **Code-splitting par route** : passer les routes de features en `lazy` quand le bundle grossit (Fluent est volumineux).
- **i18n en namespaces par feature** (`features/*/locales/`), chargés paresseusement ; commun dans `shared/i18n`.
- **Barrels minces** (éviter de casser le tree-shaking). Tests colocalisés (`*.test.tsx`) ; e2e séparé.

### Shell applicatif (inspiré Outlook)

`app/layout/AppShell.tsx` = grille CSS **fidèle au shell Outlook** (lui-même en Fluent) :

| Région | Fichier | Contenu |
| --- | --- | --- |
| Barre haute (brand) | `TopBar.tsx` | app-launcher, marque **Lafie**, `SearchBox`, bascule langue, notifications (`CounterBadge`), réglages, `Avatar` |
| Ruban d'actions | `CommandBar.tsx` | `Toolbar` (Nouveau patient, Actualiser…) |
| Navigation latérale | `SideNav.tsx` | **maison** (Button/Tooltip Fluent stables) : rail collapsible ↔ drawer ; items = modules (miroir backend) |
| Contenu | `<Outlet/>` | route active |

- Le **contenu d'accueil** = **dashboard widgets** (`features/dashboard` : KPI `StatCard`, agenda du jour, statut système), **pas** un faux 3-panneaux.
- Le **3-panneaux liste/détail** (`shared/ui/layout/ThreePane`, à venir) est réservé aux modules type Patients (liste → détail), rendu **dans** le contenu du shell.
- Le hamburger de `TopBar` bascule `SideNav` (rail 48px ↔ drawer 240px).

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
