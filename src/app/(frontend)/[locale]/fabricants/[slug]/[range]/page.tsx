import { notFound, permanentRedirect } from 'next/navigation'

import { isLocale } from '@/i18n/config'
import { docHref } from '@/lib/links'
import { getBrandBySlug, getProductsOfRange, getRange } from '@/lib/payload'

type Props = { params: Promise<{ locale: string; slug: string; range: string }> }

/**
 * Anciennes pages « collection » (/fabricants/johanson-design/split) : depuis le 22/10, chaque
 * collection est devenue une fiche produit de « Notre sélection », ou une marque « by »
 * (Noon, Decibel). L'ancienne adresse redirige définitivement vers la nouvelle page.
 */
export default async function RangePage({ params }: Props) {
  const { locale, slug, range: rangeSlug } = await params
  if (!isLocale(locale)) notFound()

  const found = await getRange(slug, rangeSlug, locale)
  if (!found) notFound()
  const { range, brand } = found

  const [product] = await getProductsOfRange(range.id, locale)
  const productHref = product ? docHref(locale, 'products', product) : null
  if (productHref) permanentRedirect(productHref)

  const subBrand = await getBrandBySlug(rangeSlug, locale)
  const parentId =
    subBrand?.parent && typeof subBrand.parent === 'object' ? subBrand.parent.id : subBrand?.parent
  const subBrandHref =
    subBrand && parentId === brand.id ? docHref(locale, 'brands', subBrand) : null
  if (subBrandHref) permanentRedirect(subBrandHref)

  notFound()
}
