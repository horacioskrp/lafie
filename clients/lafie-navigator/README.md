# Lafie Navigator

Frontend web de **Lafie** (HIS/EMR) — SPA **React + TypeScript + Vite**.
Client fin : consomme l'API .NET via `/api` (proxy nginx en conteneur, proxy Vite en dev).

## Stack
- **Fluent UI v9** (`@fluentui/react-components`)
- **TanStack** Query (Router + Table câblés au besoin)
- **React Hook Form** + **Zod** (`zodResolver`)
- **i18next** / react-i18next (FR défaut, EN)
- **Luxon** (dates/fuseaux)
- **Vitest** + Testing Library (`src/`) · **Playwright** (`e2e/`)
- **vite-plugin-pwa** (installable + cache assets)
- Charts *différés* : `@fluentui/react-charting` (défaut) + `recharts` (secours) — à ajouter au 1er graphe

## Commandes
```bash
npm run dev        # dev server (http://localhost:3000, proxy /api -> :8081)
npm run build      # tsc -b && vite build (+ PWA)
npm run test       # Vitest (unit/composant)
npm run test:e2e   # Playwright (requiert app sur :3000 + npx playwright install)
npm run lint       # oxlint
```

## Docker
Servie par nginx via `docker compose up --build web` (à la racine du repo) → http://localhost:3000.
Voir `Dockerfile` + `nginx.conf` (proxy `/api` → backend).

## Thème / couleurs (`src/theme.ts`)
- **Primaire (action/focus)** : `#00728B` → rampe de marque Fluent (`lafieBrand`, `createLightTheme`).
- **Secondaire (accents/badges/états positifs)** : `#009664` (`lafieColors.secondary`).
- **Dégradé** (`lafieColors.gradient`, `#00728B`→`#009664`) : avec **parcimonie** (bannière, splash, header de pass santé).
- **Fond** : `#F4F8FA` (bleuté clair, moins de fatigue visuelle que le blanc pur) — `src/index.css`.

> Rampe de marque approximée à la main ; affinable via le Fluent UI Theme Designer.
> Gotcha PWA : après un rebuild, recharger la page pour que le service worker serve les assets à jour.
