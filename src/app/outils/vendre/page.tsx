'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Loader2, MapPin, Phone, RefreshCw, Send } from 'lucide-react'
import { useVendreStore, type VendreAnswers } from '@/stores/vendreStore'

const PHONE_RAW = '+33613180168'

type SubmitState = 'form' | 'submitting' | 'success'

type AdresseSuggestion = {
  label: string
  lat: number
  lng: number
}

type AdresseInfos = {
  dpe?: { lettre?: string; numero?: string; annee_construction?: number }
  parcelle?: { id?: string; commune?: string; surface?: number | null }
}

const TYPE_BIEN = [
  ['maison', 'Maison'],
  ['appartement', 'Appartement'],
  ['terrain', 'Terrain'],
  ['immeuble', 'Immeuble'],
]

const ETATS = [
  ['neuf', 'Neuf / récent'],
  ['tres_bon_etat', 'Très bon état'],
  ['bon_etat', 'Bon état'],
  ['rafraichir', 'À rafraîchir'],
  ['travaux', 'Travaux importants'],
]

const DPE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'nc']

const DELAIS = [
  ['immediat', 'Immédiat'],
  ['1_3_mois', '1 à 3 mois'],
  ['3_6_mois', '3 à 6 mois'],
  ['6_mois', '+6 mois'],
  ['pas_decide', 'Pas encore décidé'],
]

const EQUIPEMENTS = ['Balcon', 'Terrasse', 'Parking', 'Garage', 'Cave', 'Jardin', 'Vue exceptionnelle', 'Piscine']

export default function VendrePage() {
  const router = useRouter()
  const { answers, setAnswer, reset } = useVendreStore()
  const [state, setState] = useState<SubmitState>('form')
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  async function handleSubmit(contact: Pick<VendreAnswers, 'civilite' | 'prenom' | 'nom' | 'telephone' | 'email'>) {
    const nextToken = crypto.randomUUID()
    const finalAnswers: VendreAnswers = {
      ...answers,
      ...contact,
      rgpd: true,
    }

    setError(null)
    setToken(nextToken)
    setState('submitting')

    for (const [key, value] of Object.entries(finalAnswers) as Array<[keyof VendreAnswers, VendreAnswers[keyof VendreAnswers]]>) {
      setAnswer(key, value)
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...finalAnswers,
          token: nextToken,
          type: 'vendre',
          opt_in: true,
        }),
      })

      const payload = await safeJson(res)
      if (!res.ok || payload?.success === false) {
        throw new Error(typeof payload?.error === 'string' ? payload.error : 'soumission échouée')
      }

      setState('success')
      window.setTimeout(() => router.push('/resultats/' + nextToken), 900)
    } catch (err) {
      console.error('[outil vendre] soumission impossible :', err)
      setState('form')
      setToken(null)
      setError("Je n’ai pas pu finaliser l’estimation pour le moment. Vérifiez votre connexion puis réessayez. Si le problème persiste, contactez-moi directement.")
    }
  }

  if (state === 'submitting' || state === 'success') {
    return <SubmittingScreen done={state === 'success'} token={token} />
  }

  return (
    <main className="min-h-screen bg-surface px-5 py-6 text-foreground">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-brand">
            <ArrowLeft size={16} /> Retour
          </Link>
          <a href={'tel:' + PHONE_RAW} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
            <Phone size={15} className="text-brand" /> 06 13 18 01 68
          </a>
        </header>

        <section className="mb-6 rounded-3xl border border-border bg-white p-7 shadow-sm md:p-9">
          <div className="mb-6 inline-flex rounded-full bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-brand">
            Estimation vendeur
          </div>
          <h1 className="mb-4 font-serif text-4xl font-medium leading-tight tracking-[-0.04em] md:text-5xl">
            Obtenir une première estimation de votre bien
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-muted md:text-base">
            Renseignez les informations clés de votre maison ou appartement. Le calcul est lancé côté serveur, le dossier est sauvegardé en backup Notion, puis vous êtes redirigé vers votre résultat personnalisé.
          </p>
        </section>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
            {error}
          </div>
        )}

        <VendreForm answers={answers} setAnswer={setAnswer} onSubmit={handleSubmit} onReset={reset} />
      </div>
    </main>
  )
}

function VendreForm({
  answers,
  setAnswer,
  onSubmit,
  onReset,
}: {
  answers: VendreAnswers
  setAnswer: (key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers]) => void
  onSubmit: (contact: Pick<VendreAnswers, 'civilite' | 'prenom' | 'nom' | 'telephone' | 'email'>) => void
  onReset: () => void
}) {
  const [civilite, setCivilite] = useState<'monsieur' | 'madame'>(answers.civilite ?? 'monsieur')
  const [prenom, setPrenom] = useState(answers.prenom ?? '')
  const [nom, setNom] = useState(answers.nom ?? '')
  const [telephone, setTelephone] = useState(answers.telephone ?? '')
  const [email, setEmail] = useState(answers.email ?? '')
  const [rgpd, setRgpd] = useState(Boolean(answers.rgpd))
  const [showValidation, setShowValidation] = useState(false)

  const canSubmit = useMemo(() => {
    return Boolean(
      answers.adresse &&
      answers.lat &&
      answers.lng &&
      answers.type_bien &&
      answers.surface &&
      answers.nb_pieces &&
      answers.etat &&
      answers.dpe &&
      answers.delai &&
      prenom.trim() &&
      nom.trim() &&
      telephone.trim() &&
      email.trim() &&
      rgpd,
    )
  }, [answers, prenom, nom, telephone, email, rgpd])

  function submit() {
    setShowValidation(true)
    if (!canSubmit) return
    onSubmit({
      civilite,
      prenom: prenom.trim(),
      nom: nom.trim(),
      telephone: telephone.trim(),
      email: email.trim(),
    })
  }

  return (
    <section className="space-y-5 rounded-3xl border border-border bg-white p-5 shadow-sm md:p-7">
      <AdresseField answers={answers} setAnswer={setAnswer} />

      <Step title="2. Type de bien">
        <ChoiceGrid options={TYPE_BIEN} value={answers.type_bien} onChange={(value) => setAnswer('type_bien', value)} />
        {answers.type_bien === 'maison' && (
          <ChoiceGrid
            className="mt-3"
            options={[
              ['individuelle', 'Maison individuelle'],
              ['mitoyenne', 'Maison mitoyenne'],
              ['maison_village', 'Maison de village'],
            ]}
            value={answers.sous_type}
            onChange={(value) => setAnswer('sous_type', value)}
          />
        )}
      </Step>

      <Step title="3. Surfaces et pièces">
        <div className="grid gap-3 md:grid-cols-3">
          <NumberInput label="Surface habitable" suffix="m²" value={answers.surface} onChange={(value) => setAnswer('surface', value)} />
          <NumberInput label="Terrain / extérieur" suffix="m²" value={answers.surface_terrain} onChange={(value) => setAnswer('surface_terrain', value)} />
          <NumberInput label="Pièces principales" value={answers.nb_pieces} onChange={(value) => setAnswer('nb_pieces', value)} />
        </div>
      </Step>

      <Step title="4. État, DPE et projet de vente">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>État général</Label>
            <ChoiceGrid options={ETATS} value={answers.etat} onChange={(value) => setAnswer('etat', value)} />
          </div>
          <div>
            <Label>DPE</Label>
            <div className="grid grid-cols-4 gap-2">
              {DPE.map((item) => (
                <button key={item} type="button" onClick={() => setAnswer('dpe', item)} className={choiceClass(answers.dpe === item)}>
                  {item === 'nc' ? 'NC' : item}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Label>Délai envisagé</Label>
          <ChoiceGrid options={DELAIS} value={answers.delai} onChange={(value) => setAnswer('delai', value)} />
        </div>
      </Step>

      <Step title="5. Équipements">
        <div className="grid gap-2 md:grid-cols-4">
          {EQUIPEMENTS.map((item) => {
            const active = answers.equipements?.includes(item) ?? false
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  const current = answers.equipements ?? []
                  setAnswer('equipements', active ? current.filter((entry) => entry !== item) : [...current, item])
                }}
                className={choiceClass(active)}
              >
                {item}
              </button>
            )
          })}
        </div>
      </Step>

      <Step title="6. Coordonnées">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-2 md:col-span-2">
            <button type="button" onClick={() => setCivilite('monsieur')} className={choiceClass(civilite === 'monsieur')}>Monsieur</button>
            <button type="button" onClick={() => setCivilite('madame')} className={choiceClass(civilite === 'madame')}>Madame</button>
          </div>
          <TextInput label="Prénom" value={prenom} onChange={setPrenom} />
          <TextInput label="Nom" value={nom} onChange={setNom} />
          <TextInput label="Email" type="email" value={email} onChange={setEmail} />
          <TextInput label="Téléphone" type="tel" value={telephone} onChange={setTelephone} />
        </div>
        <button
          type="button"
          onClick={() => setRgpd(!rgpd)}
          className={'mt-4 flex w-full items-start gap-3 rounded-2xl border p-4 text-left text-sm leading-6 transition ' + (rgpd ? 'border-brand bg-brand-light text-foreground' : 'border-border bg-surface text-muted')}
        >
          <span className={'mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ' + (rgpd ? 'border-brand bg-brand text-white' : 'border-border bg-white')}>
            {rgpd && <Check size={13} />}
          </span>
          <span>J’accepte que mes données soient transmises à Alexandre Lopez pour être recontacté dans le cadre de cette estimation.</span>
        </button>
      </Step>

      {showValidation && !canSubmit && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Merci de compléter les champs obligatoires avant de lancer l’estimation.
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-border pt-5 md:flex-row">
        <button
          type="button"
          onClick={submit}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark"
        >
          Lancer mon estimation <Send size={16} />
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-5 py-4 text-sm font-semibold text-muted transition hover:text-foreground"
        >
          <RefreshCw size={16} /> Recommencer
        </button>
      </div>
    </section>
  )
}

function AdresseField({ answers, setAnswer }: { answers: VendreAnswers; setAnswer: (key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers]) => void }) {
  const [value, setValue] = useState(answers.adresse ?? '')
  const [suggestions, setSuggestions] = useState<AdresseSuggestion[]>([])
  const [infos, setInfos] = useState<AdresseInfos | null>(null)
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function search(query: string) {
    if (query.trim().length < 3) {
      setSuggestions([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch('https://api-adresse.data.gouv.fr/search/?q=' + encodeURIComponent(query) + '&limit=5')
      const json = await res.json()
      const next = Array.isArray(json.features)
        ? json.features.map((feature: { properties?: { label?: string }; geometry?: { coordinates?: number[] } }) => ({
            label: feature.properties?.label ?? '',
            lat: feature.geometry?.coordinates?.[1] ?? 0,
            lng: feature.geometry?.coordinates?.[0] ?? 0,
          })).filter((item: AdresseSuggestion) => item.label && item.lat && item.lng)
        : []
      setSuggestions(next)
    } catch {
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  async function pick(item: AdresseSuggestion) {
    setValue(item.label)
    setSuggestions([])
    setInfos(null)
    setAnswer('adresse', item.label)
    setAnswer('lat', item.lat)
    setAnswer('lng', item.lng)

    try {
      const res = await fetch('/api/adresse-infos?lat=' + item.lat + '&lng=' + item.lng + '&q=' + encodeURIComponent(item.label))
      if (!res.ok) return
      const data = await res.json()
      setInfos(data)
      if (data?.dpe?.lettre) {
        setAnswer('dpe', data.dpe.lettre)
        setAnswer('dpe_verifie', true)
      }
      if (data?.dpe?.numero) setAnswer('numero_dpe', data.dpe.numero)
      if (data?.dpe?.annee_construction) setAnswer('annee_construction', data.dpe.annee_construction)
      if (data?.parcelle?.surface) setAnswer('cadastre_surface', data.parcelle.surface)
    } catch {
      // Les enrichissements sont utiles mais non bloquants pour l’estimation.
    }
  }

  function onChange(next: string) {
    setValue(next)
    setInfos(null)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => search(next), 300)
  }

  function validateManualAddress() {
    if (!value.trim()) return
    setAnswer('adresse', value.trim())
  }

  return (
    <Step title="1. Adresse du bien">
      <div className="relative">
        <div className="flex gap-2">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onBlur={validateManualAddress}
            placeholder="Ex : 12 rue de la Paix, Cotignac"
            className="min-w-0 flex-1 rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-brand focus:bg-white"
          />
          <button type="button" onClick={validateManualAddress} className="rounded-2xl bg-brand px-4 text-white">
            <MapPin size={18} />
          </button>
        </div>
        {loading && <p className="mt-2 text-xs text-muted">Recherche d’adresse...</p>}
        {suggestions.length > 0 && (
          <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
            {suggestions.map((item) => (
              <button key={item.label} type="button" onClick={() => pick(item)} className="flex w-full items-center gap-2 border-b border-border px-4 py-3 text-left text-sm last:border-b-0 hover:bg-surface">
                <MapPin size={14} className="text-brand" /> {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {infos && (
        <div className="mt-3 rounded-2xl bg-brand-light p-4 text-sm leading-6 text-foreground">
          {infos.dpe?.lettre && <p>⚡ DPE retrouvé : <strong>{infos.dpe.lettre}</strong></p>}
          {infos.parcelle?.surface && <p>🗺️ Surface parcelle cadastrale : <strong>{infos.parcelle.surface} m²</strong></p>}
        </div>
      )}
    </Step>
  )
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-4">
      <h2 className="mb-3 text-sm font-bold text-foreground">{title}</h2>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">{children}</label>
}

function ChoiceGrid({ options, value, onChange, className = '' }: { options: string[][]; value?: string; onChange: (value: string) => void; className?: string }) {
  return (
    <div className={'grid gap-2 md:grid-cols-2 ' + className}>
      {options.map(([optionValue, label]) => (
        <button key={optionValue} type="button" onClick={() => onChange(optionValue)} className={choiceClass(value === optionValue)}>
          {label}
        </button>
      ))}
    </div>
  )
}

function choiceClass(active: boolean) {
  return 'rounded-2xl border px-4 py-3 text-sm font-semibold transition ' + (active ? 'border-brand bg-brand text-white shadow-sm' : 'border-border bg-white text-foreground hover:border-brand')
}

function TextInput({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <Label>{label} *</Label>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-brand focus:bg-white" />
    </label>
  )
}

function NumberInput({ label, value, onChange, suffix }: { label: string; value?: number | null; onChange: (value: number | undefined) => void; suffix?: string }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <div className="flex items-center rounded-2xl border border-border bg-white px-4 py-3 focus-within:border-brand">
        <input type="number" min={0} value={value ?? ''} onChange={(event) => onChange(event.target.value === '' ? undefined : Number(event.target.value))} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
        {suffix && <span className="text-xs font-semibold text-muted">{suffix}</span>}
      </div>
    </label>
  )
}

function SubmittingScreen({ done, token }: { done: boolean; token: string | null }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 text-center">
      <div className="max-w-md rounded-3xl border border-border bg-white p-8 shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-brand">
          {done ? <Check size={28} /> : <Loader2 size={28} className="animate-spin" />}
        </div>
        <h1 className="mb-3 font-serif text-3xl font-medium tracking-[-0.04em] text-foreground">
          {done ? 'Dossier prêt' : 'Calcul de votre estimation'}
        </h1>
        <p className="text-sm leading-7 text-muted">
          {done
            ? 'Le calcul et la sauvegarde sont terminés. Redirection vers votre résultat personnalisé...'
            : 'Nous calculons l’estimation côté serveur et sauvegardons le dossier avant d’afficher le résultat.'}
        </p>
        {token && <p className="mt-5 rounded-2xl bg-surface px-4 py-3 text-xs text-muted">Référence : {token}</p>}
      </div>
    </main>
  )
}

async function safeJson(res: Response): Promise<Record<string, unknown> | null> {
  try {
    return (await res.json()) as Record<string, unknown>
  } catch {
    return null
  }
}
