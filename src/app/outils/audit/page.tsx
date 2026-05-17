'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, ChevronLeft, ClipboardCheck, Home, Phone, RotateCcw, Send } from 'lucide-react'
import { useAuditStore } from '@/stores/auditStore'
import type { AuditAnswers, AuditQuestionId } from '@/stores/auditStore'

const PHONE_RAW = '+33613180168'
const BRAND = '#0077B6'

const STEPS = [
  { n: 1, label: 'Bien', qs: ['adresse', 'type_bien', 'surface'] },
  { n: 2, label: 'État', qs: ['etat_toiture', 'etat_facade', 'etat_menuiseries', 'etat_plomberie', 'etat_electricite', 'humidite', 'isolation', 'chauffage', 'dpe'] },
  { n: 3, label: 'Profil', qs: ['qualite', 'objectif', 'recapitulatif'] },
  { n: 4, label: 'Contact', qs: ['coordonnees', 'done'] },
]

const TYPE_BIEN = [
  { value: 'appartement', label: 'Appartement', icon: '🏢' },
  { value: 'maison', label: 'Maison', icon: '🏡' },
  { value: 'terrain', label: 'Terrain', icon: '🌿' },
  { value: 'autre', label: 'Autre', icon: '···' },
]
const ETAT_OPTS = [
  { value: 'bon', label: 'Bon état', icon: '✅' },
  { value: 'moyen', label: 'Moyen', icon: '⚠️' },
  { value: 'mauvais', label: 'Mauvais', icon: '❌' },
  { value: 'nc', label: 'Je ne sais pas', icon: '❓' },
]
const ISOLATION_OPTS = ['Murs isolés', 'Combles isolés', 'Double vitrage']
const CHAUFFAGE_OPTS = [
  { value: 'electrique', label: 'Électrique', icon: '⚡' },
  { value: 'gaz', label: 'Gaz', icon: '🔥' },
  { value: 'fioul', label: 'Fioul', icon: '⛽' },
  { value: 'bois', label: 'Bois', icon: '🪵' },
  { value: 'pac', label: 'Pompe à chaleur', icon: '❄️' },
  { value: 'autre', label: 'Autre', icon: '···' },
]
const DPE_OPTS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((value) => ({ value, label: value, icon: '⚡' }))
const QUALITE_OPTS = [
  { value: 'proprietaire', label: 'Propriétaire', icon: '🏠' },
  { value: 'acheteur', label: 'Acheteur potentiel', icon: '🔎' },
]
const OBJECTIF_OPTS = [
  { value: 'vente', label: 'Vente', icon: '🏷️' },
  { value: 'achat', label: 'Achat', icon: '🔑' },
  { value: 'renovation', label: 'Rénovation', icon: '🛠️' },
  { value: 'energie', label: 'Énergie', icon: '⚡' },
]
const BIEN_LBL: Record<string, string> = { appartement: 'Appartement', maison: 'Maison', terrain: 'Terrain', autre: 'Autre' }
const ETAT_LBL: Record<string, string> = { bon: 'Bon', moyen: 'Moyen', mauvais: 'Mauvais', nc: 'Non connu' }
const CHAUFF_LBL: Record<string, string> = { electrique: 'Électrique', gaz: 'Gaz', fioul: 'Fioul', bois: 'Bois', pac: 'Pompe à chaleur', autre: 'Autre' }
const OBJ_LBL: Record<string, string> = { vente: 'Vente', achat: 'Achat', renovation: 'Rénovation', energie: 'Énergie' }

function getNext(q: AuditQuestionId): AuditQuestionId {
  const flow: Record<string, AuditQuestionId> = {
    adresse: 'type_bien',
    type_bien: 'surface',
    surface: 'etat_toiture',
    etat_toiture: 'etat_facade',
    etat_facade: 'etat_menuiseries',
    etat_menuiseries: 'etat_plomberie',
    etat_plomberie: 'etat_electricite',
    etat_electricite: 'humidite',
    humidite: 'isolation',
    isolation: 'chauffage',
    chauffage: 'dpe',
    dpe: 'qualite',
    qualite: 'objectif',
    objectif: 'recapitulatif',
    recapitulatif: 'coordonnees',
    coordonnees: 'done',
    done: 'done',
  }
  return flow[q] ?? 'done'
}

function getCurrentStep(q: AuditQuestionId) {
  for (const step of STEPS) if (step.qs.includes(q)) return step.n
  return 1
}

function ts() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function buildRecap(a: AuditAnswers): string {
  const lines = ['Voici le récapitulatif de votre audit :', '']
  lines.push('🏠 ' + (BIEN_LBL[a.type_bien ?? ''] ?? 'Bien'))
  if (a.adresse) lines.push('📍 ' + a.adresse)
  if (a.surface) lines.push('📐 Surface : ' + a.surface + ' m²')
  const etats = [
    ['Toiture', a.etat_toiture],
    ['Façade', a.etat_facade],
    ['Menuiseries', a.etat_menuiseries],
    ['Plomberie', a.etat_plomberie],
    ['Électricité', a.etat_electricite],
  ] as const
  for (const [label, value] of etats) if (value) lines.push('🔎 ' + label + ' : ' + (ETAT_LBL[value] ?? value))
  if (a.humidite) lines.push('💧 Humidité : ' + a.humidite)
  if (a.isolation?.length) lines.push('🧱 Isolation : ' + a.isolation.join(', '))
  if (a.type_chauffage) lines.push('🔥 Chauffage : ' + (CHAUFF_LBL[a.type_chauffage] ?? a.type_chauffage))
  if (a.dpe) lines.push('⚡ DPE : ' + a.dpe)
  if (a.qualite) lines.push('👤 Profil : ' + (a.qualite === 'proprietaire' ? 'Propriétaire' : 'Acheteur potentiel'))
  if (a.objectif) lines.push('🎯 Objectif : ' + (OBJ_LBL[a.objectif] ?? a.objectif))
  lines.push('', 'Ces informations sont-elles correctes ?')
  return lines.join('\n')
}

function getMsg(q: AuditQuestionId, a: AuditAnswers): string {
  switch (q) {
    case 'type_bien': return 'Quel type de bien souhaitez-vous analyser ?'
    case 'surface': return 'Quelle est la surface habitable approximative ?'
    case 'etat_toiture': return 'Passons à l’état du bien. Comment est la toiture ?'
    case 'etat_facade': return 'Et la façade ?'
    case 'etat_menuiseries': return 'Quel est l’état des menuiseries : portes et fenêtres ?'
    case 'etat_plomberie': return 'Quel est l’état de la plomberie ?'
    case 'etat_electricite': return 'Quel est l’état de l’installation électrique ?'
    case 'humidite': return 'Constatez-vous des problèmes d’humidité ou de moisissures ?'
    case 'isolation': return 'Quels éléments d’isolation sont présents ?'
    case 'chauffage': return 'Quel est le type de chauffage principal ?'
    case 'dpe': return 'Quel est le DPE actuel du bien ?'
    case 'qualite': return 'Vous êtes plutôt dans quelle situation ?'
    case 'objectif': return 'Quel est l’objectif principal de cet audit ?'
    case 'recapitulatif': return buildRecap(a)
    case 'coordonnees': return 'Parfait. Pour recevoir votre score d’audit et les recommandations, j’ai besoin de vos coordonnées.'
    default: return ''
  }
}

function Avatar() {
  return <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">AL</div>
}

function Stepper({ q }: { q: AuditQuestionId }) {
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

export default function AuditPage() {
  const router = useRouter()
  const { messages, currentQuestion, answers, addMessage, setAnswer, setQuestion, reset } = useAuditStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, currentQuestion])

  function answer(key: keyof AuditAnswers, value: AuditAnswers[keyof AuditAnswers], display: string) {
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
      body: JSON.stringify({ ...answers, prenom, nom, telephone, email, civilite, token, type: 'audit', opt_in: true }),
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
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-brand"><ClipboardCheck size={11} /> Audit immobilier</span>
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
  q: AuditQuestionId
  onAnswer: (key: keyof AuditAnswers, value: AuditAnswers[keyof AuditAnswers], display: string) => void
  onSubmit: (prenom: string, nom: string, telephone: string, email: string, civilite: 'monsieur' | 'madame') => void
}) {
  if (q === 'adresse') return <TextInput placeholder="Ex : 12 rue de la Paix, Cotignac" onSend={(v) => onAnswer('adresse', v, v)} />
  if (q === 'type_bien') return <ChoiceGrid options={TYPE_BIEN} onPick={(v, l) => onAnswer('type_bien', v, l)} />
  if (q === 'surface') return <SliderInput unit="m²" min={10} max={1000} step={5} def={100} onOk={(v) => onAnswer('surface', v, v + ' m²')} />
  if (q === 'etat_toiture') return <ChoiceGrid options={ETAT_OPTS} onPick={(v, l) => onAnswer('etat_toiture', v, l)} />
  if (q === 'etat_facade') return <ChoiceGrid options={ETAT_OPTS} onPick={(v, l) => onAnswer('etat_facade', v, l)} />
  if (q === 'etat_menuiseries') return <ChoiceGrid options={ETAT_OPTS} onPick={(v, l) => onAnswer('etat_menuiseries', v, l)} />
  if (q === 'etat_plomberie') return <ChoiceGrid options={ETAT_OPTS} onPick={(v, l) => onAnswer('etat_plomberie', v, l)} />
  if (q === 'etat_electricite') return <ChoiceGrid options={ETAT_OPTS} onPick={(v, l) => onAnswer('etat_electricite', v, l)} />
  if (q === 'humidite') return <ChoiceGrid options={[{ value: 'Oui', label: 'Oui', icon: '💧' }, { value: 'Non', label: 'Non', icon: '✅' }]} onPick={(v, l) => onAnswer('humidite', v, l)} />
  if (q === 'isolation') return <MultiSelect options={ISOLATION_OPTS} onOk={(sel) => onAnswer('isolation', sel, sel.length ? sel.join(', ') : 'Aucune isolation connue')} />
  if (q === 'chauffage') return <ChoiceGrid options={CHAUFFAGE_OPTS} onPick={(v, l) => onAnswer('type_chauffage', v, l)} />
  if (q === 'dpe') return <ChoiceGrid options={DPE_OPTS} cols={4} onPick={(v) => onAnswer('dpe', v, 'DPE ' + v)} />
  if (q === 'qualite') return <ChoiceGrid options={QUALITE_OPTS} onPick={(v, l) => onAnswer('qualite', v, l)} />
  if (q === 'objectif') return <ChoiceGrid options={OBJECTIF_OPTS} onPick={(v, l) => onAnswer('objectif', v, l)} />
  if (q === 'recapitulatif') return <button className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white" onClick={() => onAnswer('recapitulatif' as keyof AuditAnswers, true, "C'est correct ✅")}>C’est correct</button>
  if (q === 'coordonnees') return <ContactForm cta="Recevoir mon audit" onSubmit={onSubmit} />
  return null
}

function ChoiceGrid({ options, cols = 2, onPick }: { options: { value: string; label: string; icon: string }[]; cols?: 2 | 3 | 4; onPick: (value: string, label: string) => void }) {
  const colClass = cols === 4 ? 'grid-cols-4' : cols === 3 ? 'grid-cols-3' : 'grid-cols-2'
  return (
    <div className={'grid gap-2 ' + colClass}>
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

function SliderInput({ unit, min, max, step, def, onOk }: { unit: string; min: number; max: number; step?: number; def: number; onOk: (value: number) => void }) {
  const [value, setValue] = useState(def)
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="mb-4 text-center text-xl font-bold text-foreground">{value} {unit}</div>
      <input type="range" min={min} max={max} step={step ?? 1} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full accent-brand" />
      <div className="mt-2 flex justify-between text-xs text-muted"><span>{min} {unit}</span><span>{max} {unit}</span></div>
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
