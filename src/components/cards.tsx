import Link from 'next/link'

import { Img } from '@/components/ui/Img'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import { namesOf } from '@/lib/format'
import { docHref } from '@/lib/links'
import { newTab, tourLink } from '@/lib/tours'
import type { Project, VirtualTour } from '@/payload-types'

/** Carte de réalisation : photo, « Hôtel · Ville · Marque », nom du projet. */
export function ProjectCard({
  project,
  locale,
  className,
  sizes,
}: {
  project: Project
  locale: Locale
  className?: string
  sizes: string
}) {
  const eyebrow = [namesOf(project.sectors)[0], project.city, namesOf(project.brands).join(', ')]
    .filter(Boolean)
    .join(' · ')
  return (
    <Link
      className={`project-card ${className ?? ''}`}
      href={docHref(locale, 'projects', project) ?? '#'}
    >
      <div className="project-card__img">
        <Img media={project.cover} sizes={sizes} />
      </div>
      {eyebrow ? <span className="pise-eyebrow eyebrow-mute">{eyebrow}</span> : null}
      <span className="h3">{project.title}</span>
    </Link>
  )
}

const PlayIcon = () => (
  <span className="play" aria-hidden="true">
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1f2227"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  </span>
)

/** Vignette d'espace virtuel sur fond sombre (grande avec bouton lecture, ou petite). */
export function TourCard({
  tour,
  locale,
  dict,
  large,
  sizes,
}: {
  tour: VirtualTour
  locale: Locale
  dict: Dictionary
  large?: boolean
  sizes: string
}) {
  const link = tourLink(locale, tour)
  const className = `tour-card${large ? ' tour-card--large' : ''}`
  const body = (
    <>
      <Img media={tour.thumbnail} sizes={sizes} />
      <span className="tour-card__scrim" />
      {large ? (
        <span className="tour-card__play">
          <PlayIcon />
        </span>
      ) : null}
      <span className="tour-card__text">
        <span className="pise-eyebrow">{dict.tours.kinds[tour.kind]}</span>
        <span className={large ? 'h2' : 'h3'}>{tour.title}</span>
        {link.external ? <span className="sr-only"> ({dict.tours.newTab})</span> : null}
      </span>
    </>
  )
  return link.external ? (
    <a className={className} href={link.href} {...newTab}>
      {body}
    </a>
  ) : (
    <Link className={className} href={link.href}>
      {body}
    </Link>
  )
}

/** Lien vers une visite : page du site, ou visite IMRSIVO dans un nouvel onglet. */
export function TourAnchor({
  link,
  className,
  label,
  newTabLabel,
  children,
}: {
  link: { href: string; external: boolean }
  className: string
  /** Nom accessible (vignette sans texte). */
  label?: string
  newTabLabel: string
  children: React.ReactNode
}) {
  if (link.external) {
    return (
      <a
        className={className}
        href={link.href}
        aria-label={label ? `${label} (${newTabLabel})` : undefined}
        {...newTab}
      >
        {children}
        {label ? null : <span className="sr-only"> ({newTabLabel})</span>}
      </a>
    )
  }
  return (
    <Link className={className} href={link.href} aria-label={label}>
      {children}
    </Link>
  )
}

export { PlayIcon }
