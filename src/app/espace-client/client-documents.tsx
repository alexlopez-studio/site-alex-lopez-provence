'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle2, Download, FileText, FileUp, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ClientDocumentWithUrl } from '@/lib/client-portal'

const STATUS_LABELS: Record<string, string> = {
  missing: 'Manquant',
  requested: 'À fournir',
  uploaded: 'Reçu',
  validated: 'Validé',
  rejected: 'À reprendre',
}

const STATUS_CLASSES: Record<string, string> = {
  missing: 'client-status-badge--missing',
  requested: 'client-status-badge--requested',
  uploaded: 'client-status-badge--uploaded',
  validated: 'client-status-badge--validated',
  rejected: 'client-status-badge--rejected',
}

const STATUS_ICON_CLASSES: Record<string, string> = {
  missing: 'bg-[#B26A00]/10 text-[#B26A00]',
  requested: 'bg-[#E0F0FA] text-[#0077B6]',
  uploaded: 'bg-[#E0F0FA] text-[#0077B6]',
  validated: 'bg-[#10B981]/10 text-[#10B981]',
  rejected: 'bg-[#EF4444]/10 text-[#EF4444]',
}

const UPLOADABLE_STATUSES = new Set(['missing', 'requested', 'rejected'])

export function ClientDocuments({
  dossierId,
  documents,
  readOnly = false,
}: {
  dossierId: string
  documents: ClientDocumentWithUrl[]
  readOnly?: boolean
}) {
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function upload(document: ClientDocumentWithUrl, file: File | null) {
    if (!file) return
    setUploadingId(document.id)
    setError(null)

    try {
      const body = new FormData()
      body.set('dossier_id', dossierId)
      body.set('document_id', document.id)
      body.set('label', document.label)
      body.set('file', file)

      const res = await fetch('/api/client/documents', {
        method: 'POST',
        body,
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Upload impossible')
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible d’envoyer le document')
    } finally {
      setUploadingId(null)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="portal-body rounded-2xl border border-[#EF4444]/20 bg-[#EF4444]/10 px-3 py-2 text-[#EF4444]">
          {error}
        </p>
      )}
      {documents.map((document) => {
        const isUploading = uploadingId === document.id
        const canUpload = UPLOADABLE_STATUSES.has(document.status)
        return (
          <div key={document.id} className="rounded-3xl border border-[#E2E8F0] bg-white p-4 transition-colors hover:bg-[#F8FAFC]">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-2xl ${STATUS_ICON_CLASSES[document.status] ?? STATUS_ICON_CLASSES.requested}`}>
                    {document.status === 'validated' ? <CheckCircle2 className="size-5" /> : <FileText className="size-5" />}
                  </span>
                  <div className="min-w-0">
                    <p className="portal-h3 text-foreground">{document.label}</p>
                    <p className="portal-meta mt-0.5 text-muted-foreground">{document.category}</p>
                  </div>
                  <span className={'client-status-badge ' + (STATUS_CLASSES[document.status] ?? STATUS_CLASSES.requested)}>
                    {STATUS_LABELS[document.status] ?? document.status}
                  </span>
                </div>

                <div className="portal-meta mt-3 flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground">
                  <span>{document.file_name ?? 'Aucun fichier déposé'}</span>
                  {document.file_size && <span>{formatFileSize(document.file_size)}</span>}
                  {document.uploaded_at && <span>Fourni le {formatDate(document.uploaded_at)}</span>}
                  {document.validated_at && <span>Validé le {formatDate(document.validated_at)}</span>}
                </div>

                {document.notes && (
                  <p className={`portal-body mt-3 rounded-lg border px-3 py-2 ${
                    document.status === 'rejected'
                      ? 'border-[#EF4444]/20 bg-[#EF4444]/10 text-[#EF4444]'
                      : 'border-[#E2E8F0] bg-[#F8FAFC] text-muted-foreground'
                  }`}>
                    {document.status === 'rejected' && <AlertTriangle className="mr-2 inline size-4 align-text-bottom" />}
                    <strong>{document.status === 'rejected' ? 'Motif du refus : ' : 'Commentaire : '}</strong>
                    {document.notes}
                  </p>
                )}
             </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                {document.signed_url && (
                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <a href={document.signed_url} target="_blank" rel="noreferrer">
                      <Download className="mr-2 size-4" /> Ouvrir
                    </a>
                  </Button>
                )}
                {readOnly ? (
                  <span className="portal-button-text inline-flex h-9 items-center rounded-full border px-3 text-muted-foreground">
                    Lecture test
                  </span>
                ) : document.status === 'validated' ? (
                  <span className="portal-button-text inline-flex h-9 items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-3 text-[#10B981]">
                    <CheckCircle2 className="size-4" /> Validé
                  </span>
                ) : canUpload ? (
                  <label className="portal-button-text inline-flex h-9 cursor-pointer items-center justify-center rounded-full bg-brand px-3 text-white transition-colors hover:bg-brand-hover">
                    {isUploading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Upload className="mr-2 size-4" />}
                    {document.status === 'rejected' ? 'Remplacer' : 'Déposer'}
                    <input
                      type="file"
                      className="sr-only"
                      disabled={isUploading}
                      onChange={(event) => upload(document, event.target.files?.[0] ?? null)}
                    />
                  </label>
                ) : (
                  <span className="portal-button-text inline-flex h-9 items-center rounded-full border px-3 text-muted-foreground">
                    En validation
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
      {documents.length === 0 && (
        <div className="portal-body rounded-lg border border-dashed bg-white p-6 text-center text-muted-foreground">
          <FileUp className="mx-auto mb-3 size-6 text-brand" />
          La checklist documentaire sera ajoutée par Alexandre.
        </div>
      )}
    </div>
  )
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatFileSize(value: number) {
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} Ko`
  return `${(value / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`
}
