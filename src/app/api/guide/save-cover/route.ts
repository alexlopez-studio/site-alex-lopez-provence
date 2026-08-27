import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const config = await req.json()
    
    // Chemin du fichier de configuration de couverture
    const configFilePath = path.join(
      process.cwd(),
      'src/components/guide/cover-saved-config.json'
    )

    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf-8')

    return NextResponse.json({
      success: true,
      message: 'Configuration de la couverture enregistrée avec succès dans le projet.',
    })
  } catch (error: any) {
    console.error('Erreur lors de la sauvegarde de la couverture:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur inconnue' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const configFilePath = path.join(
      process.cwd(),
      'src/components/guide/cover-saved-config.json'
    )

    if (fs.existsSync(configFilePath)) {
      const data = fs.readFileSync(configFilePath, 'utf-8')
      return NextResponse.json({ success: true, config: JSON.parse(data) })
    }

    return NextResponse.json({ success: true, config: null })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
