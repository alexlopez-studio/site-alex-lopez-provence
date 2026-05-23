'use client'

import { useEffect, useState } from 'react'
import ResultatsClient, { type ResultatsClientInitialData } from './resultats-client'

type StoredLeadResult = {
  type?: string
  answers?: Record<string, unknown>
  results?: Record<string, unknown>
  updatedAt?: number
}

export default function ResultatsLoaderClient({
  token,
  initialData,
}: {
  token: string
  initialData?: ResultatsClientInitialData
}) {
  const [clientData, setClientData] = useState<ResultatsClientInitialData | undefined>(initialData)
  const [ready, setReady] = useState(Boolean(initialData))

  useEffect(() => {
    if (initialData) return

    const stored = readStoredLeadResult(token)
    if (stored) setClientData(stored)
    setReady(true)
  }, [initialData, token])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-base text-muted">Préparation de vos résultats...</p>
      </div>
    )
  }

  return <ResultatsClient initialData={clientData} />
}

function readStoredLeadResult(token: string): ResultatsClientInitialData | undefined {
  try {
    const raw = localStorage.getItem('lead-result-' + token)
    if (!raw) return undefined

    const parsed = JSON.parse(raw) as StoredLeadResult
    if (parsed.type !== 'vendre') return undefined
    if (!parsed.answers || typeof parsed.answers !== 'object') return undefined
    if (!parsed.results || typeof parsed.results !== 'object') return undefined

    return {
      data: parsed.answers,
      est: parsed.results,
    }
  } catch {
    return undefined
  }
}
