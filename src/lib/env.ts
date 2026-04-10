export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  resend: { apiKey: process.env.RESEND_API_KEY },
  attio: { apiKey: process.env.ATTIO_API_KEY },
  admin: { password: process.env.ADMIN_PASSWORD ?? '' },
  app: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alexlopez-provence.fr',
    calcomUrl: process.env.NEXT_PUBLIC_CALCOM_URL ?? 'https://cal.com/alex-lopez/consultation-gratuite',
    iadListingsUrl: process.env.NEXT_PUBLIC_IAD_LISTINGS_URL ?? '',
  },
} as const
