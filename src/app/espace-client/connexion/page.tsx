'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Loader2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ClientLoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/client/auth/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Envoi impossible')
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible d’envoyer le lien')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-product client-portal min-h-screen bg-background px-4 py-10 text-foreground sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section>
          <div className="portal-label mb-5 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-primary">
            <LockKeyhole className="size-4" /> Espace vendeur sécurisé
          </div>
          <h1 className="portal-h1 max-w-2xl text-foreground">
            Retrouvez votre dossier de vente en ligne.
          </h1>
          <p className="portal-body mt-5 max-w-xl text-muted-foreground">
            Accédez à votre synthèse, aux prochaines étapes et aux documents à transmettre avec un lien de connexion personnel envoyé par email.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="portal-body rounded-3xl border border-border bg-white p-4 text-muted-foreground shadow-sm">
              <ShieldCheck className="mb-3 size-5 text-primary" />
              Données limitées à votre dossier.
            </div>
            <div className="portal-body rounded-3xl border border-border bg-white p-4 text-muted-foreground shadow-sm">
              <Mail className="mb-3 size-5 text-primary" />
              Connexion sans mot de passe.
            </div>
            <div className="portal-body rounded-3xl border border-border bg-white p-4 text-muted-foreground shadow-sm">
              <ArrowRight className="mb-3 size-5 text-primary" />
              Suivi clair des prochaines étapes.
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-white p-6 shadow-sm md:p-8">
          {sent ? (
            <div className="space-y-4">
              <div className="flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                <Mail className="size-5" />
              </div>
              <div>
                <h2 className="portal-h2 text-foreground">Lien envoyé</h2>
                <p className="portal-body mt-2 text-muted-foreground">
                  Consultez votre boîte mail et cliquez sur le lien reçu pour ouvrir votre espace vendeur.
                </p>
              </div>
              <Button asChild variant="outline" className="h-11 w-full rounded-full border-border bg-white text-foreground hover:bg-background">
                <Link href="/">Retour au site</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <h2 className="portal-h2 text-foreground">Recevoir mon lien</h2>
                <p className="portal-body mt-2 text-muted-foreground">
                  Utilisez l’email communiqué à Alexandre pour votre projet vendeur.
                </p>
              </div>
              <label className="block space-y-2">
                <span className="portal-button-text text-foreground">Email</span>
                <Input
                  className="h-12 rounded-2xl"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="vous@email.fr"
                />
              </label>
              {error && (
                <p className="portal-body rounded-2xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-destructive">
                  {error}
                </p>
              )}
              <Button type="submit" className="h-12 w-full rounded-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Mail className="mr-2 size-4" />}
                Envoyer le lien
              </Button>
            </form>
          )}
        </section>
      </div>
    </main>
  )
}
