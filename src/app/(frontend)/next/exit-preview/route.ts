import { draftMode } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

/** Quitte l'aperçu des brouillons et revient à la page publiée. */
export async function GET(request: NextRequest) {
  ;(await draftMode()).disable()
  const path = request.nextUrl.searchParams.get('path') ?? '/'
  const target = path.startsWith('/') && !path.startsWith('//') ? path : '/'
  return NextResponse.redirect(new URL(target, request.nextUrl.origin))
}
