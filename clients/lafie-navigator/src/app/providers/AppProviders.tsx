import { FluentProvider } from '@fluentui/react-components'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { lafieLightTheme } from '@shared/theme/theme'
import '@shared/i18n'
import { queryClient } from './queryClient'
import { router } from '@app/router/router'

// Composition root : thème Fluent + cache Query + i18n + routeur.
export function AppProviders() {
  return (
    <FluentProvider theme={lafieLightTheme} style={{ background: 'transparent' }}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </FluentProvider>
  )
}
