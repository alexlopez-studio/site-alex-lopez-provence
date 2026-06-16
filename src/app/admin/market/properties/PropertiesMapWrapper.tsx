'use client'

import { PropertiesMap } from './PropertiesMap'

// Copie légère des données mock avec uniquement ce dont la carte a besoin
const MAP_PROPERTIES = [
    { id: '1', title: 'Maison de village 4 pièces', city: 'Cotignac', price: 295000, surface: 110, rooms: 4, propertyType: 'Maison', lat: 43.5283, lng: 6.1525, status: 'actif' },
    { id: '2', title: 'Villa contemporaine 5 pièces', city: 'Brignoles', price: 459000, surface: 160, rooms: 5, propertyType: 'Villa', lat: 43.4067, lng: 6.0617, status: 'prix_en_baisse' },
    { id: '3', title: 'Appartement T3 centre historique', city: 'Saint-Maximin', price: 189000, surface: 72, rooms: 3, propertyType: 'Appartement', lat: 43.4533, lng: 5.8667, status: 'nouveau' },
    { id: '4', title: 'Bastide provençale 6 pièces', city: 'Barjols', price: 625000, surface: 200, rooms: 6, propertyType: 'Bastide', lat: 43.5583, lng: 6.0075, status: 'stagne' },
    { id: '5', title: 'Terrain constructible 800m²', city: 'Carcès', price: 85000, surface: 800, rooms: 0, propertyType: 'Terrain', lat: 43.4750, lng: 6.1833, status: 'opportunite' },
    { id: '6', title: 'Villa 4 pièces avec piscine', city: 'Carcès', price: 385000, surface: 130, rooms: 4, propertyType: 'Villa', lat: 43.4800, lng: 6.1900, status: 'actif' },
    { id: '7', title: 'Maison de maître 7 pièces', city: 'Cotignac', price: 720000, surface: 250, rooms: 7, propertyType: 'Maison', lat: 43.5350, lng: 6.1600, status: 'prix_en_baisse' },
    { id: '8', title: 'Appartement T2 centre ville', city: 'Brignoles', price: 135000, surface: 52, rooms: 2, propertyType: 'Appartement', lat: 43.4100, lng: 6.0650, status: 'nouveau' },
]

export function PropertiesMapWrapper() {
    return <PropertiesMap properties={MAP_PROPERTIES} />
}