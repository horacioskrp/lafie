import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { FluentProvider } from '@fluentui/react-components'
import { lafieDarkTheme, lafieLightTheme } from '@shared/theme/theme'

export type ThemeMode = 'light' | 'dark' | 'system'

type ThemeModeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  isDark: boolean
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) throw new Error('useThemeMode doit être utilisé dans <ThemeModeProvider>')
  return ctx
}

const STORAGE_KEY = 'lafie.themeMode'

const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

// Pilote le thème Fluent (Clair / Sombre / Système) et fournit le mode au reste de l'app.
export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(
    () => (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'system',
  )
  const [systemDark, setSystemDark] = useState(prefersDark)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const setMode = (m: ThemeMode) => {
    setModeState(m)
    localStorage.setItem(STORAGE_KEY, m)
  }

  const isDark = mode === 'dark' || (mode === 'system' && systemDark)
  const theme = isDark ? lafieDarkTheme : lafieLightTheme
  const value = useMemo(() => ({ mode, setMode, isDark }), [mode, isDark])

  return (
    <ThemeModeContext.Provider value={value}>
      {/* Fond bleuté #F4F8FA en clair ; neutre du thème en sombre. */}
      <FluentProvider theme={theme} style={{ minHeight: '100vh', background: isDark ? undefined : '#f4f8fa' }}>
        {children}
      </FluentProvider>
    </ThemeModeContext.Provider>
  )
}
