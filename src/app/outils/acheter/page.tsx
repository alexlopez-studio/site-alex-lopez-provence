'use client'

import { Fragment, useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAcheterStore } from '@/stores/acheterStore'
import type { AcheterAnswers, AcheterQuestionId } from '@/stores/acheterStore'
import type { CSSProperties } from 'react'
import { Phone, ChevronLeft, Send, Check, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { Cards, RecapConfirm } from '@/components/forms/FormCards'

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
function cardS(a: boolean): CSSProperties { return { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 10px', borderRadius: 14, cursor: 'pointer', border: '2px solid ' + (a ? B : BD), background: a ? BL : WH, fontSize: 13, fontWeight: 600, color: a ? B : FG, textAlign: 'center', width: '100%' } }
function civS(a: boolean): CSSProperties { return { flex: 1, padding: 11, borderRadius: 12, border: '2px solid ' + (a ? B : BD), background: a ? B : WH, color: a ? WH : FG, fontSize: 13, fontWeight: 600, cursor: 'pointer' } }
function rgS(a: boolean): CSSProperties { return { display: 'flex', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 12, cursor: 'pointer', border: '1.5px solid ' + (a ? B : BD), background: a ? BL : WH } }
function rgBx(a: boolean): CSSProperties { return { width: 18, height: 18, borderRadius: 4, border: '2px solid ' + (a ? B : BD), background: a ? B : WH, flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' } }
function mRw(a: boolean): CSSProperties { return { display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 12, cursor: 'pointer', border: '1.5px solid ' + (a ? B : BD), background: a ? BL : WH, fontSize: 13, fontWeight: 500, color: a ? B : FG, marginBottom: 8 } }

const STEPS = [
  { n: 1, label: 'Projet', qs: ['type_bien', 'communes', 'budget_max', 'surface_min', 'nb_pieces_min'] },
  { n: 2, label: 'Crit\ères', qs: ['criteres'] },
  { n: 3, label: 'Budget', qs: ['apport', 'accord_bancaire', 'primo_accedant', 'recapitulatif'] },
  { n: 4, label: 'Contact', qs: ['coordonnees', 'done'] },
]
const TYPE_BIEN = [
  { value: 'appartement', label: 'Appartement', emoji: '\�\�' },
  { value: 'maison', label: 'Maison', emoji: '\�\�' },
  { value: 'terrain', label: 'Terrain', emoji: '\�\�' },
  { value: 'commerce', label: 'Commerce', emoji: '\�\�' },
  { value: 'autre', label: 'Autre', emoji: '\·\·\·' },
]
const CRITERES = ['Rez-de-chauss\ée accept\é', 'Parking indispensable', 'Ext\érieur indispensable', 'Travaux accept\és']
const BIEN_LBL: Record<string, string> = { appartement: 'Appartement', maison: 'Maison', terrain: 'Terrain', commerce: 'Commerce', autre: 'Autre' }

function getNext(q: AcheterQuestionId): AcheterQuestionId {
  const f: Record<string, AcheterQuestionId> = { type_bien: 'communes', communes: 'budget_max', budget_max: 'surface_min', surface_min: 'nb_pieces_min', nb_pieces_min: 'criteres', criteres: 'apport', apport: 'accord_bancaire', accord_bancaire: 'primo_accedant', primo_accedant: 'recapitulatif', recapitulatif: 'coordonnees', coordonnees: 'done', done: 'done' }
  return f[q] ?? 'done'
}

function fmt(n: number) { return new Intl.NumberFormat('fr-FR').format(n) }

function buildRecap(a: AcheterAnswers): string {
  const lines = ['Tr\ès bien, r\écapitulons votre projet\ !', '']
  lines.push('\�\� ' + (BIEN_LBL[a.type_bien ?? ''] ?? 'Bien'))
  if (a.communes) lines.push('\�\� ' + a.communes)
  if (a.budget_max) lines.push('\�\� Budget max\ : ' + fmt(a.budget_max) + ' \€')
  if (a.surface_min) lines.push('\�\� Surface min\ : ' + a.surface_min + ' m\²')
  if (a.nb_pieces_min) lines.push('\�\� ' + a.nb_pieces_min + ' pi\èce' + (Number(a.nb_pieces_min) > 1 ? 's' : '') + ' min')
  if (a.criteres?.length) lines.push('\✅ ' + a.criteres.join(', '))
  if (a.apport != null) lines.push('\�\� Apport\ : ' + fmt(a.apport) + ' \€')
  if (a.accord_bancaire) lines.push('\�\� Accord bancaire\ : ' + a.accord_bancaire)
  if (a.primo_accedant) lines.push('\�\� Primo-acc\édant\ : ' + a.primo_accedant)
  lines.push('', 'Ces informations sont-elles correctes\ ?')
  return lines.join('\n')
}

function getMsg(q: AcheterQuestionId, a: AcheterAnswers): string {
  switch (q) {
    case 'communes': return 'Dans quelle(s) commune(s) de Provence Verte & Haut-Var souhaitez-vous acheter\ ?'
    case 'budget_max': return 'Quel est votre budget maximum\ ?'
    case 'surface_min': return 'Quelle surface minimum recherchez-vous\ ?'
    case 'nb_pieces_min': return 'Combien de pi\èces minimum\ ?'
    case 'criteres': return 'Quels sont vos crit\ères importants\ ?\n(S\électionnez ceux qui comptent pour vous)'
    case 'apport': return 'Passons au financement. Quel est votre apport disponible\ ?'
    case 'accord_bancaire': return 'Avez-vous un accord de principe bancaire\ ?'
    case 'primo_accedant': return '\Êtes-vous primo-acc\édant\ ?'
    case 'recapitulatif': return buildRecap(a)
    case 'coordonnees': return "Parfait\ ! Pour finaliser, j'ai besoin de vos coordonn\ées."
    default: return ''
  }
}

function ts() { return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
function Avatar() { return <div style={avSt}>AL</div> }
function getCurStep(q: AcheterQuestionId) { for (const s of STEPS) if (s.qs.includes(q)) return s.n; return 1 }

function Stepper({ q }: { q: AcheterQuestionId }) {
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

export default function AcheterPage() {
  const router = useRouter()
  const { messages, currentQuestion, answers, addMessage, setAnswer, setQuestion, reset } = useAcheterStore()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { ref.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, currentQuestion])

  function answer(key: keyof AcheterAnswers, value: AcheterAnswers[keyof AcheterAnswers], display: string) {
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
      body: JSON.stringify({ ...answers, prenom: p, nom: n, telephone: t, email: em, civilite: c, token: tk, type: 'acheter', opt_in: answers.rgpd ?? false }),
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
              <span style={toolPillSt}><span>\�\�</span> Trouver un bien</span>
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
  q: AcheterQuestionId; a: AcheterAnswers
  onAnswer: (k: keyof AcheterAnswers, v: AcheterAnswers[keyof AcheterAnswers], d: string) => void
  onSubmit: (p: string, n: string, t: string, e: string, c: 'monsieur' | 'madame') => void
}) {
  if (q === 'type_bien') return <Cards opts={TYPE_BIEN} cols={2} onPick={(v, l) => onAnswer('type_bien', v, l)} />
  if (q === 'communes') return <TextInput placeholder="Ex\ : Brignoles, Cotignac, Barjols..." onSend={v => onAnswer('communes', v, v)} />
  if (q === 'budget_max') return <SliderInput unit="\€" min={50000} max={2000000} def={300000} step={10000} format={fmt} onOk={v => onAnswer('budget_max', v, fmt(v) + ' \€')} />
  if (q === 'surface_min') return <SliderInput unit="m\²" min={20} max={500} def={80} step={5} onOk={v => onAnswer('surface_min', v, v + ' m\²')} />
  if (q === 'nb_pieces_min') return <Cards opts={['1','2','3','4','5','6+'].map(n => ({ value: n, label: n, emoji: '' }))} cols={3} onPick={(v, l) => onAnswer('nb_pieces_min', parseInt(v) || 6, l + ' pi\èce' + (parseInt(v) !== 1 ? 's' : ''))} />
  if (q === 'criteres') return <MultiSel opts={CRITERES} onOk={sel => onAnswer('criteres', sel, sel.length ? sel.join(', ') : 'Aucun crit\ère particulier')} />
  if (q === 'apport') return <SliderInput unit="\€" min={0} max={500000} def={30000} step={5000} format={fmt} onOk={v => onAnswer('apport', v, fmt(v) + ' \€')} />
  if (q === 'accord_bancaire') return <YesNo onPick={(v, l) => onAnswer('accord_bancaire', v, l)} />
  if (q === 'primo_accedant') return <YesNo onPick={(v, l) => onAnswer('primo_accedant', v, l)} />
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (q === 'recapitulatif') return <RecapConfirm onOk={() => onAnswer('recapitulatif' as any, true as any, "C'est correct \✅")} />
  if (q === 'coordonnees') return <Coordonnees onSubmit={onSubmit} />
  return null
}

function TextInput({ placeholder, onSend }: { placeholder: string; onSend: (v: string) => void }) {
  const [v, setV] = useState('')
  return (
    <div style={_ir}>
      <input style={_inpR} placeholder={placeholder} value={v} onChange={e => setV(e.target.value)} onKeyDown={e => e.key === 'Enter' && v.trim() && onSend(v.trim())} autoFocus />
      <button style={_sendBtn} onClick={() => v.trim() && onSend(v.trim())}><Send size={16} color={WH} /></button>
    </div>
  )
}

function SliderInput({ unit, min, max, def, step, format, onOk }: { unit: string; min: number; max: number; def: number; step?: number; format?: (n: number) => string; onOk: (v: number) => void }) {
  const [v, setV] = useState(def)
  const f = format ?? String
  return (
    <div style={sWr}>
      <div style={_slVal}>{f(v)} {unit}</div>
      <input type="range" min={min} max={max} value={v} step={step ?? 1} onChange={e => setV(+e.target.value)} style={_slInp} />
      <div style={_slRow}>
        <span style={_slLbl}>{f(min)} {unit}</span>
        <span style={_slLbl}>{f(max)} {unit}</span>
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
      <div style={cardS(false)} onClick={() => onPick('Oui', 'Oui \✅')}><span style={_emo}>\✅</span><span>Oui</span></div>
      <div style={cardS(false)} onClick={() => onPick('Non', 'Non')}><span style={_emo}>\❌</span><span>Non</span></div>
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
      <div style={cH}><div style={cBdg}>\�\�</div><div><div style={cT}>Vos coordonn\ées</div><div style={cSb}>Pour recevoir vos r\ésultats</div></div></div>
      <div style={cG}>
        <button style={civS(civ === 'monsieur')} onClick={() => setCiv('monsieur')}>M.</button>
        <button style={civS(civ === 'madame')} onClick={() => setCiv('madame')}>Mme</button>
      </div>
      <div style={cG}>
        <input style={inF} placeholder="Pr\énom" value={p} onChange={e => setP(e.target.value)} />
        <input style={inF} placeholder="Nom" value={n} onChange={e => setN(e.target.value)} />
      </div>
      <input style={inF} type="tel" placeholder="06 XX XX XX XX" value={t} onChange={e => setT(e.target.value)} />
      <input style={inF} type="email" placeholder="votre@email.com" value={em} onChange={e => setEm(e.target.value)} />
      <div style={rgS(rg)} onClick={() => setRg(!rg)}>
        <div style={rgBx(rg)}>{rg && <Check size={12} color={WH} />}</div>
        <span style={rgTx}>J&apos;accepte d&apos;\être recontact\é par Alex Lopez, conseiller immobilier, concernant mon projet immobilier</span>
      </div>
      <button style={ok ? vBtn : vOff} onClick={() => ok && onSubmit(p, n, t, em, civ)} disabled={!ok}><Send size={14} /> Recevoir mes r\ésultats</button>
    </div>
  )
}
