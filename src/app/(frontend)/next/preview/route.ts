import config from '@payload-config'
import { draftMode } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

/**
 * Active l'aperçu des brouillons (mode « draft » de Next) pour l'équipe connectée à
 * l'administration, puis ouvre la page demandée. Utilisé par l'aperçu en direct de Payload.
 */
export async function GET(request: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  const path = request.nextUrl.searchParams.get('path') ?? '/'
  if (!user || user.collection !== 'users') {
    return new NextResponse('Aperçu réservé à l’équipe connectée à l’administration.', {
      status: 403,
    })
  }
  // Seulement des adresses internes au site.
  const target = path.startsWith('/') && !path.startsWith('//') ? path : '/'
  ;(await draftMode()).enable()
  return NextResponse.redirect(new URL(target, request.nextUrl.origin))
}
