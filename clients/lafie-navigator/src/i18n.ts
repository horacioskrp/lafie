import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// i18n — FR par défaut (cible Togo), EN. Ressources inline au démarrage ;
// à découper en namespaces par module et/ou chargement paresseux plus tard.
const resources = {
  fr: {
    translation: {
      appTitle: 'Lafie Navigator',
      appSubtitle: 'Plateforme HIS/EMR — front React + TypeScript (Vite)',
      backendState: 'État du backend',
      api: 'API',
      database: 'Base de données',
      reachable: 'joignable',
      unreachable: 'injoignable',
      updatedAt: 'Mis à jour à {{time}}',
      switchLang: 'English',
    },
  },
  en: {
    translation: {
      appTitle: 'Lafie Navigator',
      appSubtitle: 'HIS/EMR platform — React + TypeScript frontend (Vite)',
      backendState: 'Backend status',
      api: 'API',
      database: 'Database',
      reachable: 'reachable',
      unreachable: 'unreachable',
      updatedAt: 'Updated at {{time}}',
      switchLang: 'Français',
    },
  },
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    interpolation: { escapeValue: false },
  })

export default i18n
