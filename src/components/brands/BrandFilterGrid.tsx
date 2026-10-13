'use client'

import { useState } from 'react'

import { Chips } from '@/components/ui/Chips'
import type { BrandSummary } from '@/lib/brands'

import { BrandCard } from './BrandCard'

type Props = {
  brands: BrandSummary[]
  eyebrow: string
  title: string
  allLabel: string
  filterLabel: string
  /** Univers présents, dans l'ordre d'affichage : [{ value: 'furniture', label: 'Mobilier' }, …] */
  universes: { value: string; label: string }[]
}

/** Accueil : grille des fabricants filtrable par univers. */
export function BrandFilterGrid({
  brands,
  eyebrow,
  title,
  allLabel,
  filterLabel,
  universes,
}: Props) {
  const [universe, setUniverse] = useState('all')
  const visible = universe === 'all' ? brands : brands.filter((b) => b.universes.includes(universe))

  return (
    <section id="fabricants" className="container section home-brands">
      <div className="section-head">
        <div className="section-head__titles">
          <span className="pise-eyebrow eyebrow-mute">{eyebrow}</span>
          <h2 className="sec-title">{title}</h2>
        </div>
        {universes.length > 1 ? (
          <Chips
            label={filterLabel}
            options={[{ value: 'all', label: allLabel }, ...universes]}
            value={universe}
            onChange={setUniverse}
          />
        ) : null}
      </div>
      <div className="brand-grid" aria-live="polite">
        {visible.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </section>
  )
}
