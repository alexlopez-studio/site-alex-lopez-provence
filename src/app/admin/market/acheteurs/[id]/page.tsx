'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Loader2, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import communesData from '@/data/communes.json'

type CommuneEntry = {
  name: string
  postalCode: string
  department: string
  region: string
}

const COMMUNES: CommuneEntry[] = (communesData as CommuneEntry[]).sort((a, b) =>
  a.name.localeCompare(b.name, 'fr')
)

export default function EditAcquereurPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    type_bien: '',
    communes: [] as string[],
    budget_max: '',
    surface_min: '',
    pieces_min: '',
    criteres: [] as string[],
    active: true,
  })
  const [communeSearch, setCommuneSearch] = useState('')
  const [critereInput, setCritereInput] = useState('')

  useEffect(() => {
    const loadBuyer = async () => {
      try {
        const res = await fetch(`/api/market/buyers/${leadId}`)
        if (!res.ok) {
          toast.error('Acquéreur non trouvé')
          router.push('/admin/market/acheteurs')
          return
        }
        const data = await res.json()
        const buyer = data.buyer
        setForm({
          type_bien: buyer.type_bien || '',
          communes: buyer.communes || [],
          budget_max: buyer.budget_max?.toString() || '',
          surface_min: buyer.surface_min?.toString() || '',
          pieces_min: buyer.pieces_min?.toString() || '',
          criteres: buyer.criteres || [],
          active: buyer.active,
        })
      } catch (e) {
        console.error('Erreur chargement:', e)
        toast.error('Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }
    loadBuyer()
  }, [leadId, router])

  const filteredCommunes = communeSearch
    ? COMMUNES.filter(
        (c) =>
          c.name.toLowerCase().includes(communeSearch.toLowerCase()) ||
          c.postalCode.includes(communeSearch)
      ).slice(0, 20)
    : []

  const addCommune = (commune: string) => {
    if (!form.communes.includes(commune)) {
      setForm((prev) => ({ ...prev, communes: [...prev.communes, commune] }))
    }
    setCommuneSearch('')
  }

  const removeCommune = (commune: string) => {
    setForm((prev) => ({
      ...prev,
      communes: prev.communes.filter((c) => c !== commune),
    }))
  }

  const addCritere = () => {
    const value = critereInput.trim()
    if (value && !form.criteres.includes(value)) {
      setForm((prev) => ({ ...prev, criteres: [...prev.criteres, value] }))
    }
    setCritereInput('')
  }

  const removeCritere = (critere: string) => {
    setForm((prev) => ({
      ...prev,
      criteres: prev.criteres.filter((c) => c !== critere),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/market/buyers/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type_bien: form.type_bien || null,
          communes: form.communes.length > 0 ? form.communes : null,
          budget_max: form.budget_max ? Number(form.budget_max) : null,
          surface_min: form.surface_min ? Number(form.surface_min) : null,
          pieces_min: form.pieces_min ? Number(form.pieces_min) : null,
          criteres: form.criteres.length > 0 ? form.criteres : null,
          active: form.active,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Erreur lors de la mise à jour')
        return
      }

      toast.success('Acquéreur mis à jour')
    } catch (e) {
      console.error('Erreur mise à jour:', e)
      toast.error('Erreur serveur')
    } finally {
      setSaving(false)
    }
  }

  const handleDesactivate = async () => {
    try {
      const res = await fetch(`/api/market/buyers/${leadId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Acquéreur désactivé')
        setForm((prev) => ({ ...prev, active: false }))
      }
    } catch (e) {
      console.error('Erreur désactivation:', e)
      toast.error('Erreur serveur')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Chargement...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/market/acheteurs">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Modifier l'acquéreur
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Lead ID: {leadId}
              <Badge variant={form.active ? 'default' : 'secondary'} className="ml-2 text-[10px]">
                {form.active ? 'Actif' : 'Inactif'}
              </Badge>
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDesactivate}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Désactiver
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Critères de recherche</CardTitle>
            <CardDescription>
              Modifiez les critères de recherche de l'acquéreur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type de bien */}
            <div className="space-y-2">
              <Label htmlFor="type_bien">Type de bien recherché</Label>
              <Select
                value={form.type_bien}
                onValueChange={(value) => setForm((prev) => ({ ...prev, type_bien: value }))}
              >
                <SelectTrigger id="type_bien" className="max-w-xs">
                  <SelectValue placeholder="Tous types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maison">Maison</SelectItem>
                  <SelectItem value="appartement">Appartement</SelectItem>
                  <SelectItem value="terrain">Terrain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Communes */}
            <div className="space-y-2">
              <Label>Communes recherchées</Label>
              <div className="relative max-w-md">
                <Input
                  placeholder="Rechercher une commune..."
                  value={communeSearch}
                  onChange={(e) => setCommuneSearch(e.target.value)}
                />
                {communeSearch && filteredCommunes.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg max-h-48 overflow-y-auto">
                    {filteredCommunes.map((c) => (
                      <button
                        key={`${c.postalCode}-${c.name}`}
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => addCommune(c.name)}
                      >
                        {c.name} ({c.postalCode})
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {form.communes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {form.communes.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 rounded-full bg-brand/10 text-brand text-xs px-2.5 py-1"
                    >
                      {c}
                      <button
                        type="button"
                        className="hover:text-destructive"
                        onClick={() => removeCommune(c)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Budget max */}
            <div className="space-y-2">
              <Label htmlFor="budget_max">Budget maximum (€)</Label>
              <Input
                id="budget_max"
                type="number"
                placeholder="Ex: 300000"
                value={form.budget_max}
                onChange={(e) => setForm((prev) => ({ ...prev, budget_max: e.target.value }))}
                className="max-w-xs"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Surface min */}
              <div className="space-y-2">
                <Label htmlFor="surface_min">Surface minimale (m²)</Label>
                <Input
                  id="surface_min"
                  type="number"
                  placeholder="Ex: 70"
                  value={form.surface_min}
                  onChange={(e) => setForm((prev) => ({ ...prev, surface_min: e.target.value }))}
                />
              </div>

              {/* Nb pièces min */}
              <div className="space-y-2">
                <Label htmlFor="pieces_min">Nombre de pièces minimum</Label>
                <Input
                  id="pieces_min"
                  type="number"
                  placeholder="Ex: 3"
                  value={form.pieces_min}
                  onChange={(e) => setForm((prev) => ({ ...prev, pieces_min: e.target.value }))}
                />
              </div>
            </div>

            {/* Critères additionnels */}
            <div className="space-y-2">
              <Label>Critères additionnels</Label>
              <div className="flex gap-2 max-w-md">
                <Input
                  placeholder="Ex: avec jardin, piscine..."
                  value={critereInput}
                  onChange={(e) => setCritereInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCritere()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addCritere}>
                  Ajouter
                </Button>
              </div>
              {form.criteres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {form.criteres.map((cr) => (
                    <span
                      key={cr}
                      className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground text-xs px-2.5 py-1"
                    >
                      {cr}
                      <button
                        type="button"
                        className="hover:text-destructive"
                        onClick={() => removeCritere(cr)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Statut actif */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="active" className="cursor-pointer">
                Acquéreur actif (pourra être matché avec des biens)
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" asChild>
            <Link href="/admin/market/acheteurs">Annuler</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
            <Save className="h-4 w-4 mr-1" />
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </div>
  )
}