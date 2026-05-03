import { Document, Page, Text, View } from '@react-pdf/renderer'
import { styles, COLORS } from './styles'
import { formatDateFr, formatEur } from '@/lib/pdf/format'
import type { AuditPdfData } from '@/lib/pdf/extract'

function PdfHeader({ subtitle }: { subtitle: string }) {
  return (
    <>
      <View style={styles.brandBar} fixed />
      <View style={styles.pageHeader} fixed>
        <Text style={styles.brandName}>ALEX LOPEZ \u2014 PROVENCE</Text>
        <Text style={styles.pageHeaderRight}>{subtitle}</Text>
      </View>
    </>
  )
}

function PdfFooter() {
  return (
    <View style={styles.footer} fixed>
      <Text>
        Alex Lopez \u2014 Conseiller iad + RSAC \u2014 06 13 18 01 68 \u2014 alexlopez-provence.fr
      </Text>
    </View>
  )
}

function clamp(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.min(100, Math.max(0, n))
}

function ScoreSub({
  label,
  value,
  isLast,
}: {
  label: string
  value: number
  isLast?: boolean
}) {
  const pct = clamp(value)
  const wrapperStyle = isLast
    ? styles.scoreSub
    : [styles.scoreSub, { marginRight: 8 }]
  return (
    <View style={wrapperStyle}>
      <Text style={styles.scoreSubLabel}>{label}</Text>
      <Text style={styles.scoreSubValue}>{value}/100</Text>
      <View style={styles.scoreBar}>
        <View style={[styles.scoreBarFill, { width: `${pct}%` }]} />
      </View>
    </View>
  )
}

function scoreCommentaire(score: number): string {
  if (score >= 80) {
    return "Excellent \u2014 votre bien pr\u00e9sente un \u00e9tat g\u00e9n\u00e9ral tr\u00e8s favorable. Peu d\u2019interventions \u00e0 pr\u00e9voir avant mise en vente."
  }
  if (score >= 65) {
    return "Bon \u2014 votre bien est globalement en bon \u00e9tat. Quelques points d\u2019attention sont identifi\u00e9s ci-dessous."
  }
  if (score >= 45) {
    return "Correct \u2014 votre bien n\u00e9cessite plusieurs am\u00e9liorations pour valoriser au mieux sa mise en vente."
  }
  return "\u00c0 am\u00e9liorer \u2014 votre bien pr\u00e9sente plusieurs points d\u2019attention. Les recommandations ci-dessous sont prioritaires."
}

export default function AuditPDFDocument({
  data,
}: {
  data: AuditPdfData
}) {
  const { prenom, audit } = data
  const docTitle = prenom ? `Audit ${prenom}` : 'Audit immobilier'
  const subtitleHeader = `Document g\u00e9n\u00e9r\u00e9 le ${formatDateFr(audit.generated_at)}`
  const subtitleLine = prenom
    ? `Pour ${prenom} \u2014 Provence Verte`
    : 'Rapport personnalis\u00e9 \u2014 Provence Verte'

  return (
    <Document title={docTitle} author="Alex Lopez">
      {/* Page 1 \u2014 Cover + scores */}
      <Page size="A4" style={styles.page}>
        <PdfHeader subtitle={subtitleHeader} />

        <Text style={styles.title}>Audit immobilier</Text>
        <Text style={styles.subtitle}>{subtitleLine}</Text>

        <View style={styles.scoreBox}>
          <View style= flexDirection: 'row', alignItems: 'baseline' >
            <Text style={styles.scoreBig}>{audit.score_global}</Text>
            <Text style={styles.scoreOutOf}>/100</Text>
          </View>
          <Text style={styles.scoreLabelText}>
            {scoreCommentaire(audit.score_global)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>D\u00e9tail des scores</Text>
        <View style={styles.scoreSubrow}>
          <ScoreSub label="Structure" value={audit.score_structure} />
          <ScoreSub label="\u00c9nergie" value={audit.score_energie} />
          <ScoreSub label="Confort" value={audit.score_confort} isLast />
        </View>

        {audit.budget_travaux_estime ? (
          <>
            <Text style={styles.sectionTitle}>Budget travaux estim\u00e9</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Fourchette indicative</Text>
              <Text style={styles.rowValue}>
                {formatEur(audit.budget_travaux_estime.min)}
                {' \u2014 '}
                {formatEur(audit.budget_travaux_estime.max)}
              </Text>
            </View>
          </>
        ) : null}

        <PdfFooter />
      </Page>

      {/* Page 2 \u2014 Forces / Attention / Recommandations + CTA */}
      <Page size="A4" style={styles.page}>
        <PdfHeader subtitle={subtitleHeader} />

        {audit.points_forts.length > 0 ? (
          <>
            <Text style={[styles.sectionTitle, { color: COLORS.positive }]}>
              Points forts
            </Text>
            {audit.points_forts.map((p, i) => (
              <View key={`pf-${i}`} style={styles.bullet}>
                <Text style={[styles.bulletDot, { color: COLORS.positive }]}>
                  \u2022
                </Text>
                <Text style={styles.bulletText}>{p}</Text>
              </View>
            ))}
          </>
        ) : null}

        {audit.points_attention.length > 0 ? (
          <>
            <Text style={[styles.sectionTitle, { color: COLORS.warning }]}>
              Points d\u2019attention
            </Text>
            {audit.points_attention.map((p, i) => (
              <View key={`pa-${i}`} style={styles.bullet}>
                <Text style={[styles.bulletDot, { color: COLORS.warning }]}>
                  \u2022
                </Text>
                <Text style={styles.bulletText}>{p}</Text>
              </View>
            ))}
          </>
        ) : null}

        {audit.recommandations.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Recommandations</Text>
            {audit.recommandations.map((r, i) => (
              <View key={`rec-${i}`} style={styles.bullet}>
                <Text style={styles.bulletDot}>{i + 1}.</Text>
                <Text style={styles.bulletText}>{r}</Text>
              </View>
            ))}
          </>
        ) : null}

        <View style={styles.cta}>
          <Text style={styles.ctaText}>
            Visite gratuite pour affiner cet audit
          </Text>
          <Text style={styles.ctaSubtext}>
            06 13 18 01 68 \u2014 alexlopez-provence.fr
          </Text>
        </View>

        <PdfFooter />
      </Page>
    </Document>
  )
}
