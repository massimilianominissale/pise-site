// @vitest-environment node
import fs from 'fs'
import path from 'path'
import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'

import { LOCALES, ROUTES } from '@/i18n/config'
import { localizeHref, resolveLink, switchLocaleHref } from '@/lib/links'
import { proxy } from '@/proxy'

const APP = path.resolve(process.cwd(), 'src/app/(frontend)/[locale]')

const run = (url: string) => proxy(new NextRequest(new URL(url, 'https://agencepise.fr')))

describe('Adresses par langue', () => {
  it('traduit les rubriques saisies en français', () => {
    expect(localizeHref('fr', '/fabricants')).toBe('/fabricants')
    expect(localizeHref('en', '/fabricants#nardi')).toBe('/en/brands#nardi')
    expect(localizeHref('it', '/rendez-vous?format=video')).toBe('/it/appuntamento?format=video')
    expect(localizeHref('en', '/')).toBe('/en')
    expect(localizeHref('fr', '/#rdv')).toBe('/#rdv')
    expect(localizeHref('en', 'https://imrsivo.com')).toBe('https://imrsivo.com')
  })

  it('donne la même page dans une autre langue', () => {
    expect(switchLocaleHref('/en/brands/nardi', 'en', 'it')).toBe('/it/marchi/nardi')
    expect(switchLocaleHref('/fabricants', 'fr', 'en')).toBe('/en/brands')
    expect(switchLocaleHref('/it', 'it', 'fr')).toBe('/')
  })

  it('résout un lien vers un fabricant', () => {
    const link = resolveLink(
      { type: 'internal', reference: { relationTo: 'brands', value: { slug: 'nardi', name: 'Nardi' } } },
      'en',
    )
    expect(link).toMatchObject({ href: '/en/brands/nardi', label: 'Nardi', external: false })
  })
})

describe('Proxy', () => {
  it('sert le français sans préfixe et redirige /fr', () => {
    expect(run('/fabricants/nardi').headers.get('x-middleware-rewrite')).toContain('/fr/fabricants/nardi')
    const redirect = run('/fr/fabricants')
    expect(redirect.status).toBe(308)
    expect(redirect.headers.get('location')).toBe('https://agencepise.fr/fabricants')
  })

  it('ne réécrit que la langue', () => {
    expect(run('/en/brands/nardi').headers.get('x-middleware-rewrite')).toContain('/en/brands/nardi')
  })

  it('redirige une rubrique dans la mauvaise langue', () => {
    const toEnglish = run('/en/fabricants/nardi')
    expect(toEnglish.status).toBe(308)
    expect(toEnglish.headers.get('location')).toBe('https://agencepise.fr/en/brands/nardi')
    const toFrench = run('/brands')
    expect(toFrench.headers.get('location')).toBe('https://agencepise.fr/fabricants')
  })
})

describe('Dossiers des rubriques', () => {
  it('chaque rubrique codée en français existe aussi en anglais et en italien', () => {
    for (const route of Object.values(ROUTES)) {
      const frDir = path.join(APP, route.fr)
      if (!fs.existsSync(frDir)) continue // rubrique pas encore codée
      const frPages = fs
        .readdirSync(frDir, { recursive: true })
        .map(String)
        .filter((f) => f.endsWith('page.tsx'))
      for (const locale of LOCALES) {
        for (const page of frPages) {
          expect(fs.existsSync(path.join(APP, route[locale], page)), `${route[locale]}/${page}`).toBe(true)
        }
      }
    }
  })
})
