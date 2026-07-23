import { useTranslation } from 'react-i18next'
import { Toolbar, ToolbarButton, ToolbarDivider, makeStyles, tokens } from '@fluentui/react-components'
import { Add24Regular, ArrowSync24Regular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: '44px',
    padding: `0 ${tokens.spacingHorizontalS}`,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
})

export function CommandBar() {
  const styles = useStyles()
  const { t } = useTranslation()

  return (
    <div className={styles.root}>
      <Toolbar aria-label="Actions">
        <ToolbarButton appearance="primary" icon={<Add24Regular />}>
          {t('command.newPatient')}
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton icon={<ArrowSync24Regular />}>{t('command.refresh')}</ToolbarButton>
      </Toolbar>
    </div>
  )
}
