import { Document, Page, Text, View } from '@react-pdf/renderer'
import { styles, COLORS } from './styles'
import { formatDateFr, formatEur } from '@/lib/pdf/format'
import type { AuditPdfData } from '@/lib/pdf/extract'

const MARGIN_RIGHT_8 = { marginRight: 8 }
const POSITIVE_DOT = { color: COLORS.positive }
const WARNING_DOT = { color: COLORS.warning }
const POSITIVE_TITLE = { color: COLORS.positive }
const WARNING_TITLE = { color: COLORS.warning }

function PdfHeader({ subtitle }: { subtitle: string }) {
  return (
    <>
      <View style={styles.brandBar} fixed />
      <View style={styles.pageHeader} fixed>
        <Text style={styles.brandName}>ALEX LOPEZ — PROVENCE</Text>
        <Text style={styles.pageHeaderRight}>{subtitle}</Text>
      </View>
    </>
  )
}

function PdfFooter() {
  return (
    <View style={styles.footer} fixed>
      <Text>
        Alex Lopez — Conseiller iad + RSAC — 06 13 18 01 68 —
        alexlopez-provence.fr
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
    : [styles.scoreSub, MARGIN_RIGHT_8]
  const fillStyle = [styles.scoreBarFill, { width: `${pct}%` }]
  return (
    <View style={wrapperStyle}>
      <Text style={styles.scoreSubLabel}>{label}</Text>
      <Text style={styles.scoreSubValue}>{value}/100</Text>
      <View style={styles.scoreBar}>
        <View style={fillStyle} />
      </View>
    </View>
  )
}

function scoreCommentaire(score: number): string {
  if (score >= 80) {
    return 'Excellent — votre bien présente un état général très favorable. Peu d’interventions à prévoir avant mise en vente.'
  }
  if (score >= 65) {
    return 'Bon — votre bien est globalement en bon état. Quelques points d’attention sont identifiés ci-dessous.'
  }
  if (score >= 45) {
    return 'Correct — votre bien nécessite plusieurs améliorations pour valoriser au mieux sa mise en vente.'
  }
  return 'À améliorer — votre bien présente plusieurs points d’attention. Les recommandations ci-dessous sont prioritaires.'
}

export default function AuditPDFDocument({ data }: { data: AuditPdfData }) {
  const { prenom, audit } = data
  const docTitle = prenom ? `Audit ${prenom}` : 'Audit immobilier'
  const subtitleHeader = `Document généré le ${formatDateFr(audit.generated_at)}`
  const subtitleLine = prenom
    ? `Pour ${prenom} — Provence Verte`
    : 'Rapport personnalisé — Provence Verte'

  return (
    <Document title={docTitle} author="Alex Lopez">
      {/* Page 1 — Cover + scores */}
      <Page size="A4" style={styles.page}>
        <PdfHeader subtitle={subtitleHeader} />

        <Text style={styles.title}>Audit immobilier</Text>
        <Text style={styles.subtitle}>{subtitleLine}</Text>

        <View style={styles.scoreBox}>
          <View style={styles.scoreInline}>
            <Text style={styles.scoreBig}>{audit.score_global}</Text>
            <Text style={styles.scoreOutOf}>/100</Text>
          </View>
          <Text style={styles.scoreLabelText}>
            {scoreCommentaire(audit.score_global)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Détail des scores</Text>
        <View style={styles.scoreSubrow}>
          <ScoreSub label="Structure" value={audit.score_structure} />
          <ScoreSub label="Énergie" value={audit.score_energie} />
          <ScoreSub label="Confort" value={audit.score_confort} isLast />
        </View>

        {audit.budget_travaux_estime ? (
          <>
            <Text style={styles.sectionTitle}>Budget travaux estimé</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Fourchette indicative</Text>
              <Text style={styles.rowValue}>
                {formatEur(audit.budget_travaux_estime.min)}
                {' — '}
                {formatEur(audit.budget_travaux_estime.max)}
              </Text>
            </View>
          </>
        ) : null}

        <PdfFooter />
      </Page>

      {/* Page 2 — Forces / Attention / Recommandations + CTA */}
      <Page size="A4" style={styles.page}>
        <PdfHeader subtitle={subtitleHeader} />

        {audit.points_forts.length > 0 ? (
          <>
            <Text style={[styles.sectionTitle, POSITIVE_TITLE]}>
              Points forts
            </Text>
            {audit.points_forts.map((p, i) => (
              <View key={`pf-${i}`} style={styles.bullet}>
                <Text style={[styles.bulletDot, POSITIVE_DOT]}>•</Text>
                <Text style={styles.bulletText}>{p}</Text>
              </View>
            ))}
          </>
        ) : null}

        {audit.points_attention.length > 0 ? (
          <>
            <Text style={[styles.sectionTitle, WARNING_TITLE]}>
              Points d’attention
            </Text>
            {audit.points_attention.map((p, i) => (
              <View key={`pa-${i}`} style={styles.bullet}>
                <Text style={[styles.bulletDot, WARNING_DOT]}>•</Text>
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
            06 13 18 01 68 — alexlopez-provence.fr
          </Text>
        </View>

        <PdfFooter />
      </Page>
    </Document>
  )
}
