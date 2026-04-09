import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Calendar } from 'lucide-react'
import { env } from '@/lib/env'
import { ContactFormClient } from '@/components/forms/ContactFormClient'

export const metadata: Metadata = {
  title: 'Contact — Alex Lopez, Mandataire IAD Provence Verte',
  description:
    'Contactez Alex Lopez, mandataire IAD en Provence Verte et Haut-Var. Estimation gratuite, réponse sous 24h. Appelez le 06 13 18 01 68.',
  alternates: { canonical: (env.siteUrl || 'https://alexlopez-provence.fr') + '/contact' },
}

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'
const EMAIL = 'alex@alexlopez-provence.fr'

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact — Alex Lopez Mandataire IAD',
  url: (env.siteUrl || 'https://alexlopez-provence.fr') + '/contact',
  mainEntity: {
    '@type': 'Person',
    name: 'Alex Lopez',
    jobTitle: 'Mandataire immobilier IAD',
    telephone: PHONE_RAW,
    email: EMAIL,
    areaServed: 'Provence Verte et Haut-Var',
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

      {/* ===== HERO ===== */}
      <section className="py-16 px-6 bg-surface">
        <div className="max-w-[75rem] mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-4">Contact</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 leading-tight">
            Parlons de <span className="text-brand">votre projet.</span>
          </h1>
          <p className="text-muted leading-relaxed max-w-xl mx-auto">
            Estimation gratuite, vente, achat ou simple question.
            Je vous réponds sous 24h, sans engagement.
          </p>
        </div>
      </section>

      {/* ===== CONTENU PRINCIPAL ===== */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-[75rem] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">

          {/* Formulaire */}
          <div>
            <h2 className="text-2xl font-extrabold text-foreground mb-2">Envoyez-moi un message</h2>
            <p className="text-sm text-muted mb-8">Je vous réponds personnellement sous 24h.</p>
            <ContactFormClient />
          </div>

          {/* Infos de contact */}
          <div className="space-y-6">

            {/* RDV Cal.com */}
            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">Consultation gratuite</p>
              <p className="text-base font-bold text-foreground mb-2">Prenez rendez-vous directement</p>
              <p className="text-sm text-muted mb-5 leading-relaxed">
                30 minutes par visio ou téléphone pour discuter de votre projet.
                Sans engagement.
              </p>
              <a
                href={calUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-full bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-hover transition-colors"
              >
                <Calendar size={15} />
                Réserver un créneau
              </a>
            </div>

            {/* Coordonnées */}
            <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground mb-4">Coordonnées</p>

              <a href={'tel:' + PHONE_RAW}
                className="flex items-center gap-3 text-sm font-semibold text-foreground hover:text-brand transition-colors">
                <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                  <Phone size={15} className="text-brand" />
                </div>
                {PHONE_DISPLAY}
              </a>

              <a href={'mailto:' + EMAIL}
                className="flex items-center gap-3 text-sm text-foreground hover:text-brand transition-colors">
                <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                  <Mail size={15} className="text-brand" />
                </div>
                {EMAIL}
              </a>

              <div className="flex items-center gap-3 text-sm text-muted">
                <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                  <MapPin size={15} className="text-brand" />
                </div>
                Provence Verte &amp; Haut-Var (Var, 83)
              </div>

              <div className="flex items-center gap-3 text-sm text-muted">
                <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                  <Clock size={15} className="text-brand" />
                </div>
                Disponible 7j/7 — Réponse sous 24h
              </div>
            </div>

            {/* Lien a-propos */}
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-sm text-muted mb-3">Vous ne me connaissez pas encore ?</p>
              <Link href="/a-propos" className="text-sm font-semibold text-brand hover:underline">
                Découvrir mon approche →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
