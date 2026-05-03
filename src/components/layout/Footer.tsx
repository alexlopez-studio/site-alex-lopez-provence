import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Phone, Mail, Instagram, Linkedin, Facebook } from 'lucide-react'

const PHONE_RAW = '+33613180168'
const EMAIL = 'alex@alexlopez-provence.fr'

const SOCIAL_LINKS = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
]

export async function Footer() {
  const t = await getTranslations('footer')
  const tCommon = await getTranslations('common')
  const year = new Date().getFullYear()
  const phoneDisplay = tCommon('phoneDisplay')

  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-[75rem] mx-auto px-6 py-14">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">

          <div>
            {/* Logo officiel Alexandre Lopez (PNG transparent, signature en noir).
                Sur fond sombre, on inverse les couleurs avec invert + brightness pour
                obtenir un rendu blanc lisible. Si le logo n'est pas réellement transparent
                ou si le rendu n'est pas satisfaisant, fournir une version blanche dédiée. */}
            <Image
              src="/Logo-alexandre-lopez.png"
              alt="Alexandre Lopez — Conseiller immobilier iad"
              width={500}
              height={500}
              className="h-24 w-auto mb-5 invert brightness-200 contrast-125"
            />
            <p className="text-sm text-white/75 leading-relaxed max-w-xs">
              {t('tagline')}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white mb-5">
              {t('contactTitle')}
            </p>
            <div className="space-y-3">
              <a href={'tel:' + PHONE_RAW} className="flex items-center gap-2.5 text-sm text-white/85 hover:text-white transition-colors">
                <Phone size={14} className="shrink-0" />
                {phoneDisplay}
              </a>
              <a href={'mailto:' + EMAIL} className="flex items-center gap-2.5 text-sm text-white/85 hover:text-white transition-colors">
                <Mail size={14} className="shrink-0" />
                {EMAIL}
              </a>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white mb-5">
                {t('socialTitle')}
              </p>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(function (s) {
                  const Icon = s.icon
                  return (
                    <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white/85 hover:text-white hover:border-white transition-colors">
                      <Icon size={16} />
                    </a>
                  )
                })}
              </div>
            </div>
            {/* Logo iad officiel (version blanche, transparent) */}
            <div className="flex items-end justify-start sm:justify-end">
              <Image
                src="/IAD_LOGO_BLANC.png"
                alt="iad immobilier"
                width={300}
                height={220}
                className="h-14 w-auto"
              />
            </div>
          </div>

        </div>

        <div className="border-t border-white/20 pt-6 mb-6">
          <p className="text-[11px] text-white/60 leading-relaxed">
            {t('legalText')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/70 text-center sm:text-left">
            {t('copyright', { year: year })}
          </p>
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/mentions-legales" className="text-xs text-white/70 hover:text-white transition-colors">
              {t('legalMentions')}
            </Link>
            <Link href="/politique-confidentialite" className="text-xs text-white/70 hover:text-white transition-colors">
              {t('privacy')}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
