import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ChatMessage {
  id: string
  from: 'al' | 'user'
  text: string
  timestamp: string
}

export interface VendreAnswers {
  adresse?: string
  lat?: number
  lng?: number
  cadastre_surface?: number | null
  type_bien?: string
  sous_type?: string
  surface?: number
  surface_terrain?: number
  nb_pieces?: number
  etat?: string
  equipements?: string[]
  delai?: string
  civilite?: 'monsieur' | 'madame'
  prenom?: string
  nom?: string
  telephone?: string
  email?: string
  rgpd?: boolean
}

export type QuestionId =
  | 'adresse'
  | 'type_bien'
  | 'sous_type_maison'
  | 'surface'
  | 'surface_terrain'
  | 'nb_pieces'
  | 'etat'
  | 'equipements'
  | 'delai'
  | 'recapitulatif'
  | 'coordonnees'
  | 'done'

interface VendreState {
  messages: ChatMessage[]
  currentQuestion: QuestionId
  answers: VendreAnswers
  addMessage: (msg: Omit<ChatMessage, 'id'>) => void
  setAnswer: (key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers]) => void
  setQuestion: (q: QuestionId) => void
  reset: () => void
}

function now() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    from: 'al',
    text: "Bonjour\u00a0! Je suis Alex Lopez, votre conseiller immobilier. Je vais vous aider \u00e0 estimer la valeur de votre bien en quelques minutes.\n\nCommen\u00e7ons par l'adresse de votre bien s'il vous pla\u00eet\u00a0!",
    timestamp: now(),
  },
]

const initial = {
  messages: INITIAL_MESSAGES,
  currentQuestion: 'adresse' as QuestionId,
  answers: {} as VendreAnswers,
}

export const useVendreStore = create<VendreState>()(
  persist(
    (set) => ({
      ...initial,
      addMessage: (msg) =>
        set((s) => ({ messages: [...s.messages, { ...msg, id: Date.now().toString() }] })),
      setAnswer: (key, value) =>
        set((s) => ({ answers: { ...s.answers, [key]: value } })),
      setQuestion: (q) => set({ currentQuestion: q }),
      reset: () => set(initial),
    }),
    { name: 'vendre-store' }
  )
)
