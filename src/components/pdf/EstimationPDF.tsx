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

export default function EstimationPDFDocument({
  data,
}: {
  data: EstimationPdfData
}) {
  const { prenom, surface, type_bien, ville, estimation } = data
  const docTitle = prenom ? `Estimation ${prenom}` : 'Estimation immobiliere'
  const subtitleHeader = `Document genere le ${formatDateFr(estimation.generated_at)}`
  const lieu = ville ?? 'Provence Verte'
  const typeBienLabel = TYPE_BIEN_LABEL[type_bien] ?? 'Bien'
  const subtitleLine = `${prenom ? prenom + ' \u2014 ' : ''}${typeBienLabel} de ${surface} m\u00b2 \u00e0 ${lieu}`
  const methodeLabel =
    estimation.source === 'dvf'
      ? 'Donnees DVF (transactions reelles)'
      : 'Estimation indicative'

  return (
    <Document title={docTitle} author="Alex Lopez">
      {/* Page 1 \u2014 Cover + valeur mediane */}
      <Page size="A4" style={styles.page}>
        <PdfHeader subtitle={subtitleHeader} />

        <Text style={styles.title}>Estimation immobili\u00e8re</Text>
        <Text style={styles.subtitle}>{subtitleLine}</Text>

        <View style={styles.bigValueBox}>
          <Text style={styles.bigValueLabel}>Valeur m\u00e9diane estim\u00e9e</Text>
          <Text style={styles.bigValueAmount}>
            {formatEur(estimation.valeur_mediane)}
          </Text>
          <Text style={styles.bigValueRange}>
            Fourchette : {formatEur(estimation.fourchette_basse)}
            {' \u2014 '}
            {formatEur(estimation.fourchette_haute)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Niveau de confiance</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Indice de confiance</Text>
          <Text style={styles.rowValue}>{estimation.confiance}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>M\u00e9thode</Text>
          <Text style={styles.rowValue}>{methodeLabel}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Transactions analys\u00e9es</Text>
          <Text style={styles.rowValue}>{estimation.nb_transactions}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Prix m\u00b2 m\u00e9dian local</Text>
          <Text style={styles.rowValue}>
            {formatEurPerM2(estimation.prix_m2_brut_dvf)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Rayon d\u2019analyse</Text>
          <Text style={styles.rowValue}>{estimation.rayon_km} km</Text>
        </View>

        <PdfFooter />
      </Page>

      {/* Page 2 \u2014 Detail prix + strategie */}
      <Page size="A4" style={styles.page}>
        <PdfHeader subtitle={subtitleHeader} />

        <Text style={styles.sectionTitle}>D\u00e9tail du calcul</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>
            Prix de base ({surface} m\u00b2 \u00d7 {formatEurPerM2(estimation.prix_m2_brut_dvf)})
          </Text>
          <Text style={styles.rowValue}>{formatEur(estimation.prix_de_base)}</Text>
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
          <Text
            style={[
              styles.rowLabel,
              { fontFamily: 'Helvetica-Bold', color: COLORS.fg },
            ]}
          >
            Total ajustements
          </Text>
          <Text style={styles.rowValue}>
            {formatSignedEur(estimation.total_ajustement_eur)} ({formatSignedPct(estimation.total_ajustement_pct)})
          </Text>
        </View>
        <View style={[styles.row, { marginTop: 4 }]}>
          <Text
            style={[
              styles.rowLabel,
              { fontFamily: 'Helvetica-Bold', color: COLORS.fg },
            ]}
          >
            Valeur estim\u00e9e
          </Text>
          <Text style={[styles.rowValue, { color: COLORS.brand }]}>
            {formatEur(estimation.valeur_mediane)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Strat\u00e9gie de mise en vente</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Probabilit\u00e9 de vente rapide</Text>
          <Text style={styles.rowValue}>
            {estimation.strategie.probabilite_vente_rapide_pct}%
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>D\u00e9lai de vente estim\u00e9</Text>
          <Text style={styles.rowValue}>
            {estimation.strategie.delai_estime}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Fr\u00e9quence de visites attendue</Text>
          <Text style={styles.rowValue}>
            {estimation.strategie.frequence_visites}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Marge de n\u00e9gociation pr\u00e9visible</Text>
          <Text style={styles.rowValue}>
            {estimation.strategie.negociation}
          </Text>
        </View>

        {estimation.points_forts.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Points forts du bien</Text>
            {estimation.points_forts.map((p, i) => (
              <View key={`pf-${i}`} style={styles.bullet}>
                <Text style={styles.bulletDot}>\u2022</Text>
                <Text style={styles.bulletText}>{p}</Text>
              </View>
            ))}
          </>
        ) : null}

        <PdfFooter />
      </Page>

      {/* Page 3 \u2014 Methodologie + CTA */}
      <Page size="A4" style={styles.page}>
        <PdfHeader subtitle={subtitleHeader} />

        <Text style={styles.sectionTitle}>M\u00e9thodologie</Text>
        <Text style={styles.paragraph}>
          Cette estimation s\u2019appuie sur les donn\u00e9es DVF (Demandes de Valeurs Fonci\u00e8res) publi\u00e9es par la DGFiP, qui recensent l\u2019ensemble des transactions immobili\u00e8res enregistr\u00e9es en France.
        </Text>
        <Text style={styles.paragraph}>
          Pour votre bien, {estimation.nb_transactions} transactions ont \u00e9t\u00e9 analys\u00e9es dans un rayon de {estimation.rayon_km} km, sur des biens de surface comparable. Le prix m\u00e9dian au m\u00b2 est ensuite ajust\u00e9 en fonction des caract\u00e9ristiques de votre bien (\u00e9tat g\u00e9n\u00e9ral, performance \u00e9nerg\u00e9tique, \u00e9quipements, d\u00e9lai de mise en vente).
        </Text>

        <Text style={styles.sectionTitle}>Limites et pr\u00e9cautions</Text>
        <Text style={styles.paragraph}>
          Cette estimation algorithmique constitue une premi\u00e8re indication. Elle ne remplace pas une visite en personne, qui seule permet d\u2019appr\u00e9cier pr\u00e9cis\u00e9ment la qualit\u00e9, l\u2019orientation, les vis-\u00e0-vis et le potentiel de votre bien.
        </Text>

        <View style={styles.cta}>
          <Text style={styles.ctaText}>
            Visite gratuite et estimation affin\u00e9e
          </Text>
          <Text style={styles.ctaSubtext}>
            06 13 18 01 68 \u2014 alexlopez-provence.fr
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>\u00c0 propos</Text>
        <Text style={styles.paragraph}>
          Alex Lopez est conseiller immobilier ind\u00e9pendant en Provence Verte, sous le r\u00e9seau iad France (RSAC). Sp\u00e9cialis\u00e9 dans l\u2019accompagnement vendeurs et acheteurs, j\u2019apporte un suivi personnalis\u00e9 du d\u00e9but \u00e0 la fin de votre projet.
        </Text>

        <PdfFooter />
      </Page>
    </Document>
  )
}
