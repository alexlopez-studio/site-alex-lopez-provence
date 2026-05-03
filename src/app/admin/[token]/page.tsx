import {
  verifyMagicToken,
  MagicTokenError,
  type MagicTokenPayload,
} from '@/lib/magic-token'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ token: string }> }

const TYPE_LABEL: Record<string, string> = {
  vendre: 'Estimation vente',
  audit: 'Audit immobilier',
  acheter: 'Recherche achat',
}

const TYPE_BADGE: Record<string, string> = {
  vendre: 'bg-[#E0F0FA] text-[#0077B6]',
  audit: 'bg-[#FEF3C7] text-[#D97706]',
  acheter: 'bg-[#DCFCE7] text-[#16A34A]',
}

function readString(o: Record<string, unknown>, k: string): string | null {
  const v = o[k]
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : null
}

function readNumber(o: Record<string, unknown>, k: string): number | null {
  const v = o[k]
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const n = Number(v)
    if (Number.isFinite(n)) return n
  }
  return null
}

function formatEur(n: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n)
}

function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

/**
 * /admin/[token] — console admin placeholder pour les magic links.
 *
 * V0 (Phase A) : decode le JWT, affiche un resume du dossier prospect
 * (contact, bien, resultats calcules) + liens directs PDF & vue client.
 * Aucune edition possible — lecture seule.
 *
 * V1+ (Phase B) : edition statuts / mandats / activites / notes via le
 * backend Supabase et un vrai systeme d'auth admin (magic link Supabase).
 */
export default async function AdminTokenPage({ params }: Props) {
  const { token } = await params

  let payload: MagicTokenPayload | null = null
  let mtError: MagicTokenError | null = null

  try {
    payload = verifyMagicToken(token)
  } catch (err) {
    if (err instanceof MagicTokenError) {
      mtError = err
    } else {
      console.error('[/admin/[token]] verifyMagicToken inattendu :', err)
    }
  }

  if (mtError || !payload) {
    return <AdminError error={mtError} />
  }

  return <AdminPlaceholder token={token} payload={payload} />
}

function AdminError({ error }: { error: MagicTokenError | null }) {
  let title: string
  let description: string

  if (error?.code === 'expired') {
    title = 'Lien expiré'
    description =
      "Ce lien admin a dépassé sa durée de validité (30 jours). Demande au prospect de refaire une demande pour générer un nouveau lien."
  } else if (error?.code === 'missing_secret') {
    title = 'Erreur serveur'
    description =
      "Le secret JWT n'est pas configuré côté serveur. Impossible de décoder le token. Vérifie MAGIC_LINK_JWT_SECRET."
  } else {
    title = 'Lien invalide'
    description =
      "Ce lien admin est invalide ou corrompu. Vérifie l'URL complète depuis l'email de notification."
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
        <div className="text-[#DC2626] text-3xl mb-3" aria-hidden>⚠️</div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">{title}</h1>
        <p className="text-[#475569] leading-relaxed">{description}</p>
      </div>
    </main>
  )
}

function AdminPlaceholder({
  token,
  payload,
}: {
  token: string
  payload: MagicTokenPayload
}) {
  const fd = (payload.formData ?? {}) as Record<string, unknown>
  const results = (payload.results ?? {}) as Record<string, unknown>
  const prenom = readString(fd, 'prenom')
  const nom = readString(fd, 'nom')
  const email = readString(fd, 'email')
  const telephone = readString(fd, 'telephone') ?? readString(fd, 'tel')
  const ville = readString(fd, 'ville')
  const typeBien = readString(fd, 'type_bien')
  const surface = readNumber(fd, 'surface')

  const typeLabel = TYPE_LABEL[payload.type] ?? payload.type
  const typeBadge =
    TYPE_BADGE[payload.type] ?? 'bg-slate-100 text-slate-700'

  const hasBien =
    (payload.type === 'vendre' || payload.type === 'audit') &&
    Boolean(typeBien || surface || ville)

  const tokenEnc = encodeURIComponent(token)
  const generatedAt = formatDateTime(
    new Date(payload.iat * 1000).toISOString(),
  )
  const expiresAt = formatDateTime(
    new Date(payload.exp * 1000).toISOString(),
  )

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#64748B] font-semibold">
              Console admin · v0
            </p>
            <h1 className="text-3xl font-bold text-[#0F172A] mt-1">
              {prenom
                ? `Dossier ${prenom}${nom ? ` ${nom}` : ''}`
                : 'Dossier prospect'}
            </h1>
          </div>
          <span
            className={`shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${typeBadge}`}
          >
            {typeLabel}
          </span>
        </div>

        {/* Placeholder banner */}
        <div className="bg-[#E0F0FA] border border-[#0077B6]/20 rounded-2xl p-5">
          <p className="text-sm text-[#0077B6] font-semibold mb-1">
            🚧 Console admin v2 — en construction
          </p>
          <p className="text-sm text-[#475569] leading-relaxed">
            La vue admin complète (édition statuts, mandats, historique,
            notes) arrive en Phase B avec le backend Supabase. En attendant,
            voici le résumé du dossier et un accès direct au PDF.
          </p>
        </div>

        {/* Contact */}
        <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <h2 className="text-sm uppercase tracking-wider text-[#64748B] font-semibold mb-4">
            Contact prospect
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Prénom" value={prenom} />
            <Field label="Nom" value={nom} />
            <Field
              label="Email"
              value={email}
              link={email ? `mailto:${email}` : null}
            />
            <Field
              label="Téléphone"
              value={telephone}
              link={telephone ? `tel:${telephone.replace(/\s+/g, '')}` : null}
            />
          </dl>
        </section>

        {/* Bien */}
        {hasBien ? (
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
            <h2 className="text-sm uppercase tracking-wider text-[#64748B] font-semibold mb-4">
              Bien
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Type" value={typeBien} />
              <Field
                label="Surface"
                value={surface !== null ? `${surface} m²` : null}
              />
              <Field label="Ville" value={ville} />
            </dl>
          </section>
        ) : null}

        {payload.type === 'vendre' ? <VendreResults results={results} /> : null}
        {payload.type === 'audit' ? <AuditResults results={results} /> : null}

        {/* Actions */}
        <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <h2 className="text-sm uppercase tracking-wider text-[#64748B] font-semibold mb-4">
            Actions rapides
          </h2>
          <div className="flex flex-wrap gap-3">
            {payload.type === 'vendre' || payload.type === 'audit' ? (
              <a
                href={`/api/pdf?token=${tokenEnc}`}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-[#0077B6] text-white text-sm font-semibold hover:bg-[#005F96] transition"
              >
                Télécharger le PDF
              </a>
            ) : null}
            <a
              href={`/resultats/${tokenEnc}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center px-4 py-2 rounded-xl border border-[#0077B6] text-[#0077B6] text-sm font-semibold hover:bg-[#E0F0FA] transition"
            >
              Vue prospect
            </a>
          </div>
        </section>

        {/* Métadonnées token */}
        <section className="text-xs text-[#64748B] text-center pt-4">
          jti : <code className="font-mono">{payload.jti}</code> · généré le {generatedAt} · expire le {expiresAt}
        </section>
      </div>
    </main>
  )
}

function Field({
  label,
  value,
  link,
}: {
  label: string
  value: string | null
  link?: string | null
}) {
  const content = value ? (
    link ? (
      <a href={link} className="text-[#0077B6] hover:underline">
        {value}
      </a>
    ) : (
      value
    )
  ) : (
    <span className="text-[#94A3B8] italic">non renseigné</span>
  )

  return (
    <div>
      <dt className="text-xs text-[#64748B] mb-1">{label}</dt>
      <dd className="text-sm text-[#0F172A] font-medium">{content}</dd>
    </div>
  )
}

function VendreResults({ results }: { results: Record<string, unknown> }) {
  const valeurMediane = readNumber(results, 'valeur_mediane')
  const fourchetteBasse = readNumber(results, 'fourchette_basse')
  const fourchetteHaute = readNumber(results, 'fourchette_haute')
  const confiance = readNumber(results, 'confiance')
  const nbTransactions = readNumber(results, 'nb_transactions')
  const source = readString(results, 'source')

  if (valeurMediane === null) return null

  const sourceLabel =
    source === 'dvf'
      ? 'DVF (transactions réelles)'
      : source === 'fallback'
        ? 'Indicatif'
        : source

  return (
    <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
      <h2 className="text-sm uppercase tracking-wider text-[#64748B] font-semibold mb-4">
        Estimation calculée
      </h2>
      <div className="bg-[#E0F0FA] rounded-xl p-5 mb-4 text-center">
        <p className="text-xs uppercase tracking-wider text-[#0077B6] font-semibold mb-1">
          Valeur médiane
        </p>
        <p className="text-3xl font-bold text-[#0077B6]">
          {formatEur(valeurMediane)}
        </p>
        {fourchetteBasse !== null && fourchetteHaute !== null ? (
          <p className="text-sm text-[#475569] mt-1">
            {formatEur(fourchetteBasse)} — {formatEur(fourchetteHaute)}
          </p>
        ) : null}
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field
          label="Confiance"
          value={confiance !== null ? `${confiance}%` : null}
        />
        <Field
          label="Transactions DVF"
          value={nbTransactions !== null ? String(nbTransactions) : null}
        />
        <Field label="Source" value={sourceLabel} />
      </dl>
    </section>
  )
}

function AuditResults({ results }: { results: Record<string, unknown> }) {
  const scoreGlobal = readNumber(results, 'score_global')
  const scoreStructure = readNumber(results, 'score_structure')
  const scoreEnergie = readNumber(results, 'score_energie')
  const scoreConfort = readNumber(results, 'score_confort')

  if (scoreGlobal === null) return null

  return (
    <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
      <h2 className="text-sm uppercase tracking-wider text-[#64748B] font-semibold mb-4">
        Audit calculé
      </h2>
      <div className="bg-[#E0F0FA] rounded-xl p-5 mb-4 text-center">
        <p className="text-xs uppercase tracking-wider text-[#0077B6] font-semibold mb-1">
          Score global
        </p>
        <p className="text-4xl font-bold text-[#0077B6]">
          {scoreGlobal}
          <span className="text-xl text-[#64748B]">/100</span>
        </p>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field
          label="Structure"
          value={scoreStructure !== null ? `${scoreStructure}/100` : null}
        />
        <Field
          label="Énergie"
          value={scoreEnergie !== null ? `${scoreEnergie}/100` : null}
        />
        <Field
          label="Confort"
          value={scoreConfort !== null ? `${scoreConfort}/100` : null}
        />
      </dl>
    </section>
  )
}
