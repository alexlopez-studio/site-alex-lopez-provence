'use client'

import type { CSSProperties } from 'react'
import { Check, MapPin } from 'lucide-react'

const B = '#0077B6', BL = '#E0F0FA', FG = '#0F172A', BD = '#E2E8F0', WH = '#ffffff', SU = '#10B981'
const _emo: CSSProperties = { fontSize: 20 }

function cardS(a: boolean): CSSProperties {
  return { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 10px', borderRadius: 14, cursor: 'pointer', border: '2px solid ' + (a ? B : BD), background: a ? BL : WH, fontSize: 13, fontWeight: 600, color: a ? B : FG, textAlign: 'center', width: '100%' }
}

export function Cards({ opts, cols, onPick }: { opts: { value: string; label: string; emoji: string }[]; cols: number; onPick: (v: string, l: string) => void }) {
  const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(' + cols + ',1fr)', gap: 10 }
  return (
    <div style={grid}>
      {opts.map(o => (
        <div key={o.value} style={cardS(false)} onClick={() => onPick(o.value, o.label)}>
          {o.emoji && <span style={_emo}>{o.emoji}</span>}
          <span>{o.label}</span>
        </div>
      ))}
    </div>
  )
}

export function RecapConfirm({ onOk }: { onOk: () => void }) {
  const wrap: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr', gap: 12 }
  const btn: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '18px 12px', borderRadius: 16, cursor: 'pointer', border: '2px solid ' + SU, background: '#f0fdf4', fontSize: 13, fontWeight: 600, color: SU }
  return (
    <div style={wrap}>
      <div style={btn} onClick={onOk}>
        <Check size={20} />C&apos;est correct
      </div>
    </div>
  )
}

const _sugItBase: CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', fontSize: 13, color: FG, cursor: 'pointer' }

export function SuggestionItem({ label, isLast, onPick }: { label: string; isLast: boolean; onPick: () => void }) {
  const st: CSSProperties = { ..._sugItBase, borderBottom: isLast ? 'none' : '1px solid ' + BD }
  return (
    <div onClick={onPick} style={st}>
      <MapPin size={13} color={B} />{label}
    </div>
  )
}
