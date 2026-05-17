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
  dpe?: string
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
  | 'dpe'
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
    text: "Bonjour, je suis Alex Lopez.\n\nJe vais vous aider à obtenir un premier repère de valeur pour votre bien. L’objectif n’est pas de remplacer une visite ou une analyse humaine, mais de cadrer le sujet : adresse, type de bien, surface, état, DPE et projet de vente.\n\nCommençons par l’adresse du bien.",
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
