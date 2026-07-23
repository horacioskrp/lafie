import { Body1, Title2, makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  // Dégradé primaire -> secondaire, à usage parcimonieux (bannières / en-têtes).
  banner: {
    backgroundImage: 'linear-gradient(135deg, #00728B 0%, #009664 100%)',
    color: tokens.colorNeutralForegroundOnBrand,
    borderRadius: tokens.borderRadiusXLarge,
    padding: `${tokens.spacingVerticalXL} ${tokens.spacingHorizontalXL}`,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXS,
  },
  title: { color: tokens.colorNeutralForegroundOnBrand },
  subtitle: { color: tokens.colorNeutralForegroundOnBrand, opacity: 0.9 },
})

export function GradientBanner({ title, subtitle }: { title: string; subtitle?: string }) {
  const styles = useStyles()
  return (
    <section className={styles.banner}>
      <Title2 className={styles.title}>{title}</Title2>
      {subtitle ? <Body1 className={styles.subtitle}>{subtitle}</Body1> : null}
    </section>
  )
}
