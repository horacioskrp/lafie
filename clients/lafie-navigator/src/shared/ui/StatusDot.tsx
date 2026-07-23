import { Body1, makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  wrap: { display: 'inline-flex', alignItems: 'center', columnGap: tokens.spacingHorizontalXS },
  dot: { width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' },
  ok: { backgroundColor: '#009664' }, // secondaire = état positif / santé
  ko: { backgroundColor: tokens.colorPaletteRedBackground3 },
})

export function StatusDot({ ok, label }: { ok: boolean; label: string }) {
  const styles = useStyles()
  return (
    <span className={styles.wrap}>
      <span className={`${styles.dot} ${ok ? styles.ok : styles.ko}`} />
      <Body1>{label}</Body1>
    </span>
  )
}
