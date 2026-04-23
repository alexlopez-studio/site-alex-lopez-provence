import Link from 'next/link'
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
    <footer className="bg-surface border-t border-border">
      <div className="max-w-[75rem] mx-auto px-6 py-14">

        {/* Grille principale */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="mb-4">
              <p className="text-[15px] font-black text-foreground">Alex Lopez</p>
              <p className="text-[10px] font-semibold text-brand uppercase tracking-[0.16em]">
                {t('brandLine2')}
              </p>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              {t('tagline')}
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground mb-5">
              {t('contactTitle')}
            </p>
            <div className="space-y-3">
              <a
                href={'tel:' + PHONE_RAW}
                className="flex items-center gap-2.5 text-sm text-muted hover:text-brand transition-colors"
              >
                <Phone size={14} className="shrink-0" />
                {phoneDisplay}
              </a>
              <a
                href={'mailto:' + EMAIL}
                className="flex items-center gap-2.5 text-sm text-muted hover:text-brand transition-colors"
              >
                <Mail size={14} className="shrink-0" />
                {EMAIL}
              </a>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground mb-5">
              {t('socialTitle')}
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(function (s) {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-brand hover:border-brand transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
          </div>

        </div>

        {/* Barre du bas */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted text-center sm:text-left">
            {t('copyright', { year: year })}
          </p>
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/mentions-legales" className="text-xs text-muted hover:text-foreground transition-colors">
              {t('legalMentions')}
            </Link>
            <Link href="/politique-confidentialite" className="text-xs text-muted hover:text-foreground transition-colors">
              {t('privacy')}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
