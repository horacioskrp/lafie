import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Body1,
  Button,
  Checkbox,
  Dialog,
  DialogSurface,
  DialogTrigger,
  Divider,
  Radio,
  RadioGroup,
  Subtitle2,
  Text,
  Title3,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons'
import { useThemeMode, type ThemeMode } from '@app/providers/ThemeModeProvider'

type Section = 'language' | 'appearance' | 'notifications' | 'privacy' | 'search'
const SECTIONS: Section[] = ['language', 'appearance', 'notifications', 'privacy', 'search']

const COLORS = ['#00728B', '#0f6cbd', '#5b5fc7', '#c50f1f', '#009664', '#8764b8', '#e3008c']

const useStyles = makeStyles({
  surface: {
    width: '92vw',
    maxWidth: '960px',
    height: '80vh',
    maxHeight: '640px',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      width: '100vw',
      height: '100vh',
      maxWidth: 'none',
      maxHeight: 'none',
      borderRadius: 0,
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  cols: {
    display: 'flex',
    flex: 1,
    minHeight: 0,
    '@media (max-width: 768px)': { flexDirection: 'column' },
  },
  nav: {
    width: '230px',
    flexShrink: 0,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: tokens.spacingVerticalS,
    display: 'flex',
    flexDirection: 'column',
    rowGap: '2px',
    overflowY: 'auto',
    '@media (max-width: 768px)': {
      width: 'auto',
      flexDirection: 'row',
      overflowX: 'auto',
      borderRight: 'none',
      borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    },
  },
  navItem: { justifyContent: 'flex-start' },
  navItemSel: { backgroundColor: tokens.colorBrandBackground2, color: tokens.colorBrandForeground1 },
  content: {
    flex: 1,
    padding: tokens.spacingVerticalXL,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
  },
  group: { display: 'flex', flexDirection: 'column', rowGap: tokens.spacingVerticalS },
  modeRow: { display: 'flex', columnGap: tokens.spacingHorizontalM, flexWrap: 'wrap' },
  modeCard: {
    width: '120px',
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    border: `2px solid ${tokens.colorNeutralStroke2}`,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXS,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  modeCardSel: { border: `2px solid ${tokens.colorBrandStroke1}` },
  preview: { height: '56px', borderRadius: tokens.borderRadiusSmall, border: `1px solid ${tokens.colorNeutralStroke2}` },
  swatches: { display: 'flex', columnGap: tokens.spacingHorizontalS, flexWrap: 'wrap' },
  swatch: {
    width: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    border: `2px solid transparent`,
  },
  swatchSel: { outline: `2px solid ${tokens.colorBrandStroke1}`, outlineOffset: '2px' },
  muted: { color: tokens.colorNeutralForeground3 },
})

const MODE_PREVIEW: Record<ThemeMode, React.CSSProperties> = {
  light: { background: '#ffffff' },
  dark: { background: '#1f1f1f' },
  system: { background: 'linear-gradient(90deg, #ffffff 50%, #1f1f1f 50%)' },
}

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const styles = useStyles()
  const { t, i18n } = useTranslation()
  const { mode, setMode } = useThemeMode()
  const [section, setSection] = useState<Section>('appearance')
  const [color, setColor] = useState(COLORS[0])
  const [coloredIcons, setColoredIcons] = useState(true)
  const [showNames, setShowNames] = useState(false)

  return (
    <Dialog open={open} onOpenChange={(_, d) => onOpenChange(d.open)} modalType="modal">
      <DialogSurface className={styles.surface}>
        <div className={styles.header}>
          <Text weight="semibold" size={500}>
            {t('settings.title')}
          </Text>
          <DialogTrigger disableButtonEnhancement>
            <Button appearance="subtle" icon={<Dismiss24Regular />} aria-label={t('settings.close')} />
          </DialogTrigger>
        </div>

        <div className={styles.cols}>
          <nav className={styles.nav} aria-label={t('settings.title')}>
            {SECTIONS.map((s) => (
              <Button
                key={s}
                appearance="subtle"
                className={mergeClasses(styles.navItem, section === s && styles.navItemSel)}
                onClick={() => setSection(s)}
                aria-current={section === s ? 'page' : undefined}
              >
                {t(`settings.sections.${s}`)}
              </Button>
            ))}
          </nav>

          <div className={styles.content}>
            {section === 'appearance' && (
              <>
                <Title3>{t('settings.sections.appearance')}</Title3>

                <div className={styles.group}>
                  <Subtitle2>{t('settings.appearance.chooseMode')}</Subtitle2>
                  <div className={styles.modeRow}>
                    {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={mergeClasses(styles.modeCard, mode === m && styles.modeCardSel)}
                        onClick={() => setMode(m)}
                        aria-pressed={mode === m}
                      >
                        <div className={styles.preview} style={MODE_PREVIEW[m]} />
                        <Text size={200}>{t(`settings.appearance.mode.${m}`)}</Text>
                      </button>
                    ))}
                  </div>
                </div>

                <Divider />

                <div className={styles.group}>
                  <Subtitle2>{t('settings.appearance.themes')}</Subtitle2>
                  <Text className={styles.muted}>{t('settings.appearance.color')}</Text>
                  <div className={styles.swatches}>
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={mergeClasses(styles.swatch, color === c && styles.swatchSel)}
                        style={{ background: c }}
                        onClick={() => setColor(c)}
                        aria-label={c}
                        aria-pressed={color === c}
                      />
                    ))}
                  </div>
                </div>

                <Divider />

                <div className={styles.group}>
                  <Subtitle2>{t('settings.appearance.navbar')}</Subtitle2>
                  <Text className={styles.muted}>{t('settings.appearance.navbarHint')}</Text>
                  <Checkbox
                    checked={coloredIcons}
                    onChange={(_, d) => setColoredIcons(!!d.checked)}
                    label={t('settings.appearance.coloredIcons')}
                  />
                  <Checkbox
                    checked={showNames}
                    onChange={(_, d) => setShowNames(!!d.checked)}
                    label={t('settings.appearance.showNames')}
                  />
                </div>
              </>
            )}

            {section === 'language' && (
              <>
                <Title3>{t('settings.sections.language')}</Title3>
                <div className={styles.group}>
                  <Subtitle2>{t('settings.language.label')}</Subtitle2>
                  <RadioGroup
                    value={i18n.language.startsWith('fr') ? 'fr' : 'en'}
                    onChange={(_, d) => i18n.changeLanguage(d.value)}
                  >
                    <Radio value="fr" label={t('settings.language.french')} />
                    <Radio value="en" label={t('settings.language.english')} />
                  </RadioGroup>
                </div>
              </>
            )}

            {section !== 'appearance' && section !== 'language' && (
              <>
                <Title3>{t(`settings.sections.${section}`)}</Title3>
                <Body1 className={styles.muted}>{t('settings.comingSoon')}</Body1>
              </>
            )}
          </div>
        </div>
      </DialogSurface>
    </Dialog>
  )
}
