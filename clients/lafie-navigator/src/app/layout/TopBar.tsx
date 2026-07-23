import { useTranslation } from 'react-i18next'
import {
  Avatar,
  Button,
  CounterBadge,
  SearchBox,
  Text,
  Tooltip,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  Alert24Regular,
  Apps24Regular,
  Navigation24Regular,
  Settings24Regular,
} from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    height: '48px',
    padding: `0 ${tokens.spacingHorizontalM}`,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  brand: { fontWeight: tokens.fontWeightSemibold, fontSize: tokens.fontSizeBase400 },
  searchWrap: { flex: 1, display: 'flex', justifyContent: 'center' },
  search: { width: '100%', maxWidth: '480px' },
  right: { display: 'flex', alignItems: 'center', columnGap: tokens.spacingHorizontalXS },
  onBrand: { color: tokens.colorNeutralForegroundOnBrand },
  bell: { position: 'relative' },
  badge: { position: 'absolute', top: '4px', right: '4px' },
})

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const styles = useStyles()
  const { t, i18n } = useTranslation()
  const toggleLang = () => i18n.changeLanguage(i18n.language.startsWith('fr') ? 'en' : 'fr')

  return (
    <header className={styles.root}>
      <Button
        appearance="transparent"
        className={styles.onBrand}
        icon={<Navigation24Regular />}
        onClick={onMenuClick}
        aria-label="Menu"
      />
      <Button
        appearance="transparent"
        className={styles.onBrand}
        icon={<Apps24Regular />}
        aria-label="Applications"
      />
      <Text className={styles.brand}>Lafie</Text>

      <div className={styles.searchWrap}>
        <SearchBox className={styles.search} placeholder={t('search')} />
      </div>

      <div className={styles.right}>
        <Button appearance="transparent" className={styles.onBrand} onClick={toggleLang}>
          {t('switchLang')}
        </Button>
        <Tooltip content="Notifications" relationship="label">
          <span className={styles.bell}>
            <Button
              appearance="transparent"
              className={styles.onBrand}
              icon={<Alert24Regular />}
              aria-label="Notifications"
            />
            <CounterBadge className={styles.badge} count={3} size="small" color="danger" />
          </span>
        </Tooltip>
        <Tooltip content="Réglages" relationship="label">
          <Button
            appearance="transparent"
            className={styles.onBrand}
            icon={<Settings24Regular />}
            aria-label="Réglages"
          />
        </Tooltip>
        <Avatar name="Horacio sKrp" size={28} color="colorful" />
      </div>
    </header>
  )
}
