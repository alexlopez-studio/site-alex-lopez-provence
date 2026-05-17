'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, ChevronLeft, Home, Phone, RotateCcw, Search, Send } from 'lucide-react'
import { useAcheterStore } from '@/stores/acheterStore'
import type { AcheterAnswers, AcheterQuestionId } from '@/stores/acheterStore'

const PHONE_RAW = '+33613180168'
const BRAND = '#0077B6'

const STEPS = [
  { n: 1, label: 'Projet', qs: ['type_bien', 'communes', 'budget_max', 'surface_min', 'nb_pieces_min'] },
  { n: 2, label: 'Critères', qs: ['criteres'] },
  { n: 3, label: 'Budget', qs: ['apport', 'accord_bancaire', 'primo_accedant', 'recapitulatif'] },
  { n: 4, label: 'Contact', qs: ['coordonnees', 'done'] },
]

const TYPE_BIEN = [
  { value: 'appartement', label: 'Appartement', icon: '🏢' },
  { value: 'maison', label: 'Maison', icon: '🏡' },
  { value: 'terrain', label: 'Terrain', icon: '🌿' },
  { value: 'commerce', label: 'Commerce', icon: '🏬' },
  { value: 'autre', label: 'Autre', icon: '···' },
]
const CRITERES = ['Stationnement indispensable', 'Extérieur indispensable', 'Travaux acceptés', 'Rez-de-chaussée accepté']
const BIEN_LBL: Record<string, string> = { appartement: 'Appartement', maison: 'Maison', terrain: 'Terrain', commerce: 'Commerce', autre: 'Autre' }

function getNext(q: AcheterQuestionId): AcheterQuestionId {
  const flow: Record<string, AcheterQuestionId> = {
    type_bien: 'communes',
    communes: 'budget_max',
    budget_max: 'surface_min',
    surface_min: 'nb_pieces_min',
    nb_pieces_min: 'criteres',
    criteres: 'apport',
    apport: 'accord_bancaire',
    accord_bancaire: 'primo_accedant',
    primo_accedant: 'recapitulatif',
    recapitulatif: 'coordonnees',
    coordonnees: 'done',
    done: 'done',
  }
  return flow[q] ?? 'done'
}

function getCurrentStep(q: AcheterQuestionId) {
  for (const step of STEPS) if (step.qs.includes(q)) return step.n
  return 1
}

function fmt(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n)
}

function ts() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function buildRecap(a: AcheterAnswers): string {
  const lines = ['Très bien, voici le récapitulatif de votre projet d’achat :', '']
  lines.push('🏠 ' + (BIEN_LBL[a.type_bien ?? ''] ?? 'Bien à préciser'))
  if (a.communes) lines.push('📍 Secteurs : ' + a.communes)
  if (a.budget_max) lines.push('💶 Budget maximum : ' + fmt(a.budget_max) + ' €')
  if (a.surface_min) lines.push('📐 Surface minimum : ' + a.surface_min + ' m²')
  if (a.nb_pieces_min) lines.push('🚪 Pièces minimum : ' + a.nb_pieces_min)
  if (a.criteres?.length) lines.push('✅ Critères : ' + a.criteres.join(', '))
  if (a.apport != null) lines.push('💰 Apport : ' + fmt(a.apport) + ' €')
  if (a.accord_bancaire) lines.push('🏦 Accord bancaire : ' + a.accord_bancaire)
  if (a.primo_accedant) lines.push('🔑 Primo-accédant : ' + a.primo_accedant)
  lines.push('', 'Ces informations sont-elles correctes ?')
  return lines.join('\n')
}

function getMsg(q: AcheterQuestionId, a: AcheterAnswers): string {
  switch (q) {
    case 'communes': return 'Dans quelle(s) commune(s) souhaitez-vous acheter ?'
    case 'budget_max': return 'Quel est votre budget maximum ?'
    case 'surface_min': return 'Quelle surface minimum recherchez-vous ?'
    case 'nb_pieces_min': return 'Combien de pièces minimum souhaitez-vous ?'
    case 'criteres': return 'Quels critères sont importants pour vous ?'
    case 'apport': return 'Passons au financement. Quel est votre apport disponible ?'
    case 'accord_bancaire': return 'Avez-vous déjà un accord de principe bancaire ?'
    case 'primo_accedant': return 'Êtes-vous primo-accédant ?'
    case 'recapitulatif': return buildRecap(a)
    case 'coordonnees': return 'Parfait. Pour recevoir votre synthèse, j’ai besoin de vos coordonnées.'
    default: return ''
  }
}

function Avatar() {
  return <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">AL</div>
}

function Stepper({ q }: { q: AcheterQuestionId }) {
  const current = getCurrentStep(q)
  return (
    <div className="mx-auto flex max-w-[680px] items-center px-5 pb-3 pt-2">
      {STEPS.map((step, index) => {
        const done = step.n < current
        const active = step.n === current
        return (
          <Fragment key={step.n}>
            <div className="flex flex-col items-center">
              <div className={'flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold ' + (done ? 'border-brand bg-brand text-white' : active ? 'border-brand bg-brand-light text-brand' : 'border-border bg-white text-muted')}>
                {done ? <Check size={12} /> : step.n}
              </div>
              <span className={'mt-1 text-[10px] font-semibold ' + (active ? 'text-brand' : 'text-muted')}>{step.label}</span>
            </div>
            {index < STEPS.length - 1 && <div className="mx-1 mb-4 h-[3px] flex-1 overflow-hidden rounded-full bg-border"><div className={'h-full rounded-full bg-brand ' + (step.n < current ? 'w-full' : 'w-0')} /></div>}
          </Fragment>
        )
      })}
    </div>
  )
}

export default function AcheterPage() {
  const router = useRouter()
  const { messages, currentQuestion, answers, addMessage, setAnswer, setQuestion, reset } = useAcheterStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, currentQuestion])

  function answer(key: keyof AcheterAnswers, value: AcheterAnswers[keyof AcheterAnswers], display: string) {
    const nextAnswers = { ...answers, [key]: value }
    setAnswer(key, value)
    if (display) addMessage({ from: 'user', text: display, timestamp: ts() })
    const next = getNext(currentQuestion)
    setTimeout(() => {
      const msg = getMsg(next, nextAnswers)
      if (msg) addMessage({ from: 'al', text: msg, timestamp: ts() })
      setQuestion(next)
    }, 320)
  }

  function submit(prenom: string, nom: string, telephone: string, email: string, civilite: 'monsieur' | 'madame') {
    setAnswer('prenom', prenom)
    setAnswer('nom', nom)
    setAnswer('telephone', telephone)
    setAnswer('email', email)
    setAnswer('civilite', civilite)
    addMessage({ from: 'user', text: prenom + ' ' + nom, timestamp: ts() })
    const token = crypto.randomUUID()
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...answers, prenom, nom, telephone, email, civilite, token, type: 'acheter', opt_in: true }),
    }).catch(() => null)
    router.push('/resultats/' + token)
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-white">
        <div className="mx-auto flex max-w-[680px] items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted"><ChevronLeft size={16} /></Link>
            <Avatar />
            <div>
              <p className="text-sm font-bold">Alex Lopez</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-brand"><Search size={11} /> Préparer mon achat</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={reset} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted"><RotateCcw size={12} /> Recommencer</button>
            <a href={'tel:' + PHONE_RAW} className="text-foreground"><Phone size={15} color={BRAND} /></a>
          </div>
        </div>
        <Stepper q={currentQuestion} />
      </header>

      <main className="mx-auto flex max-w-[680px] flex-col gap-4 px-5 pb-10 pt-36">
        {messages.map((message) => (
          <div key={message.id}>
            {message.from === 'al' ? (
              <div className="flex items-end gap-3">
                <Avatar />
                <div>
                  <div className="max-w-[84%] whitespace-pre-wrap rounded-2xl rounded-bl-md border border-border bg-white px-4 py-3 text-sm leading-relaxed">{message.text}</div>
                  <p className="mt-1 text-[10px] text-muted">{message.timestamp}</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div>
                  <div className="max-w-full whitespace-pre-wrap rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-sm font-medium leading-relaxed text-white">{message.text}</div>
                  <p className="mt-1 text-right text-[10px] text-muted">{message.timestamp}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {currentQuestion !== 'done' && <InputZone q={currentQuestion} onAnswer={answer} onSubmit={submit} />}
        <div ref={bottomRef} />
      </main>
    </div>
  )
}

function InputZone({ q, onAnswer, onSubmit }: {
  q: AcheterQuestionId
  onAnswer: (key: keyof AcheterAnswers, value: AcheterAnswers[keyof AcheterAnswers], display: string) => void
  onSubmit: (prenom: string, nom: string, telephone: string, email: string, civilite: 'monsieur' | 'madame') => void
}) {
  if (q === 'type_bien') return <ChoiceGrid options={TYPE_BIEN} onPick={(v, l) => onAnswer('type_bien', v, l)} />
  if (q === 'communes') return <TextInput placeholder="Ex : Barjols, Cotignac, Aups..." onSend={(v) => onAnswer('communes', v, v)} />
  if (q === 'budget_max') return <SliderInput unit="€" min={50000} max={2000000} step={10000} def={300000} format={fmt} onOk={(v) => onAnswer('budget_max', v, fmt(v) + ' €')} />
  if (q === 'surface_min') return <SliderInput unit="m²" min={20} max={500} step={5} def={80} onOk={(v) => onAnswer('surface_min', v, v + ' m²')} />
  if (q === 'nb_pieces_min') return <ChoiceGrid options={['1', '2', '3', '4', '5', '6+'].map((n) => ({ value: n, label: n, icon: '' }))} cols={3} onPick={(v, l) => onAnswer('nb_pieces_min', parseInt(v) || 6, l + ' pièce' + (parseInt(v) !== 1 ? 's' : ''))} />
  if (q === 'criteres') return <MultiSelect options={CRITERES} onOk={(sel) => onAnswer('criteres', sel, sel.length ? sel.join(', ') : 'Aucun critère particulier')} />
  if (q === 'apport') return <SliderInput unit="€" min={0} max={500000} step={5000} def={30000} format={fmt} onOk={(v) => onAnswer('apport', v, fmt(v) + ' €')} />
  if (q === 'accord_bancaire') return <ChoiceGrid options={[{ value: 'Oui', label: 'Oui', icon: '✅' }, { value: 'Non', label: 'Non', icon: '❌' }, { value: 'En cours', label: 'En cours', icon: '⏳' }]} onPick={(v, l) => onAnswer('accord_bancaire', v, l)} />
  if (q === 'primo_accedant') return <ChoiceGrid options={[{ value: 'Oui', label: 'Oui', icon: '✅' }, { value: 'Non', label: 'Non', icon: '❌' }]} onPick={(v, l) => onAnswer('primo_accedant', v, l)} />
  if (q === 'recapitulatif') return <button className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white" onClick={() => onAnswer('recapitulatif' as keyof AcheterAnswers, true, "C'est correct ✅")}>C’est correct</button>
  if (q === 'coordonnees') return <ContactForm cta="Recevoir ma synthèse" onSubmit={onSubmit} />
  return null
}

function ChoiceGrid({ options, cols = 2, onPick }: { options: { value: string; label: string; icon: string }[]; cols?: 2 | 3; onPick: (value: string, label: string) => void }) {
  return (
    <div className={'grid gap-2 ' + (cols === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
      {options.map((option) => (
        <button key={option.value} onClick={() => onPick(option.value, option.label)} className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-border bg-white px-3 py-4 text-sm font-semibold text-foreground transition hover:border-brand hover:bg-brand-light">
          {option.icon && <span className="text-xl">{option.icon}</span>}
          {option.label}
        </button>
      ))}
    </div>
  )
}

function TextInput({ placeholder, onSend }: { placeholder: string; onSend: (value: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <div className="flex gap-2">
      <input value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && value.trim() && onSend(value.trim())} placeholder={placeholder} autoFocus className="min-w-0 flex-1 rounded-xl border-2 border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand" />
      <button onClick={() => value.trim() && onSend(value.trim())} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-white"><Send size={16} /></button>
    </div>
  )
}

function SliderInput({ unit, min, max, step, def, format, onOk }: { unit: string; min: number; max: number; step?: number; def: number; format?: (n: number) => string; onOk: (value: number) => void }) {
  const [value, setValue] = useState(def)
  const f = format ?? String
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="mb-4 text-center text-xl font-bold text-foreground">{f(value)} {unit}</div>
      <input type="range" min={min} max={max} step={step ?? 1} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full accent-brand" />
      <div className="mt-2 flex justify-between text-xs text-muted"><span>{f(min)} {unit}</span><span>{f(max)} {unit}</span></div>
      <button onClick={() => onOk(value)} className="mt-4 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white">Valider</button>
    </div>
  )
}

function MultiSelect({ options, onOk }: { options: string[]; onOk: (selected: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (item: string) => setSelected((prev) => prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item])
  return (
    <div>
      <div className="space-y-2">
        {options.map((option) => {
          const active = selected.includes(option)
          return <button key={option} onClick={() => toggle(option)} className={'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium ' + (active ? 'border-brand bg-brand-light text-brand' : 'border-border bg-white text-foreground')}><span className={'h-4 w-4 rounded border-2 ' + (active ? 'border-brand bg-brand' : 'border-border')} />{option}</button>
        })}
      </div>
      <button onClick={() => onOk(selected)} className="mt-3 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white">{selected.length ? 'Valider (' + selected.length + ')' : 'Aucun, continuer'}</button>
    </div>
  )
}

function ContactForm({ cta, onSubmit }: { cta: string; onSubmit: (prenom: string, nom: string, telephone: string, email: string, civilite: 'monsieur' | 'madame') => void }) {
  const [civilite, setCivilite] = useState<'monsieur' | 'madame'>('monsieur')
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const [rgpd, setRgpd] = useState(false)
  const ok = prenom.trim() && nom.trim() && telephone.trim() && email.includes('@') && rgpd
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="mb-4 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light"><Home size={16} className="text-brand" /></div><div><p className="text-sm font-bold">Vos coordonnées</p><p className="text-xs text-muted">Pour recevoir vos résultats</p></div></div>
      <div className="mb-3 grid grid-cols-2 gap-2"><button className={'rounded-xl border-2 px-3 py-2 text-sm font-semibold ' + (civilite === 'monsieur' ? 'border-brand bg-brand text-white' : 'border-border')} onClick={() => setCivilite('monsieur')}>M.</button><button className={'rounded-xl border-2 px-3 py-2 text-sm font-semibold ' + (civilite === 'madame' ? 'border-brand bg-brand text-white' : 'border-border')} onClick={() => setCivilite('madame')}>Mme</button></div>
      <div className="grid gap-2 sm:grid-cols-2"><input className="rounded-xl border border-border px-4 py-3 text-sm" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} /><input className="rounded-xl border border-border px-4 py-3 text-sm" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} /></div>
      <input className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm" placeholder="Téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
      <input className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={() => setRgpd(!rgpd)} className={'mt-3 flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-xs leading-relaxed ' + (rgpd ? 'border-brand bg-brand-light' : 'border-border')}><span className={'mt-0.5 h-4 w-4 rounded border-2 ' + (rgpd ? 'border-brand bg-brand' : 'border-border')} />J’accepte d’être recontacté par Alex Lopez concernant mon projet immobilier.</button>
      <button disabled={!ok} onClick={() => ok && onSubmit(prenom.trim(), nom.trim(), telephone.trim(), email.trim(), civilite)} className={'mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white ' + (ok ? 'bg-brand' : 'bg-border')}>{cta}</button>
    </div>
  )
}
