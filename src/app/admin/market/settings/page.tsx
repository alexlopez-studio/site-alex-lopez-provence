'use client'

import { useEffect, useState } from 'react'
import { Save, RefreshCw, Mail, Bell, Globe, Satellite } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function SettingsPage() {
    const [syncFreq, setSyncFreq] = useState('daily')
    const [emailNotifs, setEmailNotifs] = useState(true)
    const [emailNewsletter, setEmailNewsletter] = useState(false)
    const [autoMatching, setAutoMatching] = useState(true)
    const [maxProperties, setMaxProperties] = useState('200')
    const [saved, setSaved] = useState(false)

    const [pipelineEnabled, setPipelineEnabled] = useState(true)
    const [pipelineLoading, setPipelineLoading] = useState(true)
    const [pipelineSaving, setPipelineSaving] = useState(false)

    useEffect(() => {
        fetch('/api/market/settings')
            .then((res) => res.json())
            .then((data) => {
                const value = data?.settings?.mandatfinder_pipeline_enabled
                if (typeof value === 'boolean') setPipelineEnabled(value)
            })
            .catch((err) => console.error('Erreur chargement paramètres:', err))
            .finally(() => setPipelineLoading(false))
    }, [])

    async function togglePipeline() {
        const next = !pipelineEnabled
        setPipelineSaving(true)
        try {
            const res = await fetch('/api/market/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mandatfinder_pipeline_enabled: next }),
            })
            if (!res.ok) throw new Error('Erreur API')
            setPipelineEnabled(next)
            toast.success(next ? 'Pipeline MandatFinder activé' : 'Pipeline MandatFinder désactivé')
        } catch (err) {
            console.error('Erreur mise à jour pipeline:', err)
            toast.error('Impossible de mettre à jour ce paramètre')
        } finally {
            setPipelineSaving(false)
        }
    }

    function handleSave() {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Configuration de l'application
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saved}>
                    <Save className="mr-1 h-4 w-4" />
                    {saved ? 'Enregistré ✓' : 'Enregistrer'}
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Pipeline MandatFinder */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Satellite className="h-4 w-4 text-brand" />
                            <CardTitle className="text-sm">Pipeline MandatFinder</CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                            Import quotidien Stream Estate + scoring (cron Vercel, 2h UTC)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Pipeline actif</p>
                                <p className="text-xs text-muted-foreground">
                                    Désactiver coupe les appels à l&apos;API Stream Estate (aucun coût) sans toucher au cron
                                </p>
                            </div>
                            <button
                                onClick={togglePipeline}
                                disabled={pipelineLoading || pipelineSaving}
                                className={'relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ' + (pipelineEnabled ? 'bg-brand' : 'bg-border')}
                            >
                                <span className={'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm ' + (pipelineEnabled ? 'translate-x-5' : '')} />
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Statut :{' '}
                            <span className={pipelineEnabled ? 'font-medium text-success' : 'font-medium text-error'}>
                                {pipelineLoading ? '—' : pipelineEnabled ? 'Activé' : 'Désactivé'}
                            </span>
                        </p>
                    </CardContent>
                </Card>

                {/* Synchronisation */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 text-brand" />
                            <CardTitle className="text-sm">Synchronisation</CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                            Fréquence de mise à jour des données marché
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium">Fréquence</Label>
                            <select
                                value={syncFreq}
                                onChange={(e) => setSyncFreq(e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="hourly">Toutes les heures</option>
                                <option value="daily">Quotidienne</option>
                                <option value="weekly">Hebdomadaire</option>
                                <option value="manual">Manuelle uniquement</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium">Nombre max de biens synchronisés</Label>
                            <Input
                                type="number"
                                value={maxProperties}
                                onChange={(e) => setMaxProperties(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-amber-500" />
                            <CardTitle className="text-sm">Notifications</CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                            Alertes et notifications automatiques
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Notifications email</p>
                                <p className="text-xs text-muted-foreground">Recevoir les alertes par email</p>
                            </div>
                            <button
                                onClick={() => setEmailNotifs(!emailNotifs)}
                                className={'relative h-6 w-11 rounded-full transition-colors ' + (emailNotifs ? 'bg-brand' : 'bg-border')}
                            >
                                <span className={'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm ' + (emailNotifs ? 'translate-x-5' : '')} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Newsletter marché</p>
                                <p className="text-xs text-muted-foreground">Rapport hebdomadaire du marché local</p>
                            </div>
                            <button
                                onClick={() => setEmailNewsletter(!emailNewsletter)}
                                className={'relative h-6 w-11 rounded-full transition-colors ' + (emailNewsletter ? 'bg-brand' : 'bg-border')}
                            >
                                <span className={'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm ' + (emailNewsletter ? 'translate-x-5' : '')} />
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Matching */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-purple-500" />
                            <CardTitle className="text-sm">Matching automatique</CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                            Algorithme de correspondance acheteur / bien
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Matching actif</p>
                                <p className="text-xs text-muted-foreground">Associer automatiquement les acheteurs aux biens</p>
                            </div>
                            <button
                                onClick={() => setAutoMatching(!autoMatching)}
                                className={'relative h-6 w-11 rounded-full transition-colors ' + (autoMatching ? 'bg-brand' : 'bg-border')}
                            >
                                <span className={'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm ' + (autoMatching ? 'translate-x-5' : '')} />
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Score minimum de matching : 70%
                        </p>
                    </CardContent>
                </Card>

                {/* Informations */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-blue-500" />
                            <CardTitle className="text-sm">Contact et informations</CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                            Paramètres généraux de l'application
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p>Version : <span className="font-medium text-foreground">0.1.0</span></p>
                        <p>Statut API : <span className="font-medium text-green-600">Opérationnelle</span></p>
                        <p>Dernière sync : <span className="font-medium text-foreground">Il y a 30 minutes</span></p>
                        <p>Leads totaux : <span className="font-medium text-foreground">—</span></p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}