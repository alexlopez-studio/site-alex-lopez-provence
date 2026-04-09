import Link from 'next/link'
import { Phone, Mail, Instagram, Linkedin, Facebook } from 'lucide-react'

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'
const EMAIL = 'alex@alexlopez-provence.fr'

const SOCIAL_LINKS = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
]

export function Footer() {
  const year = new Date().getFullYear()

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
                Mandataire IAD
              </p>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Mandataire immobilier IAD en Provence Verte et Haut-Var.
              Vente et achat immobilier dans le Var.
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground mb-5">
              Contact
            </p>
            <div className="space-y-3">
              <a
                href={'tel:' + PHONE_RAW}
                className="flex items-center gap-2.5 text-sm text-muted hover:text-brand transition-colors"
              >
                <Phone size={14} className="shrink-0" />
                {PHONE_DISPLAY}
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
              Retrouvez-moi
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
            © {year} Alex Lopez · Mandataire indépendant IAD France ·{' '}
            IAD France SAS — 40 rue de Paradis, 75010 Paris
          </p>
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/mentions-legales" className="text-xs text-muted hover:text-foreground transition-colors">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="text-xs text-muted hover:text-foreground transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
