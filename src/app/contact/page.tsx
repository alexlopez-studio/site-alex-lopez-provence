import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Calendar, ArrowRight, MessageCircle, ShieldCheck, Award } from 'lucide-react'
import { env } from '@/lib/env'
import { Button } from '@/components/ui/button'
import { ContactFormClient } from '@/components/forms/ContactFormClient'

export const metadata: Metadata = {
  title: 'Contact — Alexandre Lopez, Conseiller immobilier iAD Provence & Côte d’Azur',
  description: 'Contactez Alexandre Lopez, conseiller immobilier iAD en Provence et sur la Côte d’Azur. Estimation gratuite, réponse sous 24h. Tél. 06 13 18 01 68.',
  alternates: { canonical: (env.app.siteUrl || 'https://alexlopez-provence.fr') + '/contact' },
}

const EYEBROW = 'text-[13px] font-bold uppercase tracking-[0.22em]'

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'
const EMAIL = 'alex@alexlopez-provence.fr'

const CONTACT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact — Alexandre Lopez Conseiller immobilier iAD',
  url: (env.app.siteUrl || 'https://alexlopez-provence.fr') + '/contact',
  mainEntity: {
    '@type': 'Person',
    name: 'Alexandre Lopez',
    jobTitle: 'Conseiller immobilier iAD',
    telephone: PHONE_RAW,
    email: EMAIL,
    areaServed: 'Provence et Côte d’Azur',
  },
}

const PILIERS = [
  { icon: MessageCircle, title: 'Réactivité', desc: 'Réponse sous 24 h, premier rendez-vous sous 48 h. Pas de chasse au numéro, pas de standardiste : vous m’avez directement.' },
  { icon: ShieldCheck, title: 'Confidentialité', desc: 'Vos informations restent strictement entre nous. Aucune diffusion, aucune mise en relation forcée. Discrétion totale.' },
  { icon: Award, title: 'Conseil objectif', desc: 'Aucune réponse formatée. J’écoute votre projet, j’évalue le contexte, je vous oriente même quand ce n’est pas dans mon intérêt immédiat.' },
] as const

function buildInnerHtml(data: object) {
  return { __html: JSON.stringify(data) }
}

export default function ContactPage() {
  const calUrl = process.env.NEXT_PUBLIC_CALCOM_URL || 'https://cal.com/alex-lopez/consultation-gratuite'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={buildInnerHtml(CONTACT_JSON_LD)} />

      {/* HERO */}
      <section className="relative paper-surface pt-32 md:pt-40 pb-14 md:pb-16" aria-label="Contact">
        <div className="max-w-[75rem] mx-auto px-6 text-center">
          <p className={EYEBROW + ' text-brand mb-5'}>Contact</p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] tracking-[-0.02em] text-foreground mb-6">
            Parlons de <span className="italic text-brand">votre projet.</span>
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-xl mx-auto">
            Estimation gratuite, vente, achat ou simple question : je vous réponds personnellement sous 24 h, sans engagement.
          </p>
        </div>
      </section>

      {/* FORM + SIDEBAR */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-[75rem] mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_400px] gap-10 lg:gap-12 items-start">
          <div className="rounded-3xl border border-border bg-surface p-7 md:p-10 shadow-sm">
            <p className={EYEBROW + ' text-brand mb-3'}>Formulaire</p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2 leading-tight">
              Envoyez-moi un message
            </h2>
            <p className="text-sm text-muted mb-7">Je vous réponds personnellement sous 24 h.</p>
            <ContactFormClient />
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-gradient-to-br from-brand to-brand-dark text-white p-7 shadow-lg">
              <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center mb-5">
                <Calendar size={18} className="text-white" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/85 mb-2">Consultation gratuite</p>
              <p className="font-serif text-xl font-semibold mb-3 leading-tight">Prenez rendez-vous directement</p>
              <p className="text-sm text-white/85 leading-relaxed mb-6">
                30 minutes par visio ou téléphone pour discuter de votre projet. Sans engagement.
              </p>
              <a href={calUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-white py-3 text-sm font-semibold text-brand-dark hover:bg-white/90 transition-colors">
                Réserver un créneau <ArrowRight size={15} />
              </a>
            </div>

            <div className="rounded-3xl border border-border bg-white p-7">
              <p className={EYEBROW + ' text-foreground mb-5'}>Coordonnées</p>
              <div className="space-y-4">
                <a href={'tel:' + PHONE_RAW} className="flex items-center gap-3 text-sm font-semibold text-foreground hover:text-brand transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center shrink-0 group-hover:bg-brand transition-colors">
                    <Phone size={15} className="text-brand group-hover:text-white transition-colors" />
                  </div>
                  {PHONE_DISPLAY}
                </a>
                <a href={'mailto:' + EMAIL} className="flex items-center gap-3 text-sm text-foreground hover:text-brand transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center shrink-0 group-hover:bg-brand transition-colors">
                    <Mail size={15} className="text-brand group-hover:text-white transition-colors" />
                  </div>
                  <span className="break-all">{EMAIL}</span>
                </a>
                <div className="flex items-center gap-3 text-sm text-muted">
                  <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                    <MapPin size={15} className="text-brand" />
                  </div>
                  Provence et Côte d’Azur (Var, 83)
                </div>
                <div className="flex items-center gap-3 text-sm text-muted">
                  <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                    <Clock size={15} className="text-brand" />
                  </div>
                  Disponible 7 j/7 — Réponse sous 24 h
                </div>
              </div>
            </div>

            <Link href="/a-propos" className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-5 hover:bg-white hover:shadow-md transition-all group">
              <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden border border-border bg-white">
                <Image src="/alexandre-lopez.jpg" alt="Alexandre Lopez" width={120} height={120} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted mb-1">Vous ne me connaissez pas encore ?</p>
                <p className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors flex items-center gap-1.5">
                  Découvrir mon approche
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </p>
              </div>
            </Link>
          </aside>
        </div>
      </section>

      {/* POURQUOI ME CONTACTER */}
      <section className="py-20 md:py-24 px-6 paper-surface">
        <div className="max-w-[75rem] mx-auto">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className={EYEBROW + ' text-brand mb-4'}>Pourquoi me contacter</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-[1.05] tracking-[-0.02em]">
              Trois engagements <span className="italic text-brand">simples</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PILIERS.map((pi) => {
              const Icon = pi.icon
              return (
                <div key={pi.title} className="text-center p-8 rounded-2xl bg-white border border-border">
                  <div className="w-14 h-14 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-5">
                    <Icon size={22} className="text-brand" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{pi.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{pi.desc}</p>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="primary">
              <a href={'tel:' + PHONE_RAW} className="inline-flex items-center gap-2">
                <Phone size={16} /> Appeler le {PHONE_DISPLAY}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
