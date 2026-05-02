'use client'

import { Fragment, useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuditStore } from '@/stores/auditStore'
import type { AuditAnswers, AuditQuestionId } from '@/stores/auditStore'
import type { CSSProperties } from 'react'
import { Phone, ChevronLeft, Send, Check, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { Cards, RecapConfirm, SuggestionItem } from '@/components/forms/FormCards'

const B = '#0077B6', BL = '#E0F0FA', FG = '#0F172A', M = '#64748B', BD = '#E2E8F0', SF = '#F8FAFC', WH = '#ffffff'
const MW = '680px', FN = 'var(--font-inter, system-ui, sans-serif)'

const page: CSSProperties = { minHeight: '100vh', background: SF, fontFamily: FN }
const navSt: CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: WH, borderBottom: '1px solid ' + BD }
const navIn: CSSProperties = { maxWidth: MW, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const navL: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10 }
const navR: CSSProperties = { display: 'flex', alignItems: 'center', gap: 12 }
const avSt: CSSProperties = { width: 36, height: 36, borderRadius: 999, background: B, color: WH, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }
const nnSt: CSSProperties = { fontSize: 14, fontWeight: 700, color: FG }
const nsSt: CSSProperties = { fontSize: 11, color: M }
const toolPillSt: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: B, background: BL, padding: '2px 8px', borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }
const bkSt: CSSProperties = { display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 600, color: M, textDecoration: 'none' }
const phSt: CSSProperties = { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: FG, textDecoration: 'none' }
const rbSt: CSSProperties = { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: M, background: 'transparent', border: '1px solid ' + BD, borderRadius: 999, padding: '5px 10px', cursor: 'pointer' }
const cwSt: CSSProperties = { maxWidth: MW, margin: '0 auto', padding: '148px 20px 40px', display: 'flex', flexDirection: 'column', gap: 16 }
const rAl: CSSProperties = { display: 'flex', gap: 10, alignItems: 'flex-end' }
const rUs: CSSProperties = { display: 'flex', justifyContent: 'flex-end' }
const bAl: CSSProperties = { background: WH, border: '1px solid ' + BD, borderRadius: '16px 16px 16px 4px', padding: '14px 16px', fontSize: 14, color: FG, lineHeight: 1.65, whiteSpace: 'pre-wrap', overflowWrap: 'break-word', maxWidth: '84%' }
const bUs: CSSProperties = { background: B, borderRadius: '16px 16px 4px 16px', padding: '10px 16px', fontSize: 14, fontWeight: 500, color: WH, lineHeight: 1.5, maxWidth: '95%' }
const tL: CSSProperties = { fontSize: 10, color: M, marginTop: 4 }
const tR: CSSProperties = { fontSize: 10, color: M, marginTop: 4, textAlign: 'right' }
const inF: CSSProperties = { width: '100%', fontSize: 14, color: FG, border: '1.5px solid ' + BD, borderRadius: 12, padding: '12px 14px', outline: 'none', background: WH, boxSizing: 'border-box' }
const vBtn: CSSProperties = { width: '100%', padding: 13, borderRadius: 12, background: B, border: 'none', color: WH, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }
const vOff: CSSProperties = { width: '100%', padding: 13, borderRadius: 12, background: BD, border: 'none', color: M, fontSize: 14, fontWeight: 600, cursor: 'not-allowed', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }
const sWr: CSSProperties = { background: WH, borderRadius: 16, border: '1px solid ' + BD, padding: 20 }
const cWr: CSSProperties = { background: WH, borderRadius: 16, border: '1px solid ' + BD, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }
const cG: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }
const cH: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }
const cBdg: CSSProperties = { width: 32, height: 32, borderRadius: 999, background: BL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }
const cT: CSSProperties = { fontSize: 15, fontWeight: 700, color: FG }
const cSb: CSSProperties = { fontSize: 12, fontWeight: 300, color: M }
const rgTx: CSSProperties = { fontSize: 12, fontWeight: 400, color: FG, lineHeight: 1.5 }
const spW: CSSProperties = { maxWidth: MW, margin: '0 auto', padding: '10px 20px 12px', display: 'flex', alignItems: 'center' }
const spC: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center' }
const spL: CSSProperties = { fontSize: 10, fontWeight: 600, marginTop: 5, textAlign: 'center' }
const dB: CSSProperties = { width: 28, height: 28, borderRadius: 999, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }
const dDn: CSSProperties = { ...dB, background: B, color: WH, border: '2px solid ' + B }
const dCu: CSSProperties = { ...dB, background: BL, color: B, border: '2px solid ' + B }
const dFu: CSSProperties = { ...dB, background: WH, color: M, border: '2px solid ' + BD }
const lDn: CSSProperties = { ...spL, color: FG }
const lCu: CSSProperties = { ...spL, color: B, fontWeight: 700 }
const lFu: CSSProperties = { ...spL, color: M }
const cnO: CSSProperties = { flex: 1, height: 3, background: BD, borderRadius: 999, overflow: 'hidden', margin: '0 4px', marginBottom: 15 }
const cnOn: CSSProperties = { height: '100%', width: '100%', background: B, borderRadius: 999 }
const cnOf: CSSProperties = { height: '100%', width: '0%', background: B, borderRadius: 999 }
const _iz: CSSProperties = { marginTop: 8 }
const _emo: CSSProperties = { fontSize: 20 }
const _ir: CSSProperties = { display: 'flex', gap: 10 }
const _inpR: CSSProperties = { width: '100%', fontSize: 14, color: FG, border: '1.5px solid ' + BD, borderRadius: 12, padding: '12px 14px', outline: 'none', background: WH, boxSizing: 'border-box', flex: 1 } as CSSProperties
const _sendBtn: CSSProperties = { width: 42, height: 42, borderRadius: 12, background: B, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
const _slVal: CSSProperties = { textAlign: 'center', fontSize: 18, fontWeight: 700, color: FG, marginBottom: 16 }
const _slInp: CSSProperties = { width: '100%', accentColor: B } as CSSProperties
const _slRow: CSSProperties = { display: 'flex', justifyContent: 'space-between', marginTop: 8 }
const _slLbl: CSSProperties = { fontSize: 11, color: M }
const _g2: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }
const _sugWr: CSSProperties = { background: WH, border: '1px solid ' + BD, borderRadius: 12, overflow: 'hidden', marginTop: 6 }
const _load: CSSProperties = { fontSize: 11, color: M, marginTop: 6 }
function cardS(a: boolean): CSSProperties { return { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 10px', borderRadius: 14, cursor: 'pointer', border: '2px solid ' + (a ? B : BD), background: a ? BL : WH, fontSize: 13, fontWeight: 600, color: a ? B : FG, textAlign: 'center', width: '100%' } }
function civS(a: boolean): CSSProperties { return { flex: 1, padding: 11, borderRadius: 12, border: '2px solid ' + (a ? B : BD), background: a ? B : WH, color: a ? WH : FG, fontSize: 13, fontWeight: 600, cursor: 'pointer' } }
function rgS(a: boolean): CSSProperties { return { display: 'flex', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 12, cursor: 'pointer', border: '1.5px solid ' + (a ? B : BD), background: a ? BL : WH } }
function rgBx(a: boolean): CSSProperties { return { width: 18, height: 18, borderRadius: 4, border: '2px solid ' + (a ? B : BD), background: a ? B : WH, flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' } }
function mRw(a: boolean): CSSProperties { return { display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 12, cursor: 'pointer', border: '1.5px solid ' + (a ? B : BD), background: a ? BL : WH, fontSize: 13, fontWeight: 500, color: a ? B : FG, marginBottom: 8 } }

const STEPS = [
  { n: 1, label: 'Bien', qs: ['adresse', 'type_bien', 'surface'] },
  { n: 2, label: '\u00c9tat', qs: ['etat_toiture', 'etat_facade', 'etat_menuiseries', 'etat_plomberie', 'etat_electricite', 'humidite', 'isolation', 'chauffage', 'dpe'] },
  { n: 3, label: 'Profil', qs: ['qualite', 'objectif', 'recapitulatif'] },
  { n: 4, label: 'Contact', qs: ['coordonnees', 'done'] },
]
const TYPE_BIEN = [
  { value: 'appartement', label: 'Appartement', emoji: '\ud83c\udfe2' },
  { value: 'maison', label: 'Maison', emoji: '\ud83c\udfe0' },
  { value: 'terrain', label: 'Terrain', emoji: '\ud83c\udf3f' },
  { value: 'autre', label: 'Autre', emoji: '\u00b7\u00b7\u00b7' },
]
const ETAT_OPTS = [
  { value: 'bon', label: 'Bon \u00e9tat', emoji: '\u2705' },
  { value: 'moyen', label: 'Moyen', emoji: '\u26a0\ufe0f' },
  { value: 'mauvais', label: 'Mauvais', emoji: '\u274c' },
  { value: 'nc', label: 'Ne sais pas', emoji: '\u2753' },
]
const ISOLATION_OPTS = ['Murs isol\u00e9s', 'Combles isol\u00e9s', 'Double vitrage']
const CHAUFFAGE_OPTS = [
  { value: 'electrique', label: '\u00c9lectrique', emoji: '\u26a1' },
  { value: 'gaz', label: 'Gaz', emoji: '\ud83d\udd25' },
  { value: 'fioul', label: 'Fioul', emoji: '\ud83d\udee2\ufe0f' },
  { value: 'bois', label: 'Bois', emoji: '\ud83e\udeb5' },
  { value: 'pac', label: 'Pompe \u00e0 chaleur', emoji: '\u2744\ufe0f' },
  { value: 'autre', label: 'Autre', emoji: '\u00b7\u00b7\u00b7' },
]
const DPE_OPTS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(l => ({ value: l, label: l, emoji: '' }))
const QUALITE_OPTS = [
  { value: 'proprietaire', label: 'Propri\u00e9taire', emoji: '\ud83c\udfe0' },
  { value: 'acheteur', label: 'Acheteur potentiel', emoji: '\ud83d\udd0d' },
]
const OBJECTIF_OPTS = [
  { value: 'vente', label: 'Vente', emoji: '\ud83d\udcb0' },
  { value: 'achat', label: 'Achat', emoji: '\ud83c\udfe1' },
  { value: 'renovation', label: 'R\u00e9novation', emoji: '\ud83d\udd28' },
  { value: 'energie', label: '\u00c9nergie', emoji: '\u26a1' },
]
const BIEN_LBL: Record<string, string> = { appartement: 'Appartement', maison: 'Maison', terrain: 'Terrain', autre: 'Autre' }
const ETAT_LBL: Record<string, string> = { bon: 'Bon', moyen: 'Moyen', mauvais: 'Mauvais', nc: 'N/C' }
const CHAUFF_LBL: Record<string, string> = { electrique: '\u00c9lectrique', gaz: 'Gaz', fioul: 'Fioul', bois: 'Bois', pac: 'PAC', autre: 'Autre' }
const OBJ_LBL: Record<string, string> = { vente: 'Vente', achat: 'Achat', renovation: 'R\u00e9novation', energie: '\u00c9nergie' }

function getNext(q: AuditQuestionId): AuditQuestionId {
  const f: Record<string, AuditQuestionId> = {
    adresse: 'type_bien', type_bien: 'surface', surface: 'etat_toiture',
    etat_toiture: 'etat_facade', etat_facade: 'etat_menuiseries', etat_menuiseries: 'etat_plomberie',
    etat_plomberie: 'etat_electricite', etat_electricite: 'humidite',
    humidite: 'isolation', isolation: 'chauffage', chauffage: 'dpe',
    dpe: 'qualite', qualite: 'objectif', objectif: 'recapitulatif',
    recapitulatif: 'coordonnees', coordonnees: 'done', done: 'done'
  }
  return f[q] ?? 'done'
}

function getMsg(q: AuditQuestionId, a: AuditAnswers): string {
  switch (q) {
    case 'type_bien': return 'Quel type de bien\u00a0?'
    case 'surface': return 'Quelle est la surface habitable\u00a0?'
    case 'etat_toiture': return 'Passons \u00e0 l\u2019\u00e9tat du bien. Comment est la toiture\u00a0?'
    case 'etat_facade': return 'Et la fa\u00e7ade\u00a0?'
    case 'etat_menuiseries': return 'Les menuiseries (portes, fen\u00eatres)\u00a0?'
    case 'etat_plomberie': return 'La plomberie\u00a0?'
    case 'etat_electricite': return 'L\u2019installation \u00e9lectrique\u00a0?'
    case 'humidite': return 'Constatez-vous des probl\u00e8mes d\u2019humidit\u00e9 ou de moisissures\u00a0?'
    case 'isolation': return 'Quels \u00e9l\u00e9ments d\u2019isolation sont pr\u00e9sents\u00a0?'
    case 'chauffage': return 'Quel type de chauffage\u00a0?'
    case 'dpe': return 'Quel est le DPE actuel du bien\u00a0?\n(Si vous ne le connaissez pas, choisissez le plus proche)'
    case 'qualite': return 'Vous \u00eates\u00a0:'
    case 'objectif': return 'Quel est l\u2019objectif de cet audit\u00a0?'
    case 'recapitulatif': return buildRecap(a)
    case 'coordonnees': return "Parfait\u00a0! Pour recevoir votre score d'audit et les recommandations, j'ai besoin de vos coordonn\u00e9es."
    default: return ''
  }
}

function buildRecap(a: AuditAnswers): string {
  const lines = ['Voici le r\u00e9capitulatif de votre audit\u00a0!', '']
  lines.push('\ud83c\udfe0 ' + (BIEN_LBL[a.type_bien ?? ''] ?? 'Bien'))
  if (a.adresse) lines.push('\ud83d\udccd ' + a.adresse)
  if (a.surface) lines.push('\ud83d\udcd0 ' + a.surface + ' m\u00b2')
  const etats = ['toiture', 'facade', 'menuiseries', 'plomberie', 'electricite']
  const eLabels = ['Toiture', 'Fa\u00e7ade', 'Menuiseries', 'Plomberie', '\u00c9lectricit\u00e9']
  etats.forEach((e, i) => {
    const val = a[('etat_' + e) as keyof AuditAnswers] as string | undefined
    if (val) lines.push('\ud83d\udd27 ' + eLabels[i] + '\u00a0: ' + (ETAT_LBL[val] ?? val))
  })
  if (a.humidite) lines.push('\ud83d\udca7 Humidit\u00e9\u00a0: ' + a.humidite)
  if (a.isolation?.length) lines.push('\ud83e\uddf1 Isolation\u00a0: ' + a.isolation.join(', '))
  if (a.type_chauffage) lines.push('\ud83d\udd25 Chauffage\u00a0: ' + (CHAUFF_LBL[a.type_chauffage] ?? a.type_chauffage))
  if (a.dpe) lines.push('\u26a1 DPE\u00a0: ' + a.dpe)
  if (a.qualite) lines.push('\ud83d\udc64 ' + (a.qualite === 'proprietaire' ? 'Propri\u00e9taire' : 'Acheteur potentiel'))
  if (a.objectif) lines.push('\ud83c\udfaf Objectif\u00a0: ' + (OBJ_LBL[a.objectif] ?? a.objectif))
  lines.push('', 'Ces informations sont-elles correctes\u00a0?')
  return lines.join('\n')
}

function ts() { return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
function Avatar() { return <div style={avSt}>AL</div> }
function getCurStep(q: AuditQuestionId) { for (const s of STEPS) if (s.qs.includes(q)) return s.n; return 1 }

function Stepper({ q }: { q: AuditQuestionId }) {
  const cs = getCurStep(q)
  return (
    <div style={spW}>
      {STEPS.map((s, i) => {
        const st = s.n < cs ? 'done' : s.n === cs ? 'curr' : 'futu'
        return (
          <Fragment key={s.n}>
            <div style={spC}>
              <div style={st === 'done' ? dDn : st === 'curr' ? dCu : dFu}>{st === 'done' ? <Check size={12} color={WH} strokeWidth={3} /> : s.n}</div>
              <span style={st === 'done' ? lDn : st === 'curr' ? lCu : lFu}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={cnO}><div style={s.n < cs ? cnOn : cnOf} /></div>}
          </Fragment>
        )
      })}
    </div>
  )
}

export default function AuditPage() {
  const router = useRouter()
  const { messages, currentQuestion, answers, addMessage, setAnswer, setQuestion, reset } = useAuditStore()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { ref.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, currentQuestion])

  function answer(key: keyof AuditAnswers, value: AuditAnswers[keyof AuditAnswers], display: string) {
    const newA = { ...answers, [key]: value }
    setAnswer(key, value)
    if (!display) return
    addMessage({ from: 'user', text: display, timestamp: ts() })
    const next = getNext(currentQuestion)
    setTimeout(() => {
      const msg = getMsg(next, newA)
      if (msg) addMessage({ from: 'al', text: msg, timestamp: ts() })
      setQuestion(next)
    }, 350)
  }

  function submit(p: string, n: string, t: string, em: string, c: 'monsieur' | 'madame') {
    setAnswer('prenom', p); setAnswer('nom', n); setAnswer('telephone', t); setAnswer('email', em); setAnswer('civilite', c)
    addMessage({ from: 'user', text: p + ' ' + n, timestamp: ts() })
    const tk = crypto.randomUUID()
    fetch('/api/leads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...answers, prenom: p, nom: n, telephone: t, email: em, civilite: c, token: tk, type: 'audit', opt_in: answers.rgpd ?? false }),
    }).catch(() => null)
    router.push('/resultats/' + tk)
  }

  return (
    <div style={page}>
      <header style={navSt}>
        <div style={navIn}>
          <div style={navL}>
            <Link href="/" style={bkSt}><ChevronLeft size={14} /></Link>
            <Avatar />
            <div>
              <div style={nnSt}>Alex Lopez</div>
              <span style={toolPillSt}><span>\ud83d\udccb</span> Audit immobilier</span>
            </div>
          </div>
          <div style={navR}>
            <button style={rbSt} onClick={() => reset()}><RotateCcw size={12} /> Recommencer</button>
            <a href="tel:+33613180168" style={phSt}><Phone size={13} color={B} /></a>
          </div>
        </div>
        <Stepper q={currentQuestion} />
      </header>
      <div style={cwSt}>
        {messages.map(m => (
          <div key={m.id}>
            {m.from === 'al'
              ? <div style={rAl}><Avatar /><div><div style={bAl}>{m.text}</div><div style={tL}>{m.timestamp}</div></div></div>
              : <div style={rUs}><div><div style={bUs}>{m.text}</div><div style={tR}>{m.timestamp}</div></div></div>}
          </div>
        ))}
        {currentQuestion !== 'done' && <div style={_iz}><InputZone q={currentQuestion} a={answers} onAnswer={answer} onSubmit={submit} /></div>}
        <div ref={ref} />
      </div>
    </div>
  )
}

function InputZone({ q, a, onAnswer, onSubmit }: {
  q: AuditQuestionId; a: AuditAnswers
  onAnswer: (k: keyof AuditAnswers, v: AuditAnswers[keyof AuditAnswers], d: string) => void
  onSubmit: (p: string, n: string, t: string, e: string, c: 'monsieur' | 'madame') => void
}) {
  if (q === 'adresse') return <AdresseInput onAnswer={onAnswer} />
  if (q === 'type_bien') return <Cards opts={TYPE_BIEN} cols={2} onPick={(v, l) => onAnswer('type_bien', v, l)} />
  if (q === 'surface') return <SliderInput unit="m\u00b2" min={10} max={1000} def={100} step={5} onOk={v => onAnswer('surface', v, v + ' m\u00b2')} />
  if (q === 'etat_toiture') return <Cards opts={ETAT_OPTS} cols={2} onPick={(v, l) => onAnswer('etat_toiture', v, l)} />
  if (q === 'etat_facade') return <Cards opts={ETAT_OPTS} cols={2} onPick={(v, l) => onAnswer('etat_facade', v, l)} />
  if (q === 'etat_menuiseries') return <Cards opts={ETAT_OPTS} cols={2} onPick={(v, l) => onAnswer('etat_menuiseries', v, l)} />
  if (q === 'etat_plomberie') return <Cards opts={ETAT_OPTS} cols={2} onPick={(v, l) => onAnswer('etat_plomberie', v, l)} />
  if (q === 'etat_electricite') return <Cards opts={ETAT_OPTS} cols={2} onPick={(v, l) => onAnswer('etat_electricite', v, l)} />
  if (q === 'humidite') return <YesNo onPick={(v, l) => onAnswer('humidite', v, l)} />
  if (q === 'isolation') return <MultiSel opts={ISOLATION_OPTS} onOk={sel => onAnswer('isolation', sel, sel.length ? sel.join(', ') : 'Aucune isolation')} />
  if (q === 'chauffage') return <Cards opts={CHAUFFAGE_OPTS} cols={2} onPick={(v, l) => onAnswer('type_chauffage', v, l)} />
  if (q === 'dpe') return <Cards opts={DPE_OPTS} cols={4} onPick={(v, l) => onAnswer('dpe', v, 'DPE ' + l)} />
  if (q === 'qualite') return <Cards opts={QUALITE_OPTS} cols={2} onPick={(v, l) => onAnswer('qualite', v, l)} />
  if (q === 'objectif') return <Cards opts={OBJECTIF_OPTS} cols={2} onPick={(v, l) => onAnswer('objectif', v, l)} />
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (q === 'recapitulatif') return <RecapConfirm onOk={() => onAnswer('recapitulatif' as any, true as any, "C'est correct \u2705")} />
  if (q === 'coordonnees') return <Coordonnees onSubmit={onSubmit} />
  return null
}

const API_ADRESSE = 'https://api-adresse.data.gouv.fr/search/'
interface Sug { label: string; lat: number; lng: number }

function AdresseInput({ onAnswer }: { onAnswer: (k: keyof AuditAnswers, v: AuditAnswers[keyof AuditAnswers], d: string) => void }) {
  const [val, setVal] = useState('')
  const [sugs, setSugs] = useState<Sug[]>([])
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function search(q: string) {
    if (q.length < 3) { setSugs([]); return }
    setLoading(true)
    try {
      const res = await fetch(API_ADRESSE + '?q=' + encodeURIComponent(q) + '&limit=5')
      const data = await res.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSugs(data.features.map((f: any) => ({ label: f.properties.label, lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] })))
    } catch { setSugs([]) } finally { setLoading(false) }
  }

  function pick(s: Sug) {
    setSugs([]); setVal(s.label)
    onAnswer('lat', s.lat, '')
    onAnswer('lng', s.lng, '')
    onAnswer('adresse', s.label, s.label)
  }

  function send() { if (val.trim()) { setSugs([]); onAnswer('adresse', val.trim(), val.trim()) } }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVal(e.target.value)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => search(e.target.value), 300)
  }

  return (
    <div>
      <div style={_ir}>
        <input style={_inpR} placeholder="Ex\u00a0: 12 rue de la Paix, Cotignac" value={val} onChange={onChange} onKeyDown={e => e.key === 'Enter' && send()} autoFocus autoComplete="off" />
        <button style={_sendBtn} onClick={send}><Send size={16} color={WH} /></button>
      </div>
      {sugs.length > 0 && (
        <div style={_sugWr}>
          {sugs.map((s, i) => (
            <SuggestionItem key={i} label={s.label} isLast={i === sugs.length - 1} onPick={() => pick(s)} />
          ))}
        </div>
      )}
      {loading && <p style={_load}>Recherche en cours...</p>}
    </div>
  )
}

function SliderInput({ unit, min, max, def, step, onOk }: { unit: string; min: number; max: number; def: number; step?: number; onOk: (v: number) => void }) {
  const [v, setV] = useState(def)
  return (
    <div style={sWr}>
      <div style={_slVal}>{v} {unit}</div>
      <input type="range" min={min} max={max} value={v} step={step ?? 1} onChange={e => setV(+e.target.value)} style={_slInp} />
      <div style={_slRow}>
        <span style={_slLbl}>{min} {unit}</span>
        <span style={_slLbl}>{max} {unit}</span>
      </div>
      <button style={vBtn} onClick={() => onOk(v)}>Valider</button>
    </div>
  )
}

function MultiSel({ opts, onOk }: { opts: string[]; onOk: (sel: string[]) => void }) {
  const [sel, setSel] = useState<string[]>([])
  const t = (o: string) => setSel(s => s.includes(o) ? s.filter(x => x !== o) : [...s, o])
  return (
    <div>
      {opts.map(o => (
        <div key={o} style={mRw(sel.includes(o))} onClick={() => t(o)}>
          <div style={rgBx(sel.includes(o))} />
          {o}
        </div>
      ))}
      <button style={vBtn} onClick={() => onOk(sel)}>{sel.length ? 'Valider (' + sel.length + ')' : 'Aucun, continuer'}</button>
    </div>
  )
}

function YesNo({ onPick }: { onPick: (v: string, l: string) => void }) {
  return (
    <div style={_g2}>
      <div style={cardS(false)} onClick={() => onPick('Oui', 'Oui')}><span style={_emo}>\u2705</span><span>Oui</span></div>
      <div style={cardS(false)} onClick={() => onPick('Non', 'Non')}><span style={_emo}>\u274c</span><span>Non</span></div>
    </div>
  )
}

function Coordonnees({ onSubmit }: { onSubmit: (p: string, n: string, t: string, e: string, c: 'monsieur' | 'madame') => void }) {
  const [civ, setCiv] = useState<'monsieur' | 'madame'>('monsieur')
  const [p, setP] = useState(''); const [n, setN] = useState(''); const [t, setT] = useState(''); const [em, setEm] = useState('')
  const [rg, setRg] = useState(false)
  const ok = p.trim() && n.trim() && t.trim() && em.includes('@') && rg
  return (
    <div style={cWr}>
      <div style={cH}><div style={cBdg}>\ud83d\udccb</div><div><div style={cT}>Vos coordonn\u00e9es</div><div style={cSb}>Pour recevoir votre audit</div></div></div>
      <div style={cG}>
        <button style={civS(civ === 'monsieur')} onClick={() => setCiv('monsieur')}>M.</button>
        <button style={civS(civ === 'madame')} onClick={() => setCiv('madame')}>Mme</button>
      </div>
      <div style={cG}>
        <input style={inF} placeholder="Pr\u00e9nom" value={p} onChange={e => setP(e.target.value)} />
        <input style={inF} placeholder="Nom" value={n} onChange={e => setN(e.target.value)} />
      </div>
      <input style={inF} type="tel" placeholder="06 XX XX XX XX" value={t} onChange={e => setT(e.target.value)} />
      <input style={inF} type="email" placeholder="votre@email.com" value={em} onChange={e => setEm(e.target.value)} />
      <div style={rgS(rg)} onClick={() => setRg(!rg)}>
        <div style={rgBx(rg)}>{rg && <Check size={12} color={WH} />}</div>
        <span style={rgTx}>J&apos;accepte d&apos;\u00eatre recontact\u00e9 par Alex Lopez, conseiller immobilier, concernant mon projet immobilier</span>
      </div>
      <button style={ok ? vBtn : vOff} onClick={() => ok && onSubmit(p, n, t, em, civ)} disabled={!ok}><Send size={14} /> Recevoir mon audit</button>
    </div>
  )
}
