'use client'

import { useState } from 'react'
import { Plus, MapPin, RefreshCw, Edit3, Trash2, Power, PowerOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface Zone {
    id: string
    name: string
    zipcode: string
    city: string | null
    radius_km: number | null
    active: boolean
    sync_frequency: string
    last_synced_at: string | null
}

const MOCK_ZONES: Zone[] = [
    { id: 'z1', name: 'Provence Verte Centre', zipcode: '83170', city: 'Brignoles', radius_km: 15, active: true, sync_frequency: 'daily', last_synced_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 'z2', name: 'Barjols et environs', zipcode: '83670', city: 'Barjols', radius_km: 10, active: true, sync_frequency: 'daily', last_synced_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: 'z3', name: 'Cotignac / Lorgues', zipcode: '83510', city: 'Cotignac', radius_km: 12, active: true, sync_frequency: 'daily', last_synced_at: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
    { id: 'z4', name: 'Saint-Maximin', zipcode: '83470', city: 'Saint-Maximin-la-Sainte-Baume', radius_km: 10, active: false, sync_frequency: 'weekly', last_synced_at: new Date(Date.now() - 86400000 * 3).toISOString() },
]

function formatLastSync(iso: string | null): string {
    if (!iso) return 'Jamais'
    const diff = Date.now() - new Date(iso).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return 'Il y a quelques minutes'
    if (hours < 24) return `Il y a ${hours}h`
    return `Il y a ${Math.floor(hours / 24)}j`
}

export default function ZonesPage() {
    const [zones, setZones] = useState(MOCK_ZONES)
    const [showNew, setShowNew] = useState(false)
    const [newName, setNewName] = useState('')
    const [newZip, setNewZip] = useState('')
    const [newRadius, setNewRadius] = useState('10')

    function addZone() {
        if (!newName.trim() || !newZip.trim()) return
        const zone: Zone = {
            id: 'z' + Date.now(),
            name: newName.trim(),
            zipcode: newZip.trim(),
            city: null,
            radius_km: parseInt(newRadius) || 10,
            active: true,
            sync_frequency: 'daily',
            last_synced_at: null,
        }
        setZones((prev) => [...prev, zone])
        setNewName('')
        setNewZip('')
        setShowNew(false)
    }

    function toggleZone(id: string) {
        setZones((prev) => prev.map((z) => (z.id === id ? { ...z, active: !z.active } : z)))
    }

    function deleteZone(id: string) {
        setZones((prev) => prev.filter((z) => z.id !== id))
    }

    const activeCount = zones.filter((z) => z.active).length

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Zones surveillées</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {activeCount} active{activeCount > 1 ? 's' : ''} sur {zones.length}
                    </p>
                </div>
                <Button size="sm" onClick={() => setShowNew(!showNew)}>
                    <Plus className="mr-1 h-4 w-4" /> Ajouter une zone
                </Button>
            </div>

            {/* New zone form */}
            {showNew && (
                <Card>
                    <CardContent className="flex flex-col gap-3 p-4">
                        <div className="grid grid-cols-3 gap-3">
                            <Input placeholder="Nom (ex: Aubagne)" value={newName} onChange={(e) => setNewName(e.target.value)} />
                            <Input placeholder="Code postal" value={newZip} onChange={(e) => setNewZip(e.target.value)} />
                            <Input placeholder="Rayon (km)" type="number" value={newRadius} onChange={(e) => setNewRadius(e.target.value)} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => setShowNew(false)}>Annuler</Button>
                            <Button size="sm" onClick={addZone} disabled={!newName.trim() || !newZip.trim()}>
                                <Plus className="mr-1 h-4 w-4" /> Ajouter
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Zones list */}
            <div className="space-y-2">
                {zones.map((zone) => (
                    <Card key={zone.id} className="transition-colors">
                        <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <MapPin className="h-4 w-4 text-brand" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-foreground">{zone.name}</p>
                                        <Badge
                                            variant="outline"
                                            className={zone.active
                                                ? 'bg-green-50 text-green-700 border-green-200 text-[10px]'
                                                : 'bg-gray-50 text-gray-500 border-gray-200 text-[10px]'
                                            }
                                        >
                                            {zone.active ? 'Actif' : 'Inactif'}
                                        </Badge>
                                    </div>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {zone.zipcode}{zone.city ? ` — ${zone.city}` : ''} · {zone.radius_km} km · Sync : {zone.sync_frequency}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                        Dernière sync : {formatLastSync(zone.last_synced_at)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => toggleZone(zone.id)}
                                    className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                    title={zone.active ? 'Désactiver' : 'Activer'}
                                >
                                    {zone.active ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                                </button>
                                <button
                                    onClick={() => deleteZone(zone.id)}
                                    className="rounded p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                                    title="Supprimer"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}