import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import '@shared/i18n'
import { ThemeModeProvider } from './ThemeModeProvider'
import { queryClient } from './queryClient'
import { router } from '@app/router/router'

// Composition root : thème Fluent (mode clair/sombre) + cache Query + i18n + routeur.
export function AppProviders() {
  return (
    <ThemeModeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeModeProvider>
  )
}
