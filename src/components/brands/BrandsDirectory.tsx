'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { Chips } from '@/components/ui/Chips'
import { Img } from '@/components/ui/Img'
import type { BrandSummary } from '@/lib/brands'

type Labels = {
  all: string
  universes: string
  sector: string
  sectorAll: string
  country: string
  countryAll: string
  countOne: string
  countOther: string
  see: string
}

type Props = {
  brands: BrandSummary[]
  universes: { value: string; label: string }[]
  labels: Labels
}

/** Largeur des cartes : rangées alternées 7/5 puis 5/7 colonnes, comme sur la maquette. */
const spanFor = (index: number, total: number) => {
  const row = Math.floor(index / 2)
  const first = index % 2 === 0
  if (first && index === total - 1) return 'wide'
  return (row % 2 === 0) === first ? 'wide' : 'narrow'
}

/** Page « Nos fabricants » : filtres (univers, secteur, pays) et grille éditoriale. */
export function BrandsDirectory({ brands, universes, labels }: Props) {
  const [universe, setUniverse] = useState('all')
  const [sector, setSector] = useState('')
  const [country, setCountry] = useState('')

  const sectors = useMemo(() => {
    const map = new Map<string, string>()
    for (const b of brands) for (const s of b.sectors) map.set(s.slug, s.name)
    return [...map].map(([value, label]) => ({ value, label }))
  }, [brands])

  const countries = useMemo(
    () =>
      [...new Set(brands.map((b) => b.country).filter((c): c is string => Boolean(c)))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [brands],
  )

  const visible = brands.filter(
    (b) =>
      (universe === 'all' || b.universes.includes(universe)) &&
      (!sector || b.sectors.some((s) => s.slug === sector)) &&
      (!country || b.country === country),
  )
  const count = (visible.length > 1 ? labels.countOther : labels.countOne).replace(
    '{n}',
    String(visible.length),
  )

  return (
    <>
      <div className="bar">
        <div className="container bar__inner">
          {universes.length > 1 ? (
            <Chips
              label={labels.universes}
              options={[{ value: 'all', label: labels.all }, ...universes]}
              value={universe}
              onChange={setUniverse}
            />
          ) : null}
          {sectors.length > 1 || countries.length > 1 ? (
            <span className="bar__sep" aria-hidden="true" />
          ) : null}
          {sectors.length > 1 ? (
            <select
              className="select"
              aria-label={labels.sector}
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              <option value="">{labels.sectorAll}</option>
              {sectors.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          ) : null}
          {countries.length > 1 ? (
            <select
              className="select"
              aria-label={labels.country}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">{labels.countryAll}</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          ) : null}
          <span className="cap bar__count" aria-live="polite">
            {count}
          </span>
        </div>
      </div>

      <section className="container directory">
        {visible.map((brand, i) => (
          <Link
            key={brand.id}
            className={`p-card directory__item directory__item--${spanFor(i, visible.length)}`}
            href={brand.href}
          >
            <div className="p-card__img directory__img">
              <Img media={brand.image} sizes="(min-width: 1100px) 58vw, 100vw" priority={i < 2} />
            </div>
            <div className="directory__row">
              <h2 className="h2">{brand.name}</h2>
              {brand.meta ? <span className="pise-eyebrow eyebrow-mute">{brand.meta}</span> : null}
            </div>
            {brand.tagline ? <p className="body directory__text">{brand.tagline}</p> : null}
            <span className="pise-link directory__cta">{labels.see}</span>
          </Link>
        ))}
      </section>
    </>
  )
}
