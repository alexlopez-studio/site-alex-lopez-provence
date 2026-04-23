import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // output: 'export' intentionnellement absent — on a besoin des API routes et du ISR
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
}

export default nextConfig
