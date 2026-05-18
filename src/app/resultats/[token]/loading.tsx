import { Check } from 'lucide-react'

const STEPS = [
  'Analyse des données saisies',
  'Vérification du contexte local',
  'Préparation de vos résultats',
]

export default function ResultatsLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 font-sans text-foreground">
      <section className="w-full max-w-sm rounded-3xl border border-border bg-white p-7 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-3xl">
          📊
        </div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Outil Alexandre Lopez</p>
        <h1 className="mb-3 text-xl font-black tracking-[-0.03em]">Préparation de vos résultats</h1>
        <p className="mb-6 text-sm leading-relaxed text-muted">
          On garde le client dans la même attente : vos données sont traitées avant l’affichage final.
        </p>
        <div className="space-y-3 text-left">
          {STEPS.map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-sm font-medium text-foreground">
              <span className={'flex h-6 w-6 shrink-0 items-center justify-center rounded-full ' + (index === 2 ? 'bg-brand-light text-brand' : 'bg-emerald-50 text-emerald-600')}>
                {index === 2 ? <span className="h-2 w-2 rounded-full bg-brand" /> : <Check size={13} />}
              </span>
              {step}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
