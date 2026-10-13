'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { LOCALES, type Locale } from '@/i18n/config'
import { switchLocaleHref } from '@/lib/links'

const NAMES: Record<Locale, string> = { fr: 'Français', en: 'English', it: 'Italiano' }

/** FR · EN · IT : même page dans une autre langue. */
export function LanguageSwitcher({
  locale,
  label,
  className,
}: {
  locale: Locale
  label: string
  className?: string
}) {
  const pathname = usePathname() ?? '/'
  return (
    <nav aria-label={label} className={className ? `lang ${className}` : 'lang'}>
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={switchLocaleHref(pathname, locale, l)}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? 'true' : undefined}
          title={NAMES[l]}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </nav>
  )
}
