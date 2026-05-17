import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { env } from '@/lib/env'
import { ContactFormClient } from '@/components/forms/ContactFormClient'

export const metadata: Metadata = {
  title: 'Contact — Alex Lopez, Mandataire IAD Provence Verte & Verdon',
  description:
    'Contactez Alex Lopez, mandataire IAD en Provence Verte et Verdon. Estimation gratuite, réponse sous 24h. Appelez le 06 13 18 01 68.',
  alternates: { canonical: (env.app.siteUrl || 'https://alexlopez-provence.fr') + '/contact' },
}

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'
const EMAIL = 'alex@alexlopez-provence.fr'

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact — Alex Lopez Mandataire IAD',
  url: (env.app.siteUrl || 'https://alexlopez-provence.fr') + '/contact',
  mainEntity: {
    '@type': 'Person',
    name: 'Alex Lopez',
    jobTitle: 'Mandataire immobilier IAD',
    telephone: PHONE_RAW,
    email: EMAIL,
    areaServed: 'Provence Verte et Verdon',
  },
}

function buildInnerHtml(data: object) {
  return { __html: JSON.stringify(data) }
}

export default function ContactPage() {
  const calUrl = process.env.NEXT_PUBLIC_CALCOM_URL || 'https://cal.com/alex-lopez/consultation-gratuite'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={buildInnerHtml(contactJsonLd)} />

      <section className="relative overflow-hidden bg-paper px-6 py-20 lg:py-24">
        <div className="absolute left-0 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-light/70 blur-3xl" />
        <div className="relative mx-auto max-w-[75rem] text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Contact</p>
          <h1 className="font-serif text-4xl font-medium leading-[1.03] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
            Parlons de votre projet immobilier.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Estimation, vente, achat ou simple question sur le marché local en Provence Verte & Verdon. Je vous réponds personnellement, sans engagement.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-[75rem] items-start gap-10 lg:grid-cols-[1fr_25rem]">
          <div className="rounded-[2rem] border border-border bg-paper p-6 shadow-sm md:p-8">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Message</p>
            <h2 className="mb-2 text-2xl font-bold tracking-[-0.035em] text-foreground">Envoyez-moi les grandes lignes.</h2>
            <p className="mb-8 text-sm leading-relaxed text-muted">Je vous réponds sous 24h avec un premier retour clair.</p>
            <ContactFormClient />
          </div>

          <aside className="space-y-5">
            <div className="rounded-[1.7rem] border border-border bg-foreground p-6 text-white shadow-xl">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-light">Rendez-vous</p>
              <h3 className="text-xl font-bold tracking-[-0.025em]">Choisir un créneau</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">30 minutes par téléphone ou visio pour cadrer votre besoin.</p>
              <a href={calUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover">
                <Calendar size={15} /> Réserver un créneau
              </a>
            </div>

            <div className="rounded-[1.7rem] border border-border bg-white p-6 shadow-sm">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">Coordonnées</p>
              <div className="space-y-4">
                <a href={'tel:' + PHONE_RAW} className="flex items-center gap-3 text-sm font-semibold text-foreground transition-colors hover:text-brand"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand"><Phone size={16} /></span>{PHONE_DISPLAY}</a>
                <a href={'mailto:' + EMAIL} className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-brand"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand"><Mail size={16} /></span>{EMAIL}</a>
                <div className="flex items-center gap-3 text-sm text-muted"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand"><MapPin size={16} /></span>Provence Verte & Verdon (Var, 83)</div>
                <div className="flex items-center gap-3 text-sm text-muted"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand"><Clock size={16} /></span>Réponse sous 24h</div>
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-border bg-paper p-6 text-center">
              <p className="text-sm text-muted">Vous ne me connaissez pas encore ?</p>
              <Link href="/a-propos" className="mt-2 inline-flex text-sm font-semibold text-brand hover:underline">Découvrir mon approche →</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
