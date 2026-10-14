import '@fontsource-variable/archivo'
import '@fontsource-variable/hanken-grotesk'
import type { Metadata, Viewport } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type React from 'react'

import { AnnouncementBar } from '@/components/site/AnnouncementBar'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { LivePreview } from '@/components/site/LivePreview'
import { isLocale, type Locale, LOCALES } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { getCustomer } from '@/lib/auth'
import { resolveLink } from '@/lib/links'
import { getActiveAnnouncement, getGlobal } from '@/lib/payload'
import { INDEXABLE, SITE_URL } from '@/lib/seo'

import '../styles.css'

export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }))

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const settings = await getGlobal('settings', locale)
  const name = settings?.siteName || 'Agence PISE'
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: name, template: `%s · ${name}` },
    description: settings?.description || undefined,
    applicationName: name,
    openGraph: { siteName: name, locale, type: 'website' },
    robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  }
}

export const viewport: Viewport = { themeColor: '#ffffff' }

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: param } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)

  const preview = (await draftMode()).isEnabled
  const [navigation, footer, settings, announcement, customer] = await Promise.all([
    getGlobal('navigation', locale),
    getGlobal('footer', locale),
    getGlobal('settings', locale),
    getActiveAnnouncement(locale),
    getCustomer(),
  ])
  const account = customer
    ? {
        initials: `${customer.firstName?.[0] ?? ''}${customer.lastName?.[0] ?? ''}`.toUpperCase(),
        company: customer.company,
      }
    : null

  return (
    <html lang={locale}>
      <body>
        <a className="skip-link" href="#contenu">
          {dict.skipToContent}
        </a>
        {announcement ? (
          <AnnouncementBar
            storageKey={`pise-annonce-${announcement.id}-${announcement.updatedAt}`}
            locale={locale}
            message={announcement.message}
            link={resolveLink(announcement.link, locale)}
            tone={announcement.tone ?? 'ink'}
            targeting={announcement.targeting ?? 'all'}
            paths={announcement.paths ?? []}
            frequency={announcement.frequency ?? 'session'}
            closeLabel={dict.closeAnnouncement}
          />
        ) : null}
        <Header locale={locale} dict={dict} navigation={navigation} account={account} />
        <main id="contenu" tabIndex={-1}>
          {children}
        </main>
        <Footer locale={locale} dict={dict} footer={footer} settings={settings} />
        {preview ? <LivePreview label={dict.preview.label} exitLabel={dict.preview.exit} /> : null}
      </body>
    </html>
  )
}
