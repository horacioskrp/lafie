import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import {
  Body1,
  Button,
  Caption1,
  Card,
  CardHeader,
  Spinner,
  Subtitle2,
  Title2,
  makeStyles,
  tokens,
} from '@fluentui/react-components'

const useStyles = makeStyles({
  root: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: tokens.spacingVerticalXXL,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
  },
  topbar: { display: 'flex', justifyContent: 'flex-end' },
  // Dégradé utilisé avec parcimonie : bannière d'en-tête uniquement.
  banner: {
    backgroundImage: 'linear-gradient(135deg, #00728B 0%, #009664 100%)',
    color: tokens.colorNeutralForegroundOnBrand,
    borderRadius: tokens.borderRadiusXLarge,
    padding: `${tokens.spacingVerticalXL} ${tokens.spacingHorizontalXL}`,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXS,
  },
  bannerTitle: { color: tokens.colorNeutralForegroundOnBrand },
  bannerSubtitle: { color: tokens.colorNeutralForegroundOnBrand, opacity: 0.9 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  status: { display: 'inline-flex', alignItems: 'center', columnGap: tokens.spacingHorizontalXS },
  dot: { width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' },
  dotOk: { backgroundColor: '#009664' }, // secondaire = état positif / santé
  dotKo: { backgroundColor: tokens.colorPaletteRedBackground3 },
})

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

function App() {
  const styles = useStyles()
  const { t, i18n } = useTranslation()

  const health = useQuery({
    queryKey: ['health'],
    queryFn: () => getJson<{ status: string; phase: string }>('/api/health'),
  })
  const db = useQuery({
    queryKey: ['health-db'],
    queryFn: () => getJson<{ database: string }>('/api/health/db'),
  })

  const toggleLang = () => i18n.changeLanguage(i18n.language.startsWith('fr') ? 'en' : 'fr')

  const statusView = (
    isPending: boolean,
    isError: boolean,
    okLabel: string,
  ) => {
    if (isPending) return <Spinner size="tiny" />
    const ok = !isError
    return (
      <span className={styles.status}>
        <span className={`${styles.dot} ${ok ? styles.dotOk : styles.dotKo}`} />
        <Body1>{ok ? okLabel : t('unreachable')}</Body1>
      </span>
    )
  }

  return (
    <main className={styles.root}>
      <div className={styles.topbar}>
        <Button appearance="secondary" onClick={toggleLang}>
          {t('switchLang')}
        </Button>
      </div>

      <section className={styles.banner}>
        <Title2 className={styles.bannerTitle}>{t('appTitle')}</Title2>
        <Body1 className={styles.bannerSubtitle}>{t('appSubtitle')}</Body1>
      </section>

      <Card>
        <CardHeader header={<Subtitle2>{t('backendState')}</Subtitle2>} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 8 }}>
          <div className={styles.row}>
            <Body1>{t('api')}</Body1>
            {statusView(
              health.isPending,
              health.isError,
              health.data ? `${t('reachable')} (${health.data.phase})` : t('reachable'),
            )}
          </div>
          <div className={styles.row}>
            <Body1>{t('database')}</Body1>
            {statusView(db.isPending, db.isError, db.data?.database ?? t('reachable'))}
          </div>
        </div>
      </Card>

      <Caption1>{t('updatedAt', { time: DateTime.now().toLocaleString(DateTime.TIME_WITH_SECONDS) })}</Caption1>
    </main>
  )
}

export default App
