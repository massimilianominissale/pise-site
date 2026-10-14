'use client'

import Link from 'next/link'
import { type ReactNode, useState } from 'react'

import { Chips } from '@/components/ui/Chips'
import { Img } from '@/components/ui/Img'

export type TourItem = {
  id: number
  href: string | null
  title: string
  kind: string
  kindLabel: string
  location: string | null
  brands: string[]
  live: boolean
  image: unknown
}

type Props = {
  tours: TourItem[]
  kinds: { value: string; label: string }[]
  labels: { all: string; filter: string; soon: string }
  /** Dernière case de la grille (inscription aux nouveaux espaces). */
  extra?: ReactNode
}

/** Grille des espaces virtuels, filtrable par type d'espace. */
export function ToursGrid({ tours, kinds, labels, extra }: Props) {
  const [kind, setKind] = useState('all')
  const visible = kind === 'all' ? tours : tours.filter((t) => t.kind === kind)

  return (
    <>
      {kinds.length > 1 ? (
        <Chips
          label={labels.filter}
          value={kind}
          onChange={setKind}
          options={[{ value: 'all', label: labels.all }, ...kinds]}
        />
      ) : null}
      <div className="tour-list">
        {visible.map((tour) => {
          const body = (
            <>
              <div className="p-card__img tour-list__img">
                <Img
                  media={tour.image}
                  sizes="(min-width: 1100px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
                <span className="tour-list__badge">{tour.live ? '360°' : labels.soon}</span>
              </div>
              <span className="pise-eyebrow eyebrow-mute">
                {[tour.kindLabel, tour.location].filter(Boolean).join(' · ')}
              </span>
              <span className="h3">{tour.title}</span>
              {tour.brands.length ? (
                <span className="tagrow">
                  {tour.brands.map((b) => (
                    <span key={b}>{b}</span>
                  ))}
                </span>
              ) : null}
            </>
          )
          return tour.href ? (
            <Link
              key={tour.id}
              className={`p-card${tour.live ? '' : ' p-card--soon'}`}
              href={tour.href}
            >
              {body}
            </Link>
          ) : (
            <div key={tour.id} className="p-card p-card--soon">
              {body}
            </div>
          )
        })}
        {extra}
      </div>
    </>
  )
}
