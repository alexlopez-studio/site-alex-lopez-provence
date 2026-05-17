import type { Metadata } from 'next'
import { env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Alexandre Lopez',
  description: 'Politique de confidentialité du site alexlopez-provence.fr.',
  alternates: { canonical: (env.app.siteUrl || 'https://alexlopez-provence.fr') + '/politique-confidentialite' },
}

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="bg-white px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand">Données personnelles</p>
        <h1 className="mb-8 text-3xl font-extrabold tracking-[-0.03em] text-foreground md:text-4xl">Politique de confidentialité</h1>

        <div className="space-y-8 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">Données collectées</h2>
            <p>Lorsque vous utilisez le site, les formulaires de contact ou les outils immobiliers, certaines informations peuvent être collectées : nom, prénom, email, téléphone, adresse du bien, caractéristiques du bien et informations liées à votre projet immobilier.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">Finalité de la collecte</h2>
            <p>Ces données servent uniquement à répondre à votre demande, préparer un avis de valeur, qualifier votre projet immobilier ou vous recontacter dans le cadre de votre demande.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">Base légale</h2>
            <p>Le traitement repose sur votre consentement lorsque vous remplissez un formulaire ou utilisez un outil, ainsi que sur l’intérêt légitime de répondre à votre demande.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">Durée de conservation</h2>
            <p>Les données sont conservées pendant la durée nécessaire au traitement de votre demande et au suivi commercial raisonnable de votre projet, sauf demande de suppression de votre part.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">Partage des données</h2>
            <p>Vos données ne sont pas revendues. Elles peuvent être traitées par les outils techniques nécessaires au fonctionnement du site, à l’envoi d’emails, au stockage sécurisé des demandes et à l’analyse du projet immobilier.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">Vos droits</h2>
            <p>Vous pouvez demander l’accès, la rectification ou la suppression de vos données personnelles en écrivant à <a href="mailto:alex@alexlopez-provence.fr" className="text-brand hover:underline">alex@alexlopez-provence.fr</a>.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">Cookies et mesure d’audience</h2>
            <p>Si des outils de mesure d’audience ou de suivi sont ajoutés, cette page sera mise à jour pour préciser leur fonctionnement et les choix disponibles.</p>
          </section>
        </div>
      </div>
    </main>
  )
}
