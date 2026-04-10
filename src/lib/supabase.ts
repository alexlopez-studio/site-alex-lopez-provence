import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? anon

/** Client public — navigateur */
export const supabase = createClient<Database>(url, anon)

/** Client service role — serveur uniquement (API routes) */
export const supabaseAdmin = createClient<Database>(url, service)
