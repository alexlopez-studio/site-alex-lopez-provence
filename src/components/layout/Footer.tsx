import Link from 'next/link'

const LINKS_SERVICES = [
  { label: 'Vendre', href: '/assistant' },
  { label: 'Acheter', href: '/assistant' },
  { label: 'Audit immobilier express', href: '/assistant' },
  { label: 'Consulter les biens', href: '/biens' },
]

const LINKS_INFO = [
  { label: 'Mon approche', href: '/a-propos' },
  { label: 'Avis clients', href: '/avis' },
  { label: 'Blog', href: '/blog' },
  { label: 'Marché immobilier', href: '/marche' },
]

const LINKS_LEGAL = [
  { label: 'Contact', href: '/contact' },
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Politique de confidentialité', href: '/politique-confidentialite' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="font-black text-xl mb-3">
              <span className="text-brand">■</span> Alex Lopez
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Mandataire IAD Provence
              <br />
              Haut-Var &amp; Verdon
            </p>
            <p className="mt-4 text-xs text-white/40">
              Réseau IAD France
              <br />
              RSAC 123 456 789
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {LINKS_SERVICES.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Informations
            </h3>
            <ul className="space-y-2">
              {LINKS_INFO.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Contact &amp; Légal
            </h3>
            <ul className="space-y-2">
              {LINKS_LEGAL.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <p>© {year} Alex Lopez — Tous droits réservés.</p>
          <p>Mandataire immobilier indépendant — Réseau IAD France</p>
        </div>
      </div>
    </footer>
  )
}
