import Image from 'next/image'
import Link from 'next/link'

import { type Locale, localizedPath } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import { resolveLink } from '@/lib/links'
import type { Navigation } from '@/payload-types'

import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'
import { type NavItem, NavLinks } from './NavLinks'

type Props = {
  locale: Locale
  dict: Dictionary
  navigation: Navigation | null
  /** Compte pro connecté : initiales et société à la place de « Espace pro ». */
  account?: { initials: string; company: string } | null
}

/** En-tête collant : logo, menu (back-office › Navigation), langues, espace pro et rendez-vous. */
export function Header({ locale, dict, navigation, account }: Props) {
  const items: NavItem[] = (navigation?.items ?? [])
    .map((item) => resolveLink(item.link, locale))
    .filter((l): l is NonNullable<typeof l> => Boolean(l?.label))
    .map(({ href, label, newTab }) => ({ href, label, newTab }))

  const pro: NavItem = {
    href: localizedPath(locale, 'pro'),
    label: navigation?.proLabel || dict.pro,
  }
  const appointment: NavItem = {
    href: localizedPath(locale, 'appointment'),
    label: navigation?.appointmentLabel || dict.appointment,
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          href={localizedPath(locale)}
          className="site-header__logo"
          aria-label={`Agence PISE, ${dict.home}`}
        >
          <Image src="/brand/pise-logo.png" alt="Agence PISE" width={120} height={36} priority />
        </Link>
        <nav aria-label={dict.mainNav} className="site-header__nav">
          <NavLinks items={items} className="pise-nav" />
        </nav>
        <div className="site-header__actions">
          <LanguageSwitcher locale={locale} label={dict.language} className="site-header__lang" />
          {account ? (
            <Link
              className="site-header__account"
              href={pro.href}
              aria-label={`${pro.label} · ${account.company}`}
            >
              <span className="site-header__initials" aria-hidden="true">
                {account.initials}
              </span>
              <span className="site-header__company">{account.company}</span>
            </Link>
          ) : (
            <Link className="site-header__pro" href={pro.href}>
              {pro.label}
            </Link>
          )}
          <Link className="pise-btn pise-btn--small" href={appointment.href}>
            {appointment.label}
          </Link>
        </div>
        <MobileMenu
          locale={locale}
          items={items}
          pro={pro}
          appointment={appointment}
          labels={{
            open: dict.openMenu,
            close: dict.closeMenu,
            nav: dict.mainNav,
            language: dict.language,
          }}
        />
      </div>
    </header>
  )
}
