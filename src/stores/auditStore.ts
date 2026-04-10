import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuditAnswers {
  adresse?: string
  lat?: number
  lng?: number
  type_bien?: string
  surface?: number
  etat_toiture?: 'bon' | 'moyen' | 'mauvais' | 'nc'
  etat_facade?: 'bon' | 'moyen' | 'mauvais' | 'nc'
  etat_menuiseries?: 'bon' | 'moyen' | 'mauvais' | 'nc'
  etat_plomberie?: 'bon' | 'moyen' | 'mauvais' | 'nc'
  etat_electricite?: 'bon' | 'moyen' | 'mauvais' | 'nc'
  humidite?: boolean
  isolation_murs?: 'bonne' | 'partielle' | 'absente' | 'nc'
  isolation_combles?: 'bonne' | 'partielle' | 'absente' | 'nc'
  isolation_fenetres?: 'double_vitrage' | 'simple_vitrage' | 'nc'
  type_chauffage?: string
  age_chauffage?: number
  dpe?: string
  qualite?: 'proprietaire' | 'acheteur_potentiel'
  objectif?: 'vente' | 'achat' | 'renovation' | 'energie'
  prenom?: string
  nom?: string
  telephone?: string
  email?: string
  opt_in?: boolean
}

interface AuditState {
  answers: AuditAnswers
  currentStep: number
  setAnswer: (key: keyof AuditAnswers, value: AuditAnswers[keyof AuditAnswers]) => void
  setStep: (step: number) => void
  reset: () => void
}

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      answers: {},
      currentStep: 1,
      setAnswer: (key, value) =>
        set((s) => ({ answers: { ...s.answers, [key]: value } })),
      setStep: (step) => set({ currentStep: step }),
      reset: () => set({ answers: {}, currentStep: 1 }),
    }),
    { name: 'audit-store' }
  )
)
