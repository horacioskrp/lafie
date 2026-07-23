import { render, screen } from '@testing-library/react'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, test, vi } from 'vitest'
import './i18n'
import App from './App'

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

function renderApp() {
  const queryClient = new QueryClient()
  return render(
    <FluentProvider theme={webLightTheme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </FluentProvider>,
  )
}

test("affiche le titre de l'application", async () => {
  renderApp()
  expect(await screen.findByText('Lafie Navigator')).toBeInTheDocument()
})

test('affiche la phase de l\'API après chargement', async () => {
  renderApp()
  expect(await screen.findByText(/test/)).toBeInTheDocument()
})
