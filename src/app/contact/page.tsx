import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { env } from '@/lib/env'
import { ContactFormClient } from '@/components/forms/ContactFormClient'
import { siteVisuals } from '@/lib/site-visuals'

export const metadata: Metadata = {
  title: 'Contact — Alexandre Lopez, conseiller immobilier iad Provence Verte & Verdon',
  description:
    'Contactez Alexandre Lopez, conseiller immobilier iad France en Provence Verte et Verdon. Estimation gratuite, réponse sous 24h. Appelez le 06 13 18 01 68.',
  alternates: { canonical: (env.app.siteUrl || 'https://alexlopez-provence.fr') + '/contact' },
}

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'
const EMAIL = 'alex@alexlopez-provence.fr'

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact — Alexandre Lopez conseiller immobilier iad France',
  url: (env.app.siteUrl || 'https://alexlopez-provence.fr') + '/contact',
  mainEntity: {
    '@type': 'Person',
    name: 'Alexandre Lopez',
    jobTitle: 'Conseiller immobilier iad France',
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

      <section className="relative overflow-hidden bg-[#f4f7f8] px-6 pb-16 pt-28 lg:pb-24 lg:pt-36">
        <div className="absolute right-0 top-0 h-[34rem] w-[34rem] translate-x-1/3 rounded-full bg-brand-light/70 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-white blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
              <MapPin size={15} className="text-brand" /> Provence Verte & Verdon
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.04] tracking-[-0.05em] text-foreground md:text-6xl lg:text-7xl">
              Parlons de votre <span className="text-brand">projet immobilier</span>.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              Estimation, vente, achat ou simple question sur le marché local. Je vous réponds personnellement avec une première lecture claire, sans engagement.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="#message" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-bold text-white shadow-[0_14px_30px_rgba(0,180,236,0.24)] transition-all hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_18px_40px_rgba(0,180,236,0.32)]">Envoyer un message <ArrowRight size={18} /></Link>
              <a href={'tel:' + PHONE_RAW} className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand px-7 py-4 text-sm font-bold text-brand transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-white"><Phone size={16} /> {PHONE_DISPLAY}</a>
            </div>
          </div>

          <div className="relative mx-auto min-h-[30rem] w-full max-w-[34rem] overflow-hidden rounded-[2rem] shadow-2xl lg:ml-auto">
            <Image src={siteVisuals.contactVillage.src} alt={siteVisuals.contactVillage.alt} fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101828]/72 via-[#101828]/12 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/92 px-5 py-4 shadow-xl backdrop-blur">
              <p className="text-sm font-bold text-foreground">Réponse personnalisée</p>
              <p className="text-xs text-muted">Par téléphone, email ou rendez-vous</p>
            </div>
          </div>
        </div>
      </section>

      <section id="message" className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[1fr_25rem]">
          <div className="rounded-2xl bg-[#f4f7f8] p-6 shadow-sm md:p-8">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-brand">Message</p>
            <h2 className="mb-2 text-3xl font-bold tracking-[-0.04em] text-foreground">Envoyez-moi les grandes lignes.</h2>
            <p className="mb-8 text-sm leading-relaxed text-muted">Je vous réponds sous 24h avec un premier retour clair.</p>
            <ContactFormClient />
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl bg-[#101828] p-6 text-white shadow-xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-brand-light">Rendez-vous</p>
              <h3 className="text-xl font-bold">Choisir un créneau</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">30 minutes par téléphone ou visio pour cadrer votre besoin.</p>
              <a href={calUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-hover">
                <Calendar size={15} /> Réserver un créneau
              </a>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-foreground">Coordonnées</p>
              <div className="space-y-4">
                <a href={'tel:' + PHONE_RAW} className="flex items-center gap-3 text-sm font-bold text-foreground transition-colors hover:text-brand"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand"><Phone size={16} /></span>{PHONE_DISPLAY}</a>
                <a href={'mailto:' + EMAIL} className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-brand"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand"><Mail size={16} /></span>{EMAIL}</a>
                <div className="flex items-center gap-3 text-sm text-muted"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand"><MapPin size={16} /></span>Provence Verte & Verdon (Var, 83)</div>
                <div className="flex items-center gap-3 text-sm text-muted"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand"><Clock size={16} /></span>Réponse sous 24h</div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#f4f7f8] p-6 text-center">
              <p className="text-sm text-muted">Vous ne me connaissez pas encore ?</p>
              <Link href="/a-propos" className="mt-2 inline-flex text-sm font-bold text-brand hover:underline">Découvrir mon approche →</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
