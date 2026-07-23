import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// i18n — FR par défaut (cible Togo), EN. Ressources inline au démarrage ;
// à découper en namespaces par feature et/ou chargement paresseux plus tard.
const resources = {
  fr: {
    translation: {
      appTitle: 'Lafie Navigator',
      appSubtitle: 'Plateforme HIS/EMR',
      search: 'Rechercher un patient, un dossier…',
      switchLang: 'English',
      nav: {
        home: 'Accueil',
        patients: 'Patients',
        agenda: 'Agenda',
        clinical: 'Clinique',
        pharmacy: 'Pharmacie',
        lab: 'Laboratoire',
        billing: 'Facturation',
        admin: 'Administration',
      },
      command: { newPatient: 'Nouveau patient', refresh: 'Actualiser' },
      dashboard: {
        welcome: 'Bienvenue',
        subtitle: "Vue d'ensemble de l'activité",
        today: "Agenda du jour",
        empty: 'Aucun élément.',
        kpi: {
          patientsToday: 'Patients du jour',
          appointments: 'Rendez-vous',
          pendingResults: 'Résultats en attente',
          alerts: 'Alertes',
        },
        system: 'Système',
        api: 'API',
        database: 'Base de données',
        reachable: 'joignable',
        unreachable: 'injoignable',
        updatedAt: 'Mis à jour à {{time}}',
      },
    },
  },
  en: {
    translation: {
      appTitle: 'Lafie Navigator',
      appSubtitle: 'HIS/EMR platform',
      search: 'Search a patient, a record…',
      switchLang: 'Français',
      nav: {
        home: 'Home',
        patients: 'Patients',
        agenda: 'Schedule',
        clinical: 'Clinical',
        pharmacy: 'Pharmacy',
        lab: 'Laboratory',
        billing: 'Billing',
        admin: 'Administration',
      },
      command: { newPatient: 'New patient', refresh: 'Refresh' },
      dashboard: {
        welcome: 'Welcome',
        subtitle: 'Activity overview',
        today: "Today's schedule",
        empty: 'No item.',
        kpi: {
          patientsToday: 'Patients today',
          appointments: 'Appointments',
          pendingResults: 'Pending results',
          alerts: 'Alerts',
        },
        system: 'System',
        api: 'API',
        database: 'Database',
        reachable: 'reachable',
        unreachable: 'unreachable',
        updatedAt: 'Updated at {{time}}',
      },
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
