import type { Metadata } from 'next'
import { env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Mentions légales — Alexandre Lopez',
  description: 'Mentions légales du site alexandrelopez.fr.',
  alternates: { canonical: (env.app.siteUrl || 'https://alexandrelopez.fr') + '/mentions-legales' },
}

export default function MentionsLegalesPage() {
  return (
    <main className="bg-white px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand">Informations légales</p>
        <h1 className="mb-8 text-3xl font-extrabold tracking-[-0.03em] text-foreground md:text-4xl">Mentions légales</h1>

        <div className="space-y-8 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">Éditeur du site</h2>
            <p>Le site alexandrelopez.fr est édité par Alexandre Lopez, conseiller en immobilier iad, exerçant en tant qu’agent commercial indépendant.</p>
            <p className="mt-2">Email : <a href="mailto:alex@alexlopez-provence.fr" className="text-brand hover:underline">alex@alexlopez-provence.fr</a></p>
            <p>Téléphone : <a href="tel:+33613180168" className="text-brand hover:underline">06 13 18 01 68</a></p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">Activité immobilière</h2>
            <p>Alexandre Lopez est mandataire indépendant en immobilier, sans détention de fonds, rattaché au réseau iad France.</p>
            <p className="mt-2">Les informations réglementaires complètes — numéro RSAC, ville d’immatriculation et carte de démarchage — seront complétées avant la mise en production définitive si nécessaire.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">Hébergement</h2>
            <p>Le site est hébergé par Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">Propriété intellectuelle</h2>
            <p>L’ensemble des contenus présents sur ce site — textes, visuels, structure, éléments graphiques — est protégé par le droit d’auteur. Toute reproduction ou réutilisation sans autorisation préalable est interdite.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">Responsabilité</h2>
            <p>Les informations diffusées sur ce site sont fournies à titre indicatif. Les estimations et outils proposés constituent une première aide à la décision et ne remplacent pas une analyse personnalisée ni les diagnostics obligatoires réalisés par des professionnels certifiés.</p>
          </section>
        </div>
      </div>
    </main>
  )
}
