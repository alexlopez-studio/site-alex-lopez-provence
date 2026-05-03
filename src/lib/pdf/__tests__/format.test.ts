import { describe, it, expect } from 'vitest'
import {
  formatEur,
  formatEurPerM2,
  formatSignedEur,
  formatSignedPct,
  formatDateFr,
  sanitizeFilename,
} from '../format'

describe('formatEur', () => {
  it('formatte les valeurs euro entieres en fr-FR', () => {
    const out = formatEur(285000)
    expect(out).toMatch(/285/)
    expect(out).toMatch(/\u20ac/)
  })

  it('renvoie le fallback em-dash pour NaN ou Infinity', () => {
    expect(formatEur(Number.NaN)).toBe('\u2014')
    expect(formatEur(Number.POSITIVE_INFINITY)).toBe('\u2014')
  })
})

describe('formatEurPerM2', () => {
  it('contient le suffixe \u20ac/m\u00b2', () => {
    expect(formatEurPerM2(3200)).toContain('\u20ac/m\u00b2')
  })

  it('arrondit a l\u2019entier', () => {
    expect(formatEurPerM2(3199.7)).toContain('3')
    expect(formatEurPerM2(3199.7)).toContain('200')
  })

  it('renvoie le fallback pour valeur non finie', () => {
    expect(formatEurPerM2(Number.NaN)).toBe('\u2014')
  })
})

describe('formatSignedEur', () => {
  it('prefixe les positifs avec +', () => {
    expect(formatSignedEur(5000).startsWith('+')).toBe(true)
  })

  it('ne prefixe pas zero ou negatif', () => {
    expect(formatSignedEur(0).startsWith('+')).toBe(false)
    expect(formatSignedEur(-1000).startsWith('+')).toBe(false)
  })
})

describe('formatSignedPct', () => {
  it('formatte les positifs avec + prefixe', () => {
    expect(formatSignedPct(5.2)).toBe('+5.2%')
  })

  it('formatte les negatifs sans + en plus', () => {
    expect(formatSignedPct(-3.1)).toBe('-3.1%')
  })

  it('formatte zero sans prefixe', () => {
    expect(formatSignedPct(0)).toBe('0%')
  })
})

describe('formatDateFr', () => {
  it('renvoie une date longue francaise pour ISO valide', () => {
    const out = formatDateFr('2026-05-03T10:00:00Z')
    expect(out).toMatch(/mai/i)
    expect(out).toContain('2026')
  })

  it('renvoie chaine vide pour ISO invalide', () => {
    expect(formatDateFr('not-a-date')).toBe('')
  })
})

describe('sanitizeFilename', () => {
  it('garde les caracteres ASCII safes', () => {
    expect(sanitizeFilename('estimation_alex_2026.pdf')).toBe(
      'estimation_alex_2026.pdf',
    )
  })

  it('remplace espaces et caracteres speciaux par _', () => {
    expect(sanitizeFilename('mon dossier!.pdf')).toBe('mon_dossier_.pdf')
  })

  it('collapse les _ multiples', () => {
    expect(sanitizeFilename('a   b')).toBe('a_b')
  })

  it('trim les _ en bord', () => {
    expect(sanitizeFilename('___hello___')).toBe('hello')
  })

  it('garde les chiffres et points et tirets', () => {
    expect(sanitizeFilename('audit-2026-05.pdf')).toBe('audit-2026-05.pdf')
  })
})
