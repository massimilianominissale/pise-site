import Link from 'next/link'

import { asMedia, Img } from '@/components/ui/Img'
import type { Locale } from '@/i18n/config'
import { namesOf } from '@/lib/format'
import { docHref } from '@/lib/links'
import type { Project } from '@/payload-types'

/** Carte de réalisation au format de sa photo (grille en colonnes façon mosaïque). */
export function ProjectTile({
  project,
  locale,
  sizes,
}: {
  project: Project
  locale: Locale
  sizes: string
}) {
  const cover = asMedia(project.cover)
  const ratio = cover?.width && cover?.height ? `${cover.width} / ${cover.height}` : '4 / 3'
  const eyebrow = [namesOf(project.sectors)[0], project.city].filter(Boolean).join(' · ')
  const brands = namesOf(project.brands)
  return (
    <Link className="p-card project-tile" href={docHref(locale, 'projects', project) ?? '#'}>
      <div className="p-card__img project-tile__img" style={{ aspectRatio: ratio }}>
        <Img media={cover} sizes={sizes} />
      </div>
      {eyebrow ? <span className="pise-eyebrow eyebrow-mute">{eyebrow}</span> : null}
      <span className="h3">{project.title}</span>
      {brands.length ? (
        <span className="tagrow">
          {brands.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </span>
      ) : null}
    </Link>
  )
}
