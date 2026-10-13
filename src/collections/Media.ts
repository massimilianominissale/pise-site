import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { fr: 'Média', en: 'Media' },
    plural: { fr: 'Médiathèque', en: 'Media library' },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: { fr: 'Texte alternatif', en: 'Alt text' },
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: {
          fr: "Décrit l'image pour les personnes malvoyantes et les moteurs de recherche.",
          en: 'Describes the image for screen readers and search engines.',
        },
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 480 },
      { name: 'card', width: 960 },
      { name: 'hero', width: 1920 },
    ],
    adminThumbnail: 'thumbnail',
  },
}
