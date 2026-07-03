import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { loadAdminClientDossier } from '@/lib/market/client-admin'
import { supabaseAdmin } from '@/lib/supabase'
import type { ClientPortalDossier } from '@/lib/client-portal'
import { ClientPortalView } from '../portal-view'

export const metadata: Metadata = {
  title: 'Session test espace vendeur',
  robots: { index: false, follow: false },
}

export default async function ClientPortalTestPage() {
  if (process.env.NODE_ENV === 'production') redirect('/espace-client/connexion')

  const data = await loadFirstRealDossier()
  return <ClientPortalView data={data ?? demoDossier()} mode="test" />
}

async function loadFirstRealDossier(): Promise<ClientPortalDossier | null> {
  const { data } = await supabaseAdmin
    .from('client_dossiers')
    .select('id')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data?.id) return null

  const detail = await loadAdminClientDossier(data.id)
  if (!detail) return null

  return {
    profile: detail.dossier.client_profile,
    dossier: detail.dossier,
    lead: detail.lead,
    sellerProperty: detail.seller_property,
    opportunity: detail.opportunity,
    documents: detail.documents,
    events: detail.events,
  }
}

function demoDossier(): ClientPortalDossier {
  const now = new Date().toISOString()
  return {
    profile: {
      id: 'demo-profile',
      user_id: null,
      email: 'client-test@example.com',
      first_name: 'Marie',
      last_name: 'Durand',
      phone: '06 00 00 00 00',
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    dossier: {
      id: 'demo-dossier',
      client_profile_id: 'demo-profile',
      lead_id: null,
      seller_property_id: null,
      opportunity_id: null,
      status: 'active',
      title: 'Projet de vente - Cotignac',
      property_snapshot: {
        adresse: 'Centre village',
        commune: 'Cotignac',
        type_bien: 'Maison',
        surface: 128,
        surface_terrain: 640,
        nb_pieces: 5,
        dpe: 'C',
        etat: 'Très bon état',
        equipements: 'Piscine, terrasse, stationnement, exposition sud',
        contexte: 'Maison familiale au calme, proche du centre village, à valoriser avec une stratégie de prix lisible.',
        prix_estime: 420000,
        fourchette_basse: 395000,
        fourchette_haute: 445000,
      },
      advisor_note: 'Votre dossier test reprend la structure visible par un vendeur connecté.',
      professional_opinion: {
        price: 420000,
        price_low: 395000,
        price_high: 445000,
        commission_rate: 0.045,
        summary: 'Le positionnement conseillé vise un prix lisible pour déclencher des visites qualifiées sans brader les atouts du bien.',
        arguments: [
          'Secteur Cotignac recherché pour les résidences principales et secondaires.',
          'Surface familiale, extérieur exploitable et prestations immédiatement lisibles.',
          'Fourchette compatible avec une stratégie de lancement maîtrisée.',
        ],
        comparables: [
          { title: 'Maison rénovée proche village', location: 'Cotignac', surface: 122, price: 405000, price_per_sqm: 3320 },
          { title: 'Villa avec piscine', location: 'Provence Verte', surface: 135, price: 438000, price_per_sqm: 3244 },
        ],
      },
      client_welcome_seen_at: null,
      created_at: now,
      updated_at: now,
    },
    lead: {
      id: 'demo-lead',
      prospect_id: 'demo-profile',
      tool: 'vendre',
      status: 'contacte',
      form_data: {},
      results: {
        valeur_mediane: 420000,
        fourchette_basse: 395000,
        fourchette_haute: 445000,
      },
      commune: 'Cotignac',
      source_channel: 'estimation_site',
      priority: 'medium',
      next_action: 'Préparer les pièces utiles au dossier',
      due_date: null,
      follow_up_at: null,
      magic_link_expires_at: now,
      magic_link_sent_at: null,
      deleted_at: null,
      created_at: now,
      updated_at: now,
      prospect: {
        id: 'demo-profile',
        email: 'client-test@example.com',
        first_name: 'Marie',
        last_name: 'Durand',
        phone: '06 00 00 00 00',
      },
    },
    sellerProperty: null,
    opportunity: {
      id: 'demo-opportunity',
      market_property_id: null,
      lead_id: null,
      title: 'Projet de vente - Cotignac',
      description: '',
      stage: 'Pré-estimation',
      priority: 'medium',
      signal_type: null,
      next_action: 'Planifier la visite d’estimation',
      due_date: null,
      note: null,
      seller_name: 'Marie Durand',
      seller_phone: '06 00 00 00 00',
      seller_email: 'client-test@example.com',
      source_channel: 'estimation_site',
      property_address: 'Centre village',
      property_city: 'Cotignac',
      property_zipcode: null,
      property_type: 'Maison',
      property_surface: 128,
      property_land_surface: 640,
      property_rooms: 5,
      estimated_price_min: 395000,
      estimated_price_max: 445000,
      selling_timeline: '3 mois',
      pre_estimation_done_at: null,
      visit_at: null,
      report_delivered_at: null,
      follow_up_at: null,
      created_from: 'test',
      created_at: now,
      updated_at: now,
    },
    documents: [
      {
        id: 'demo-doc-1',
        dossier_id: 'demo-dossier',
        label: 'Titre de propriété',
        category: 'propriete',
        status: 'validated',
        storage_path: null,
        file_name: 'titre-propriete.pdf',
        mime_type: 'application/pdf',
        file_size: 200000,
        uploaded_by_user_id: null,
        uploaded_at: now,
        validated_at: now,
        validated_by: 'admin',
        notes: null,
        created_at: now,
        updated_at: now,
        signed_url: null,
      },
      {
        id: 'demo-doc-2',
        dossier_id: 'demo-dossier',
        label: 'Diagnostics immobiliers',
        category: 'diagnostics',
        status: 'requested',
        storage_path: null,
        file_name: null,
        mime_type: null,
        file_size: null,
        uploaded_by_user_id: null,
        uploaded_at: null,
        validated_at: null,
        validated_by: null,
        notes: null,
        created_at: now,
        updated_at: now,
        signed_url: null,
      },
      {
        id: 'demo-doc-3',
        dossier_id: 'demo-dossier',
        label: 'Taxe foncière',
        category: 'fiscalite',
        status: 'rejected',
        storage_path: null,
        file_name: 'taxe-fonciere-photo.jpg',
        mime_type: 'image/jpeg',
        file_size: 420000,
        uploaded_by_user_id: null,
        uploaded_at: now,
        validated_at: null,
        validated_by: null,
        notes: 'Photo trop sombre, merci de déposer un scan ou une photo plus nette.',
        created_at: now,
        updated_at: now,
        signed_url: null,
      },
    ],
    events: [
      {
        id: 'demo-event-1',
        dossier_id: 'demo-dossier',
        type: 'milestone',
        title: 'Dossier vendeur ouvert',
        description: 'Votre espace centralise les informations utiles pour préparer la vente.',
        status: 'done',
        event_date: null,
        payload: {},
        visible_to_client: true,
        created_by: 'system',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'demo-event-2',
        dossier_id: 'demo-dossier',
        type: 'milestone',
        title: 'Préparation des pièces',
        description: 'Les documents demandés apparaissent dans la checklist.',
        status: 'todo',
        event_date: null,
        payload: {},
        visible_to_client: true,
        created_by: 'system',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'demo-event-3',
        dossier_id: 'demo-dossier',
        type: 'visit',
        title: 'Visite qualifiée programmée',
        description: 'Profil sérieux, budget validé, recherche maison avec extérieur en Provence Verte.',
        status: 'todo',
        event_date: '2026-07-07',
        payload: { buyer_name: 'Mme Vautier', rating: 4 },
        visible_to_client: true,
        created_by: 'admin',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'demo-event-4',
        dossier_id: 'demo-dossier',
        type: 'offer',
        title: 'Offre indicative à analyser',
        description: 'Offre à discuter avec Alexandre avant toute réponse formelle.',
        status: 'info',
        event_date: '2026-07-09',
        payload: { buyer_name: 'M. et Mme Giraud', amount: 405000 },
        visible_to_client: true,
        created_by: 'admin',
        created_at: now,
        updated_at: now,
      },
    ],
  }
}
