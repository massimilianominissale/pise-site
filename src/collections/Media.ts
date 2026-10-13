import type { CollectionConfig } from 'payload'

import { anyone, isEditor, isEditorOrAI } from '../access'
import { GROUPS, l } from './shared'

/** Médiathèque : photos d'ambiance, produits, logos. Stockée sur Vercel Blob. */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: l('Média', 'Media'),
    plural: l('Médiathèque', 'Media library'),
  },
  admin: {
    group: GROUPS.media,
    defaultColumns: ['filename', 'alt', 'brand', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: isEditorOrAI,
    update: isEditorOrAI,
    delete: isEditor,
  },
  fields: [
    {
      name: 'alt',
      label: l('Texte alternatif', 'Alt text'),
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: l(
          "Décrit l'image pour les personnes malvoyantes et les moteurs de recherche.",
          'Describes the image for screen readers and search engines.',
        ),
      },
    },
    { name: 'caption', label: l('Légende', 'Caption'), type: 'text', localized: true },
    {
      type: 'row',
      fields: [
        {
          name: 'credit',
          label: l('Crédit photo', 'Photo credit'),
          type: 'text',
          admin: { width: '50%' },
        },
        {
          name: 'brand',
          label: l('Fabricant', 'Brand'),
          type: 'relationship',
          relationTo: 'brands',
          admin: { width: '50%' },
        },
      ],
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 480 },
      { name: 'card', width: 960 },
      { name: 'hero', width: 1920 },
    ],
    adminThumbnail: 'thumbnail',
  },
}
