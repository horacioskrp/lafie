import {
  type BrandVariants,
  createLightTheme,
  createDarkTheme,
  type Theme,
} from '@fluentui/react-components'

// Rampe de marque Fluent ancrée sur la couleur PRIMAIRE #00728B (brand[80] =
// couleur d'action/focus). 10 = plus foncé, 160 = plus clair.
export const lafieBrand: BrandVariants = {
  10: '#001318',
  20: '#00212a',
  30: '#002d39',
  40: '#003a49',
  50: '#00485a',
  60: '#00566c',
  70: '#00647e',
  80: '#00728b',
  90: '#1a8298',
  100: '#3d92a6',
  110: '#5fa3b4',
  120: '#82b4c2',
  130: '#a6c6d2',
  140: '#c9d9e1',
  150: '#e4edf1',
  160: '#f2f7f9',
}

export const lafieLightTheme: Theme = { ...createLightTheme(lafieBrand) }
export const lafieDarkTheme: Theme = { ...createDarkTheme(lafieBrand) }

// Couleurs applicatives hors rampe Fluent.
export const lafieColors = {
  // Secondaire : accents, badges, états positifs / indicateurs de santé.
  secondary: '#009664',
  // Fond très clair légèrement bleuté (réduit la fatigue visuelle vs blanc pur).
  background: '#F4F8FA',
  // Dégradé — à utiliser AVEC PARCIMONIE (bannière profil, splashscreen, header de pass santé).
  gradient: 'linear-gradient(135deg, #00728B 0%, #009664 100%)',
} as const
