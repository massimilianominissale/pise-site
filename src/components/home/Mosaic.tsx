import Link from 'next/link'

import { Img } from '@/components/ui/Img'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import { docHref, resolveLink } from '@/lib/links'
import type { Brand, Home } from '@/payload-types'

type Tile = NonNullable<Home['mosaic']>[number]

const SIZES: Record<NonNullable<Tile['size']>, string> = {
  '2x2': '(min-width: 768px) 50vw, 100vw',
  '2x1': '(min-width: 768px) 50vw, 100vw',
  '1x2': '(min-width: 768px) 25vw, 50vw',
  '1x1': '(min-width: 768px) 25vw, 50vw',
}

const obj = <T,>(v: unknown): T | null => (v && typeof v === 'object' ? (v as T) : null)

/**
 * Mosaïque d'accueil (back-office › Accueil › Mosaïque). Les tuiles se placent dans l'ordre,
 * de gauche à droite : grille de 4 colonnes sur ordinateur, 2 sur mobile.
 */
export function Mosaic({
  tiles,
  locale,
  dict,
}: {
  tiles: Tile[]
  locale: Locale
  dict: Dictionary
}) {
  if (!tiles.length) return null
  return (
    <section className="mosaic" aria-label={dict.brands.homeTitle}>
      <div className="mosaic__grid">
        {tiles.map((tile, i) => {
          const brand = obj<Brand>(tile.brand)
          const href =
            resolveLink(tile.link, locale)?.href ??
            (brand ? docHref(locale, 'brands', brand) : null) ??
            '#'
          // L'étiquette montre seulement la marque ; le texte libre ne sert qu'aux tuiles sans fabricant.
          const label = brand?.name || tile.label || ''
          const size = tile.size ?? '1x1'
          return (
            <Link key={tile.id ?? i} href={href} className={`m-tile m-tile--${size}`}>
              <Img media={tile.image} sizes={SIZES[size]} priority={i < 3} />
              {tile.isNew ? <span className="m-new">{dict.brand.newBadge}</span> : null}
              {tile.pulse ? <span className="pise-pulse" aria-hidden="true" /> : null}
              {label ? <span className="m-tag">{label}</span> : null}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
