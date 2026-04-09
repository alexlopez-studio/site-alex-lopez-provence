export default function SidebarCTA() {
  const calUrl = process.env.NEXT_PUBLIC_CALCOM_URL || 'https://cal.com/alex-lopez/consultation-gratuite'
  return (
    <div className="rounded-2xl bg-foreground p-6">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
        Un projet immobilier ?
      </p>
      <p className="mb-2 text-[18px] font-bold leading-[1.3] text-white">
        Je vous accompagne de A à Z
      </p>
      <p className="mb-5 text-[13px] leading-[1.5] text-white/70">
        Estimation gratuite, vente ou achat en Provence Verte et Haut-Var. Réponse sous 24h.
      </p>
      <a
        href={calUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-full bg-brand py-3.5 text-center text-[15px] font-semibold text-white transition-colors hover:bg-brand-hover"
      >
        Prendre rendez-vous
      </a>
    </div>
  )
}
