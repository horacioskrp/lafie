import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { AppShell } from '@app/layout/AppShell'
import { DashboardPage } from '@features/dashboard'

// Routage code-based. Ajouter les routes des features au fur et à mesure ;
// passer en lazy (`route.lazy`) quand le bundle grossit.
const rootRoute = createRootRoute({ component: AppShell })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
})

const routeTree = rootRoute.addChildren([indexRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
