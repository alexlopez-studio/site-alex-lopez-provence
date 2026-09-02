import Link from 'next/link'

/**
 * Encart des articles de blog.
 *
 * Sortie unique du site (refonte 2026-09, §4) : le guide. L'encart ne propose
 * donc plus ni prise de rendez-vous Cal.com ni estimation — l'estimation vient
 * ensuite, par la sequence de nurturing, jamais comme appel a l'action ici.
 */
export default function SidebarCTA() {
  return (
    <div className="rounded-2xl bg-foreground p-6">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
        Vendre sans agence
      </p>
      <p className="mb-2 text-[18px] font-bold leading-[1.3] text-white">
        Le guide du vendeur particulier
      </p>
      <p className="mb-5 text-[13px] leading-[1.5] text-white/70">
        La méthode complète pour vendre au juste prix en Provence et sur la Côte d’Azur. Gratuit,
        contre votre prenom et votre email.
      </p>
      <Link
        href="/vendre-sans-agence"
        className="block w-full rounded-full bg-brand py-3.5 text-center text-[15px] font-semibold text-white transition-colors hover:bg-brand-hover"
      >
        Télécharger le guide
      </Link>
    </div>
  )
}
