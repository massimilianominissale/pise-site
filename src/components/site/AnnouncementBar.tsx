'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useSyncExternalStore } from 'react'

import type { Locale } from '@/i18n/config'
import { localizeHref, type ResolvedLink } from '@/lib/links'

type Props = {
  storageKey: string
  locale: Locale
  message: string
  link: ResolvedLink | null
  tone: 'ink' | 'ocean'
  targeting: 'all' | 'home' | 'paths'
  paths: string[]
  frequency: 'session' | 'once' | 'always'
  closeLabel: string
}

const storageFor = (frequency: Props['frequency']): Storage | null => {
  try {
    if (frequency === 'once') return window.localStorage
    if (frequency === 'session') return window.sessionStorage
  } catch {
    // Stockage indisponible (navigation privée, cookies bloqués) : l'annonce reste simplement affichée.
  }
  return null
}

/** Bandeau d'annonce (back-office › Annonces), avec ciblage par page et mémorisation de la fermeture. */
export function AnnouncementBar(props: Props) {
  const { storageKey, locale, message, link, tone, targeting, paths, frequency, closeLabel } = props
  const pathname = usePathname() ?? '/'
  const [closed, setClosed] = useState(false)
  // Fermeture mémorisée lors d'une visite précédente (lue après l'hydratation, jamais côté serveur).
  const remembered = useSyncExternalStore(
    (onChange) => {
      window.addEventListener('storage', onChange)
      return () => window.removeEventListener('storage', onChange)
    },
    () => {
      try {
        return Boolean(storageFor(frequency)?.getItem(storageKey))
      } catch {
        return false
      }
    },
    () => false,
  )
  const dismissed = closed || remembered

  const home = localizeHref(locale, '/')
  const targeted =
    targeting === 'all' ||
    (targeting === 'home' && pathname === home) ||
    (targeting === 'paths' &&
      paths.some((p) => {
        const target = localizeHref(locale, p)
        return pathname === target || pathname.startsWith(target + '/')
      }))

  if (dismissed || !targeted) return null

  const close = () => {
    setClosed(true)
    try {
      storageFor(frequency)?.setItem(storageKey, '1')
    } catch {
      // ignoré
    }
  }

  return (
    <div
      className={`pise-announce${tone === 'ocean' ? ' pise-announce--teal' : ''}`}
      role="region"
      aria-label={message}
    >
      <span className="pise-announce__text">{message}</span>
      {link ? (
        link.external || link.newTab ? (
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
          </a>
        ) : (
          <Link href={link.href}>{link.label}</Link>
        )
      ) : null}
      <button
        type="button"
        className="pise-announce__close"
        aria-label={closeLabel}
        onClick={close}
      >
        ×
      </button>
    </div>
  )
}
