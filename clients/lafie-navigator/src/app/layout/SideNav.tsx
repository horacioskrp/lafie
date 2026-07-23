import { useState, type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Tooltip, makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import {
  Beaker24Regular,
  CalendarLtr24Regular,
  Home24Regular,
  Money24Regular,
  People24Regular,
  Pill24Regular,
  Settings24Regular,
  Stethoscope24Regular,
} from '@fluentui/react-icons'

type NavItem = { key: string; icon: ReactElement; labelKey: string }

const items: NavItem[] = [
  { key: 'home', icon: <Home24Regular />, labelKey: 'nav.home' },
  { key: 'patients', icon: <People24Regular />, labelKey: 'nav.patients' },
  { key: 'agenda', icon: <CalendarLtr24Regular />, labelKey: 'nav.agenda' },
  { key: 'clinical', icon: <Stethoscope24Regular />, labelKey: 'nav.clinical' },
  { key: 'pharmacy', icon: <Pill24Regular />, labelKey: 'nav.pharmacy' },
  { key: 'lab', icon: <Beaker24Regular />, labelKey: 'nav.lab' },
  { key: 'billing', icon: <Money24Regular />, labelKey: 'nav.billing' },
  { key: 'admin', icon: <Settings24Regular />, labelKey: 'nav.admin' },
]

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '2px',
    padding: tokens.spacingVerticalXS,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    overflowY: 'auto',
  },
  item: { justifyContent: 'flex-start', minWidth: 0 },
  itemCollapsed: { justifyContent: 'center' },
  selected: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
  },
})

export function SideNav({ expanded }: { expanded: boolean }) {
  const styles = useStyles()
  const { t } = useTranslation()
  const [selected, setSelected] = useState('home')

  return (
    <nav className={styles.root} aria-label="Navigation principale">
      {items.map((it) => {
        const label = t(it.labelKey)
        const btn = (
          <Button
            appearance="subtle"
            icon={it.icon}
            onClick={() => setSelected(it.key)}
            className={mergeClasses(
              expanded ? styles.item : styles.itemCollapsed,
              selected === it.key && styles.selected,
            )}
            aria-current={selected === it.key ? 'page' : undefined}
          >
            {expanded ? label : undefined}
          </Button>
        )
        return expanded ? (
          <div key={it.key}>{btn}</div>
        ) : (
          <Tooltip key={it.key} content={label} relationship="label" positioning="after">
            {btn}
          </Tooltip>
        )
      })}
    </nav>
  )
}
