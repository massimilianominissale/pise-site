import type { CollectionConfig, Field } from 'payload'

import { aiDraftsOnly } from '../hooks/aiDraftsOnly'

/** Libellé bilingue de l'interface d'administration. */
export const l = (fr: string, en: string) => ({ fr, en })

/** Groupes du menu de l'administration. */
export const GROUPS = {
  catalogue: l('Catalogue', 'Catalogue'),
  content: l('Contenus', 'Content'),
  media: l('Médias', 'Media'),
  customers: l('Relation client', 'Customers'),
  settings: l('Réglages', 'Settings'),
  system: l('Système', 'System'),
}

/**
 * Brouillons et historique des versions (50 par document).
 * La sauvegarde automatique sera activée avec l'aperçu en direct, à l'étape des gabarits.
 */
export const versioned: CollectionConfig['versions'] = {
  drafts: true,
  maxPerDoc: 50,
}

/** Hooks communs aux collections versionnées que l'IA peut alimenter. */
export const draftHooks: CollectionConfig['hooks'] = {
  beforeOperation: [aiDraftsOnly],
}

export const SECTOR_SLUGS = [
  'bureaux',
  'hotellerie',
  'education',
  'coworking',
  'restauration',
  'outdoor',
] as const

export const UNIVERSES = [
  { label: l('Mobilier', 'Furniture'), value: 'furniture' },
  { label: l('Luminaires', 'Lighting'), value: 'lighting' },
  { label: l('Outdoor', 'Outdoor'), value: 'outdoor' },
  { label: l('Acoustique', 'Acoustics'), value: 'acoustics' },
]

/** Case « mis en avant » + ordre d'affichage, dans la colonne latérale. */
export const featuredFields = (): Field[] => [
  {
    name: 'featured',
    label: l('Mis en avant', 'Featured'),
    type: 'checkbox',
    defaultValue: false,
    admin: { position: 'sidebar' },
  },
  {
    name: 'order',
    label: l('Ordre d’affichage', 'Sort order'),
    type: 'number',
    admin: {
      position: 'sidebar',
      description: l('Plus petit = affiché en premier.', 'Lower shows first.'),
    },
  },
]

/** Galerie d'images de la médiathèque. */
export const galleryField = (name = 'gallery'): Field => ({
  name,
  label: l('Galerie', 'Gallery'),
  type: 'upload',
  relationTo: 'media',
  hasMany: true,
})
