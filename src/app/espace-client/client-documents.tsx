'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Info,
  Loader2,
  Upload,
  UploadCloud,
} from 'lucide-react'
import type { ClientDocumentWithUrl } from '@/lib/client-portal'

const STATUS_LABELS: Record<string, string> = {
  missing: 'MANQUANT',
  requested: 'À FOURNIR',
  uploaded: 'REÇU · EN COURS',
  validated: 'VALIDÉ PAR ALEXANDRE',
  rejected: 'REFUSÉ / ILLISIBLE',
}

const STATUS_PILL_CLASSES: Record<string, string> = {
  missing: 'border-[#F5C56B] bg-[#FFF8E8] text-[#B26A00]',
  requested: 'border-[#F5C56B] bg-[#FFF8E8] text-[#B26A00]',
  uploaded: 'border-[#B9DFF4] bg-[#E0F0FA] text-[#0077B6]',
  validated: 'border-[#9BE7C0] bg-[#ECFDF5] text-[#10B981]',
  rejected: 'border-[#FDB9B9] bg-[#FFF1F2] text-[#EF4444]',
}

const STATUS_ICON_CLASSES: Record<string, string> = {
  missing: 'bg-[#FFF8E8] text-[#B26A00]',
  requested: 'bg-[#FFF8E8] text-[#B26A00]',
  uploaded: 'bg-[#E0F0FA] text-[#0077B6]',
  validated: 'bg-[#ECFDF5] text-[#10B981]',
  rejected: 'bg-[#FFF1F2] text-[#EF4444]',
}

const UPLOADABLE_STATUSES = new Set(['missing', 'requested', 'rejected'])
const PROVIDED_STATUSES = new Set(['uploaded', 'validated'])

export function ClientDocuments({
  dossierId,
  documents,
  readOnly = false,
  commune,
}: {
  dossierId: string
  documents: ClientDocumentWithUrl[]
  readOnly?: boolean
  commune?: string | null
}) {
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const total = documents.length
  const provided = documents.filter((document) => PROVIDED_STATUSES.has(document.status)).length
  const progress = total ? Math.round((provided / total) * 100) : 0
  const diagnosticsLocation = commune ? `${commune} / Var` : 'Provence Verte / Var'

  async function upload(document: ClientDocumentWithUrl | null, file: File | null) {
    if (!file || readOnly) return
    const uploadKey = document?.id ?? 'global'
    setUploadingId(uploadKey)
    setError(null)

    try {
      const body = new FormData()
      body.set('dossier_id', dossierId)
      if (document) {
        body.set('document_id', document.id)
        body.set('label', document.label)
      } else {
        body.set('label', 'Document complémentaire')
      }
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
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-[19px] font-extrabold leading-tight text-[#0F172A]">
              Dossier administratif & Pièces justificatives
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
              La constitution précoce d&apos;un dossier complet évite de perdre des acquéreurs potentiels.
              Chaque pièce fournie est vérifiée par Alexandre Lopez avant d&apos;être transmise au notaire.
            </p>
          </div>

          <div className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 md:w-64">
            <div className="flex items-center justify-between text-[11px] font-extrabold uppercase text-[#64748B]">
              <span>Avancement</span>
              <span className="text-[#0077B6]">{provided} / {total} documents</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#DCE5EE]">
              <div className="h-full rounded-full bg-[#0077B6]" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-center text-[11px] leading-snug text-[#64748B]">
              {progress === 100 ? 'Votre dossier est complet.' : 'Encore un effort pour finaliser votre dossier.'}
            </p>
          </div>
        </div>
      </section>

      <UploadDropzone
        disabled={readOnly || uploadingId !== null}
        uploading={uploadingId === 'global'}
        onFile={(file) => upload(null, file)}
      />

      {error && (
        <p className="rounded-2xl border border-[#EF4444]/20 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#EF4444]">
          {error}
        </p>
      )}

      <section className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-[13px] font-extrabold uppercase tracking-normal text-[#64748B]">
            Liste des pièces réglementaires
          </h3>
          <p className="text-xs font-semibold text-[#64748B]">Trier par : Obligatoires d&apos;abord</p>
        </div>

        {documents.length > 0 ? (
          <div className="divide-y divide-[#E2E8F0]">
            {documents.map((document) => (
              <DocumentRow
                key={document.id}
                document={document}
                readOnly={readOnly}
                uploading={uploadingId === document.id}
                onFile={(file) => upload(document, file)}
              />
            ))}
          </div>
        ) : (
          <div className="px-5 py-10 text-center text-sm text-[#64748B]">
            La checklist documentaire sera ajoutée par Alexandre.
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
        <h3 className="flex items-center gap-2 text-[13px] font-extrabold uppercase text-[#0F172A]">
          <Info className="size-4 text-[#0077B6]" />
          Détails sur les diagnostics requis à {diagnosticsLocation}
        </h3>
        <p className="mt-4 text-xs leading-relaxed text-[#64748B]">
          Pour une maison individuelle construite avant 1997 en Provence Verte, les diagnostics Amiante,
          DPE (Diagnostic Performance Énergétique), Électricité et Termites sont généralement requis.
          Les termites font l&apos;objet d&apos;un arrêté préfectoral spécifique dans le Var (83) ; le rapport
          doit dater de moins de 6 mois au jour de la signature de l&apos;acte authentique.
        </p>
      </section>
    </div>
  )
}

function UploadDropzone({
  disabled,
  uploading,
  onFile,
}: {
  disabled: boolean
  uploading: boolean
  onFile: (file: File | null) => void
}) {
  const content = (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-3xl border border-dashed border-[#D5E1EC] bg-white px-6 py-10 text-center transition-colors hover:border-[#B9DFF4] hover:bg-[#F8FAFC]">
      <span className="flex size-12 items-center justify-center rounded-full bg-[#E0F0FA] text-[#0077B6]">
        {uploading ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
      </span>
      <p className="mt-4 text-sm font-extrabold text-[#0F172A]">
        Glissez-déposez une pièce ou cliquez ici
      </p>
      <p className="mt-1 text-xs text-[#64748B]">Formats acceptés : PDF, PNG, JPEG jusqu&apos;à 10 Mo</p>
    </div>
  )

  if (disabled) return <div aria-disabled>{content}</div>

  return (
    <label className="block cursor-pointer">
      {content}
      <input
        type="file"
        className="sr-only"
        accept=".pdf,image/png,image/jpeg"
        disabled={disabled}
        onChange={(event) => onFile(event.target.files?.[0] ?? null)}
      />
    </label>
  )
}

function DocumentRow({
  document,
  readOnly,
  uploading,
  onFile,
}: {
  document: ClientDocumentWithUrl
  readOnly: boolean
  uploading: boolean
  onFile: (file: File | null) => void
}) {
  const canUpload = UPLOADABLE_STATUSES.has(document.status)
  const statusLabel = STATUS_LABELS[document.status] ?? document.status
  const statusClass = STATUS_PILL_CLASSES[document.status] ?? STATUS_PILL_CLASSES.requested
  const iconClass = STATUS_ICON_CLASSES[document.status] ?? STATUS_ICON_CLASSES.requested

  return (
    <article className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_190px] lg:items-start">
      <div className="flex min-w-0 gap-4">
        <span className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
          {document.status === 'validated' ? <CheckCircle2 className="size-5" /> : <FileText className="size-5" />}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-extrabold leading-tight text-[#0F172A]">{document.label}</h4>
            <span className="rounded-md border border-[#FECACA] bg-[#FFF1F2] px-2 py-0.5 text-[10px] font-extrabold uppercase leading-none text-[#EF4444]">
              Requis
            </span>
          </div>

          <DocumentMeta document={document} />

          {document.notes && (
            <p className={`mt-3 flex w-full max-w-[680px] rounded-xl border px-3 py-2 text-xs leading-relaxed ${
              document.status === 'rejected'
                ? 'border-[#FDB9B9] bg-[#FFF1F2] text-[#EF4444]'
                : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]'
            }`}>
              {document.status === 'rejected' && <AlertTriangle className="mr-2 mt-0.5 size-3.5 shrink-0" />}
              <span>
                <strong>{document.status === 'rejected' ? 'Motif du refus : ' : 'Commentaire : '}</strong>
                {document.notes}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
        <span className={`inline-flex h-7 max-w-full items-center justify-center whitespace-nowrap rounded-full border px-3 text-[11px] font-extrabold uppercase leading-none ${statusClass}`}>
          {statusLabel}
        </span>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {document.signed_url && (
            <a
              href={document.signed_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 text-xs font-extrabold text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
            >
              Voir
              <ArrowUpRight className="size-3.5 text-[#0077B6]" />
            </a>
          )}

          {!readOnly && canUpload && (
            <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-[#0077B6] px-3 text-xs font-extrabold text-white transition-colors hover:bg-[#005F96]">
              {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <UploadCloud className="size-3.5" />}
              {document.status === 'rejected' ? 'Remplacer' : 'Téléverser'}
              <input
                type="file"
                className="sr-only"
                accept=".pdf,image/png,image/jpeg"
                disabled={uploading}
                onChange={(event) => onFile(event.target.files?.[0] ?? null)}
              />
            </label>
          )}
        </div>
      </div>
    </article>
  )
}

function DocumentMeta({ document }: { document: ClientDocumentWithUrl }) {
  if (!document.file_name && ['missing', 'requested'].includes(document.status)) {
    return <p className="mt-1 text-xs font-medium text-[#B26A00]">Non fourni à ce jour</p>
  }

  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#64748B]">
      {document.uploaded_at && <span>Fourni le {formatDate(document.uploaded_at)}</span>}
      {document.file_name && !document.uploaded_at && <span>{document.file_name}</span>}
      {document.file_size && (
        <>
          <span aria-hidden>•</span>
          <span>{formatFileSize(document.file_size)}</span>
        </>
      )}
      {document.validated_at && (
        <>
          <span aria-hidden>•</span>
          <span>Validé le {formatDate(document.validated_at)}</span>
        </>
      )}
    </p>
  )
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatFileSize(value: number) {
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} Ko`
  return `${(value / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`
}
