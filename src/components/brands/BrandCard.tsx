import Link from 'next/link'

import { Img } from '@/components/ui/Img'
import type { BrandSummary } from '@/lib/brands'

/** Petite carte de fabricant : photo au format 4/3, nom, univers. */
export function BrandCard({ brand }: { brand: BrandSummary }) {
  return (
    <Link className="b-card" href={brand.href}>
      <div className="b-card__img">
        <Img media={brand.image} sizes="(min-width: 1100px) 25vw, 50vw" />
      </div>
      <div className="b-card__row">
        <span className="h3">{brand.name}</span>
        {brand.primaryUniverse ? (
          <span className="pise-eyebrow b-card__meta">{brand.primaryUniverse}</span>
        ) : null}
      </div>
    </Link>
  )
}
