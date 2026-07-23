import type { ReactElement } from 'react'
import { Card, Text, makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalM,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXS,
  },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  value: { fontSize: tokens.fontSizeHero700, fontWeight: tokens.fontWeightSemibold, lineHeight: '1' },
  label: { color: tokens.colorNeutralForeground3 },
  icon: { color: tokens.colorBrandForeground1 },
})

export function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string | number
  icon?: ReactElement
}) {
  const styles = useStyles()
  return (
    <Card className={styles.card}>
      <div className={styles.head}>
        <Text className={styles.value}>{value}</Text>
        {icon ? <span className={styles.icon}>{icon}</span> : null}
      </div>
      <Text className={styles.label}>{label}</Text>
    </Card>
  )
}
