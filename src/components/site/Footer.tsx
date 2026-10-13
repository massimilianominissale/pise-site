import Image from 'next/image'
import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import { type ResolvedLink, resolveLink } from '@/lib/links'
import type { Footer as FooterData, Setting } from '@/payload-types'

import { LanguageSwitcher } from './LanguageSwitcher'

type Props = {
  locale: Locale
  dict: Dictionary
  footer: FooterData | null
  settings: Setting | null
}

const SOCIAL_NAMES = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  pinterest: 'Pinterest',
  facebook: 'Facebook',
} as const

const A = ({ link, className }: { link: ResolvedLink; className?: string }) =>
  link.external || link.newTab ? (
    <a className={className} href={link.href} target="_blank" rel="noopener noreferrer">
      {link.label}
    </a>
  ) : (
    <Link className={className} href={link.href}>
      {link.label}
    </Link>
  )

/** Pied de page : bandeau des espaces virtuels, colonnes de liens, réseaux, mentions et langues. */
export function Footer({ locale, dict, footer, settings }: Props) {
  const banner = resolveLink(footer?.banner?.link, locale)
  const columns = (footer?.columns ?? []).map((column) => ({
    title: column.title,
    links: (column.links ?? [])
      .map((l) => resolveLink(l.link, locale))
      .filter((l): l is ResolvedLink => Boolean(l?.label)),
  }))
  const legal = (footer?.legalLinks ?? [])
    .map((l) => resolveLink(l.link, locale))
    .filter((l): l is ResolvedLink => Boolean(l?.label))
  const socials = settings?.socials ?? []

  return (
    <footer className="site-footer">
      {banner && footer?.banner?.text ? (
        <Link className="site-footer__banner" href={banner.href}>
          <span className="pise-eyebrow">{footer.banner.text}</span>
          {footer.banner.credit ? <span className="cap">{footer.banner.credit}</span> : null}
          <span className="pise-eyebrow" aria-hidden="true">
            →
          </span>
        </Link>
      ) : null}
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Image src="/brand/pise-logo-white.png" alt="Agence PISE" width={134} height={40} />
          {footer?.tagline ? <p className="body">{footer.tagline}</p> : null}
        </div>
        {columns.map((column, i) => (
          <nav key={column.title + i} aria-label={column.title} className="site-footer__col">
            <span className="pise-eyebrow">{column.title}</span>
            {column.links.map((link) => (
              <A key={link.href + link.label} link={link} />
            ))}
            {i === columns.length - 1 && socials.length ? (
              <span className="site-footer__socials" aria-label={dict.footer.social}>
                {socials.map((s, j) => (
                  <span key={s.id ?? s.url}>
                    {j > 0 ? ' · ' : ''}
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {SOCIAL_NAMES[s.network]}
                    </a>
                  </span>
                ))}
              </span>
            ) : null}
          </nav>
        ))}
        <div className="site-footer__legal cap">
          <span>
            {dict.footer.rights} {new Date().getFullYear()}
          </span>
          {legal.map((link) => (
            <A key={link.href} link={link} />
          ))}
          <LanguageSwitcher locale={locale} label={dict.language} className="site-footer__lang" />
        </div>
      </div>
    </footer>
  )
}
