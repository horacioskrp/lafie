import { render, screen } from '@testing-library/react'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, test, vi } from 'vitest'
import '@shared/i18n'
import { DashboardPage } from '@features/dashboard'

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string | URL) => ({
      ok: true,
      json: async () =>
        String(url).includes('/db') ? { database: 'up' } : { status: 'ok', phase: 'test' },
    })) as unknown as typeof fetch,
  )
})

function renderPage() {
  const queryClient = new QueryClient()
  return render(
    <FluentProvider theme={webLightTheme}>
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    </FluentProvider>,
  )
}

test('affiche le statut de la base après chargement', async () => {
  renderPage()
  expect(await screen.findByText('up')).toBeInTheDocument()
})

test("affiche la phase de l'API après chargement", async () => {
  renderPage()
  expect(await screen.findByText(/test/)).toBeInTheDocument()
})
