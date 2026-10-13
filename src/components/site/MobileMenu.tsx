'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'

import type { Locale } from '@/i18n/config'

import { LanguageSwitcher } from './LanguageSwitcher'
import { type NavItem, NavLinks } from './NavLinks'

type Props = {
  locale: Locale
  items: NavItem[]
  pro: NavItem
  appointment: NavItem
  labels: { open: string; close: string; nav: string; language: string }
}

/** Menu plein écran des petits écrans. Se ferme au changement de page et avec Échap. */
export function MobileMenu({ locale, items, pro, appointment, labels }: Props) {
  const pathname = usePathname()
  // Le menu est ouvert pour une page donnée : changer de page le referme.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn !== null && openOn === pathname
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null)
  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenOn(null)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.classList.add('menu-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('menu-open')
    }
  }, [open])

  return (
    <div className="mobile-menu">
      <button
        ref={buttonRef}
        type="button"
        className="mobile-menu__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? labels.close : labels.open}
        onClick={() => setOpen(!open)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <div id={panelId} className="mobile-menu__panel" hidden={!open}>
        <nav aria-label={labels.nav}>
          <NavLinks items={items} className="mobile-menu__nav" />
        </nav>
        <div className="mobile-menu__actions">
          <Link className="pise-btn" href={appointment.href}>
            {appointment.label}
          </Link>
          <Link className="pise-btn pise-btn--outline" href={pro.href}>
            {pro.label}
          </Link>
        </div>
        <LanguageSwitcher locale={locale} label={labels.language} className="mobile-menu__lang" />
      </div>
    </div>
  )
}
