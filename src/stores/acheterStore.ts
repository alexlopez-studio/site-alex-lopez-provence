import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AcheterAnswers {
  type_bien?: string
  communes?: string[]
  budget_max?: number
  surface_min?: number
  nb_pieces_min?: number
  rdc_ok?: boolean
  parking_indispensable?: boolean
  exterieur_indispensable?: boolean
  dpe_souhaite?: string[]
  travaux_ok?: boolean
  apport?: number
  accord_bancaire?: boolean
  primo_accedant?: boolean
  prenom?: string
  nom?: string
  telephone?: string
  email?: string
  opt_in?: boolean
}

interface AcheterState {
  answers: AcheterAnswers
  currentStep: number
  setAnswer: (key: keyof AcheterAnswers, value: AcheterAnswers[keyof AcheterAnswers]) => void
  setStep: (step: number) => void
  reset: () => void
}

export const useAcheterStore = create<AcheterState>()(
  persist(
    (set) => ({
      answers: {},
      currentStep: 1,
      setAnswer: (key, value) =>
        set((s) => ({ answers: { ...s.answers, [key]: value } })),
      setStep: (step) => set({ currentStep: step }),
      reset: () => set({ answers: {}, currentStep: 1 }),
    }),
    { name: 'acheter-store' }
  )
)
