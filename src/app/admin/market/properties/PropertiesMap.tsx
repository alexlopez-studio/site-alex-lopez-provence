'use client'

import { useEffect, useRef } from 'react'

interface Property {
    id: string
    title: string
    city: string
    price: number
    surface: number
    rooms: number
    propertyType: string
    lat: number
    lng: number
    status: string
}

const STATUS_COLORS: Record<string, string> = {
    nouveau: '#0077B6',
    actif: '#10B981',
    prix_en_baisse: '#EF4444',
    opportunite: '#F59E0B',
    stagne: '#6B7280',
    expire: '#64748B',
    retire: '#64748B',
}

interface PropertiesMapProps {
    properties: Property[]
    height?: string
}

export function PropertiesMap({ properties, height = '420px' }: PropertiesMapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)

    useEffect(() => {
        // Dynamic import of leaflet to avoid SSR issues
        async function initMap() {
            const L = await import('leaflet')

            // Load CSS via link if not already loaded
            if (!document.querySelector('link[href*="leaflet"]')) {
                const link = document.createElement('link')
                link.rel = 'stylesheet'
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
                link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
                link.crossOrigin = ''
                document.head.appendChild(link)
            }

            if (!mapRef.current || mapInstanceRef.current) return

            const map = L.map(mapRef.current, {
                zoomControl: true,
                attributionControl: true,
            }).setView([43.6, 5.95], 10)

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 18,
            }).addTo(map)

            mapInstanceRef.current = map
        }

        initMap()

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [])

    useEffect(() => {
        async function updateMarkers() {
            const L = await import('leaflet')
            const map = mapInstanceRef.current
            if (!map) return

            // Clear existing markers (keep tiles)
            map.eachLayer((layer: any) => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer)
                }
            })

            if (properties.length === 0) return

            const markers: any[] = []

            properties.forEach((prop) => {
                const color = STATUS_COLORS[prop.status] ?? '#6B7280'
                const marker = L.marker([prop.lat, prop.lng], {
                    icon: L.divIcon({
                        className: 'custom-marker',
                        html: `<div style="width:14px;height:14px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
                        iconSize: [14, 14],
                        iconAnchor: [7, 7],
                    }),
                })

                const priceFormatted = new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0,
                }).format(prop.price)

                marker.bindPopup(`
                    <div style="font-family:system-ui,sans-serif;min-width:180px;">
                        <p style="font-weight:600;margin:0 0 4px;font-size:13px;">${prop.title}</p>
                        <p style="margin:0 0 2px;font-size:12px;color:#64748B;">${prop.city} · ${prop.propertyType} · ${prop.rooms} pièces</p>
                        <p style="margin:0 0 2px;font-size:12px;color:#64748B;">${prop.surface} m²</p>
                        <p style="margin:0;font-size:14px;font-weight:700;color:#0077B6;">${priceFormatted}</p>
                    </div>
                `)

                markers.push(marker)
            })

            const group = L.featureGroup(markers)
            group.addTo(map)

            if (markers.length === 1) {
                map.setView([properties[0].lat, properties[0].lng], 13)
            } else {
                map.fitBounds(group.getBounds().pad(0.15))
            }
        }

        updateMarkers()
    }, [properties])

    return (
        <div
            ref={mapRef}
            style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}
            className="border border-border shadow-sm"
        />
    )
}
