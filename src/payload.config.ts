import { postgresAdapter } from '@payloadcms/db-postgres'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { isEditor, isStaff } from './access'
import { Announcements } from './collections/Announcements'
import { Brands } from './collections/Brands'
import { Customers } from './collections/Customers'
import { Documents } from './collections/Documents'
import { Events } from './collections/Events'
import { Faqs } from './collections/Faqs'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { ProductCategories } from './collections/ProductCategories'
import { Products } from './collections/Products'
import { Projects } from './collections/Projects'
import { Ranges } from './collections/Ranges'
import { Sectors } from './collections/Sectors'
import { GROUPS, l } from './collections/shared'
import { Showrooms } from './collections/Showrooms'
import { TeamMembers } from './collections/TeamMembers'
import { Users } from './collections/Users'
import { VirtualTours } from './collections/VirtualTours'
import { Posts } from './collections/Posts'
import { Footer } from './globals/Footer'
import { Home } from './globals/Home'
import { Integrations } from './globals/Integrations'
import { Listings } from './globals/Listings'
import { Navigation } from './globals/Navigation'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Adresse publique, renseignée seulement quand le domaine définitif est branché.
// Sans elle, Payload utilise des adresses relatives : le back-office fonctionne
// sur n'importe quelle préversion Vercel sans configuration supplémentaire.
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || ''

type SeoDoc = Record<string, unknown> & { title?: string; name?: string }

/** Chemin public de chaque contenu, utilisé par l'aperçu SEO. Les gabarits suivront ces adresses. */
const publicPath = (collection: string | undefined, doc: SeoDoc): string => {
  const slug = typeof doc.slug === 'string' ? doc.slug : ''
  switch (collection) {
    case 'brands':
      return `/fabricants/${slug}`
    case 'products':
      return `/produits/${slug}`
    case 'projects':
      return `/realisations/${slug}`
    case 'posts':
      return `/actualites/${slug}`
    case 'events':
      return `/agence/salons/${slug}`
    case 'virtual-tours':
      return `/espaces-virtuels/${slug}`
    case 'showrooms':
      return `/agence/showrooms/${slug}`
    case 'pages':
      return `/${slug}`
    default:
      return '/'
  }
}

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    // Pas d'appel à Gravatar : aucune donnée envoyée à un service tiers.
    avatar: 'default',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · Agence PISE',
    },
  },

  // Langue de l'interface d'administration
  i18n: {
    fallbackLanguage: 'fr',
    supportedLanguages: { fr, en },
  },

  // Langues des contenus du site
  localization: {
    locales: [
      { code: 'fr', label: 'Français' },
      { code: 'en', label: 'English' },
      { code: 'it', label: 'Italiano' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },

  collections: [
    // Catalogue
    Brands,
    Ranges,
    Products,
    ProductCategories,
    Sectors,
    // Contenus
    Projects,
    VirtualTours,
    Events,
    Posts,
    Pages,
    Faqs,
    Announcements,
    TeamMembers,
    Showrooms,
    // Médias
    Media,
    Documents,
    // Relation client
    Leads,
    Customers,
    // Système
    Users,
  ],
  globals: [Home, Navigation, Footer, Listings, Settings, Integrations],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // En développement, le schéma est synchronisé automatiquement ;
    // en préversion et en production, il évolue uniquement par migrations.
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),

  sharp,

  plugins: [
    // Médias et documents sur Vercel Blob dès que le jeton est présent (préversions et production).
    // En local, sans jeton, les fichiers restent sur le disque.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        // Images publiques : servies directement par Vercel Blob, sans passer par le serveur.
        media: { prefix: 'media', disablePayloadAccessControl: true },
        // Documents : servis par Payload, qui applique le niveau d'accès (public, pro, interne).
        documents: { prefix: 'documents' },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      clientUploads: true,
      addRandomSuffix: true,
      // Même schéma de base avec ou sans jeton Blob (local, préversion, production).
      alwaysInsertFields: true,
    }),

    // Titre, description et image de partage sur chaque contenu public.
    seoPlugin({
      collections: [
        'brands',
        'ranges',
        'products',
        'projects',
        'posts',
        'pages',
        'events',
        'virtual-tours',
        'showrooms',
      ],
      globals: ['home'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        const d = doc as SeoDoc
        const base = d.title || d.name
        return base ? `${base} · Agence PISE` : 'Agence PISE'
      },
      generateDescription: ({ doc }) => {
        const d = doc as SeoDoc
        const text = d.excerpt || d.shortDescription || d.summary || d.tagline
        return typeof text === 'string' ? text.slice(0, 160) : ''
      },
      generateURL: ({ doc, collectionConfig }) =>
        `${serverURL || 'https://agencepise.fr'}${publicPath(collectionConfig?.slug, doc as SeoDoc)}`,
    }),

    // Redirections 301 gérées depuis l'administration (reprise des anciennes adresses /index.php/…).
    redirectsPlugin({
      collections: ['pages', 'posts', 'brands', 'ranges', 'products', 'projects'],
      redirectTypes: ['301', '302'],
      overrides: {
        labels: { singular: l('Redirection', 'Redirect'), plural: l('Redirections', 'Redirects') },
        admin: { group: GROUPS.system },
        access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
      },
    }),

    // Recherche globale du site et du chatbot.
    searchPlugin({
      collections: ['brands', 'ranges', 'products', 'projects', 'posts', 'pages', 'events'],
      defaultPriorities: {
        brands: 10,
        products: 20,
        ranges: 30,
        projects: 40,
        posts: 50,
        events: 60,
        pages: 70,
      },
      beforeSync: ({ originalDoc, searchDoc }) => ({
        ...searchDoc,
        title: (originalDoc as SeoDoc).title || (originalDoc as SeoDoc).name || searchDoc.title,
      }),
      searchOverrides: {
        labels: {
          singular: l('Résultat de recherche', 'Search result'),
          plural: l('Index de recherche', 'Search index'),
        },
        admin: { group: GROUPS.system },
        access: { read: () => true, create: isStaff, update: isStaff, delete: isEditor },
      },
    }),
  ],
})
