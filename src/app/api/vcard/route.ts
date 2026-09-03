import { NextResponse } from 'next/server'

export async function GET() {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Lopez;Alexandre;;;',
    'FN:Alexandre Lopez',
    'ORG:iad France',
    'TITLE:Conseiller Immobilier',
    'TEL;TYPE=CELL;TYPE=VOICE;TYPE=pref:+33613180168',
    'EMAIL;TYPE=INTERNET;TYPE=WORK;TYPE=pref:alexandre.lopez@iadfrance.fr',
    'URL:https://alexandrelopez.fr',
    'URL;TYPE=iad:https://www.iadfrance.fr/conseiller-immobilier/alexandre.lopez',
    'URL;TYPE=Instagram:https://www.instagram.com/alexandrelopez_iad/',
    'URL;TYPE=LinkedIn:https://www.linkedin.com/in/alexandrelopeziad/',
    'ADR;TYPE=WORK:;;Provence Verte & Verdon;Var;;83000;France',
    'NOTE:Conseiller Immobilier en Provence Verte & Littoral · iad France · RSAC Draguignan 908 906 423',
    'END:VCARD',
  ].join('\r\n')

  return new NextResponse(vcard, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Alexandre-Lopez-iad.vcf"',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
