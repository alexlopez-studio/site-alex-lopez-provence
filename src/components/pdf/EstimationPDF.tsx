import { Document, Page, Text, View } from '@react-pdf/renderer'
import { styles, COLORS } from './styles'
import {
  formatEur,
  formatEurPerM2,
  formatSignedEur,
  formatSignedPct,
  formatDateFr,
} from '@/lib/pdf/format'
import type { EstimationPdfData } from '@/lib/pdf/extract'

const TYPE_BIEN_LABEL: Record<string, string> = {
  maison: 'Maison',
  appartement: 'Appartement',
  terrain: 'Terrain',
  autre: 'Bien',
}

const BOLD_FG = { fontFamily: 'Helvetica-Bold' as const, color: COLORS.fg }
const BRAND_VALUE = { color: COLORS.brand }
const MARGIN_TOP_4 = { marginTop: 4 }
const MARGIN_TOP_32 = { marginTop: 32 }

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

export default function EstimationPDFDocument({
  data,
}: {
  data: EstimationPdfData
}) {
  const { prenom, surface, type_bien, ville, estimation } = data
  const docTitle = prenom ? `Estimation ${prenom}` : 'Estimation immobilière'
  const subtitleHeader = `Document généré le ${formatDateFr(estimation.generated_at)}`
  const lieu = ville ?? 'Provence Verte'
  const typeBienLabel = TYPE_BIEN_LABEL[type_bien] ?? 'Bien'
  const subtitleLine = `${prenom ? prenom + ' — ' : ''}${typeBienLabel} de ${surface} m² à ${lieu}`
  const methodeLabel =
    estimation.source === 'dvf'
      ? 'Données DVF (transactions réelles)'
      : 'Estimation indicative'

  return (
    <Document title={docTitle} author="Alex Lopez">
      {/* Page 1 — Cover + valeur médiane */}
      <Page size="A4" style={styles.page}>
        <PdfHeader subtitle={subtitleHeader} />

        <Text style={styles.title}>Estimation immobilière</Text>
        <Text style={styles.subtitle}>{subtitleLine}</Text>

        <View style={styles.bigValueBox}>
          <Text style={styles.bigValueLabel}>Valeur médiane estimée</Text>
          <Text style={styles.bigValueAmount}>
            {formatEur(estimation.valeur_mediane)}
          </Text>
          <Text style={styles.bigValueRange}>
            Fourchette : {formatEur(estimation.fourchette_basse)}
            {' — '}
            {formatEur(estimation.fourchette_haute)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Niveau de confiance</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Indice de confiance</Text>
          <Text style={styles.rowValue}>{estimation.confiance}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Méthode</Text>
          <Text style={styles.rowValue}>{methodeLabel}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Transactions analysées</Text>
          <Text style={styles.rowValue}>{estimation.nb_transactions}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Prix m² médian local</Text>
          <Text style={styles.rowValue}>
            {formatEurPerM2(estimation.prix_m2_brut_dvf)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Rayon d’analyse</Text>
          <Text style={styles.rowValue}>{estimation.rayon_km} km</Text>
        </View>

        <PdfFooter />
      </Page>

      {/* Page 2 — Détail prix + stratégie */}
      <Page size="A4" style={styles.page}>
        <PdfHeader subtitle={subtitleHeader} />

        <Text style={styles.sectionTitle}>Détail du calcul</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>
            Prix de base ({surface} m² ×{' '}
            {formatEurPerM2(estimation.prix_m2_brut_dvf)})
          </Text>
          <Text style={styles.rowValue}>
            {formatEur(estimation.prix_de_base)}
          </Text>
        </View>

        {estimation.ajustements.map((a, i) => {
          const color =
            a.sign === 'positive'
              ? COLORS.positive
              : a.sign === 'negative'
                ? COLORS.negative
                : COLORS.fg
          return (
            <View key={`adj-${i}-${a.key}`} style={styles.row}>
              <Text style={styles.rowLabel}>{a.label}</Text>
              <Text style={[styles.rowValue, { color }]}>
                {formatSignedEur(a.montant_eur)} ({formatSignedPct(a.pct)})
              </Text>
            </View>
          )
        })}

        <View style={[styles.row, styles.rowDivider]}>
          <Text style={[styles.rowLabel, BOLD_FG]}>Total ajustements</Text>
          <Text style={styles.rowValue}>
            {formatSignedEur(estimation.total_ajustement_eur)} (
            {formatSignedPct(estimation.total_ajustement_pct)})
          </Text>
        </View>
        <View style={[styles.row, MARGIN_TOP_4]}>
          <Text style={[styles.rowLabel, BOLD_FG]}>Valeur estimée</Text>
          <Text style={[styles.rowValue, BRAND_VALUE]}>
            {formatEur(estimation.valeur_mediane)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Stratégie de mise en vente</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Probabilité de vente rapide</Text>
          <Text style={styles.rowValue}>
            {estimation.strategie.probabilite_vente_rapide_pct}%
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Délai de vente estimé</Text>
          <Text style={styles.rowValue}>
            {estimation.strategie.delai_estime}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Fréquence de visites attendue</Text>
          <Text style={styles.rowValue}>
            {estimation.strategie.frequence_visites}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Marge de négociation prévisible</Text>
          <Text style={styles.rowValue}>
            {estimation.strategie.negociation}
          </Text>
        </View>

        {estimation.points_forts.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Points forts du bien</Text>
            {estimation.points_forts.map((p, i) => (
              <View key={`pf-${i}`} style={styles.bullet}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{p}</Text>
              </View>
            ))}
          </>
        ) : null}

        <PdfFooter />
      </Page>

      {/* Page 3 — Méthodologie + CTA */}
      <Page size="A4" style={styles.page}>
        <PdfHeader subtitle={subtitleHeader} />

        <Text style={styles.sectionTitle}>Méthodologie</Text>
        <Text style={styles.paragraph}>
          Cette estimation s’appuie sur les données DVF (Demandes de Valeurs
          Foncières) publiées par la DGFiP, qui recensent l’ensemble des
          transactions immobilières enregistrées en France.
        </Text>
        <Text style={styles.paragraph}>
          Pour votre bien, {estimation.nb_transactions} transactions ont été
          analysées dans un rayon de {estimation.rayon_km} km, sur des biens
          de surface comparable. Le prix médian au m² est ensuite ajusté en
          fonction des caractéristiques de votre bien (état général,
          performance énergétique, équipements, délai de mise en vente).
        </Text>

        <Text style={styles.sectionTitle}>Limites et précautions</Text>
        <Text style={styles.paragraph}>
          Cette estimation algorithmique constitue une première indication.
          Elle ne remplace pas une visite en personne, qui seule permet
          d’apprécier précisément la qualité, l’orientation, les vis-à-vis et
          le potentiel de votre bien.
        </Text>

        <View style={styles.cta}>
          <Text style={styles.ctaText}>
            Visite gratuite et estimation affinée
          </Text>
          <Text style={styles.ctaSubtext}>
            06 13 18 01 68 — alexlopez-provence.fr
          </Text>
        </View>

        <Text style={[styles.sectionTitle, MARGIN_TOP_32]}>À propos</Text>
        <Text style={styles.paragraph}>
          Alex Lopez est conseiller immobilier indépendant en Provence Verte,
          sous le réseau iad France (RSAC). Spécialisé dans l’accompagnement
          vendeurs et acheteurs, j’apporte un suivi personnalisé du début à
          la fin de votre projet.
        </Text>

        <PdfFooter />
      </Page>
    </Document>
  )
}
