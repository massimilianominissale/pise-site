import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { isLocale, localizedPath } from '@/i18n/config'
import { getProductByReference } from '@/lib/payload'

type Props = { params: Promise<{ locale: string; reference: string }> }

export const metadata: Metadata = { robots: { index: false, follow: true } }

/**
 * Lien permanent d'un produit (/p/[référence]), utilisé dans les légendes du générateur Mobilia.
 * Redirection temporaire (307) vers la fiche : l'adresse de la fiche peut changer, ce lien jamais.
 */
export default async function Permalink({ params }: Props) {
  const { locale, reference } = await params
  if (!isLocale(locale)) notFound()
  const product = await getProductByReference(decodeURIComponent(reference).trim())
  if (!product?.slug) notFound()
  redirect(localizedPath(locale, 'products', product.slug))
}
