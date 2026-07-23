import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { makeStyles } from '@fluentui/react-components'
import { TopBar } from './TopBar'
import { CommandBar } from './CommandBar'
import { SideNav } from './SideNav'

const useStyles = makeStyles({
  shell: {
    display: 'grid',
    gridTemplateRows: 'auto auto 1fr',
    height: '100vh',
    backgroundColor: '#f4f8fa',
  },
  body: { display: 'grid', minHeight: 0 },
  content: { overflowY: 'auto' },
})

// Coquille applicative fidèle au shell Outlook :
// barre haute (brand) + ruban d'actions + navigation latérale + contenu.
export function AppShell() {
  const styles = useStyles()
  const [expanded, setExpanded] = useState(true)

  return (
    <div className={styles.shell}>
      <TopBar onMenuClick={() => setExpanded((e) => !e)} />
      <CommandBar />
      <div className={styles.body} style={{ gridTemplateColumns: expanded ? '240px 1fr' : '48px 1fr' }}>
        <SideNav expanded={expanded} />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
