import Link from 'next/link'

import { Img } from '@/components/ui/Img'
import type { Locale } from '@/i18n/config'
import { docHref } from '@/lib/links'
import type { Product } from '@/payload-types'

type Props = {
  product: Product
  locale: Locale
  /** Ligne au-dessus du nom : la marque (catalogue, fiche) ou la collection (page fabricant). */
  eyebrow?: 'brand' | 'range'
  sizes?: string
}

const nameOf = (value: unknown) =>
  value && typeof value === 'object' && 'name' in value
    ? String((value as { name: string }).name)
    : null

/** Carte produit : photo au format 4/5, marque ou collection, nom. */
export function ProductCard({
  product,
  locale,
  eyebrow = 'brand',
  sizes = '(min-width: 1100px) 25vw, 50vw',
}: Props) {
  const label =
    eyebrow === 'range' ? (nameOf(product.range) ?? nameOf(product.brand)) : nameOf(product.brand)
  return (
    <Link className="pise-product" href={docHref(locale, 'products', product) ?? '#'}>
      <div className="pise-product__visual">
        <Img media={product.images?.[0]} sizes={sizes} />
      </div>
      <div className="pise-product__meta">
        {label ? <span className="pise-eyebrow pise-product__brand">{label}</span> : null}
        <span className="pise-product__name">{product.name}</span>
      </div>
    </Link>
  )
}
