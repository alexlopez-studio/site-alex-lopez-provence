import { NextResponse } from 'next/server'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

/**
 * GET /api/market/test-stream-estate
 * Route de diagnostic : teste la connexion à l'API Stream Estate
 * et renvoie la réponse brute pour vérifier URL, clé et format.
 *
 * À SUPPRIMER après diagnostic.
 */
export async function GET() {
  const apiUrl = env.streamEstate.apiUrl
  const apiKey = env.streamEstate.apiKey

  const info = {
    apiUrl,
    apiKeySet: !!apiKey && apiKey.length > 0,
    apiKeyLength: apiKey.length,
    apiKeyPreview: apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : '(vide)',
  }

  // Test 1 : endpoint /documents/properties avec dept 83 (Var)
  const testUrl = `${apiUrl}/documents/properties?includedDepartments[]=83&transactionType=SELL&itemsPerPage=2`

  try {
    const res = await fetch(testUrl, {
      headers: {
        'X-API-KEY': apiKey,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    const responseText = await res.text()
    let responseBody: unknown
    try {
      responseBody = JSON.parse(responseText)
    } catch {
      responseBody = responseText
    }

    return NextResponse.json({
      config: info,
      request: { url: testUrl, method: 'GET' },
      response: {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: responseBody,
      },
    })
  } catch (err) {
    return NextResponse.json({
      config: info,
      request: { url: testUrl, method: 'GET' },
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 })
  }
}
