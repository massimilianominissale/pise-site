import type { CollectionConfig } from 'payload'

import { isEditor, isEditorOrAI, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { draftHooks, featuredFields, GROUPS, l, versioned } from './shared'

/** Visites virtuelles à 360° réalisées par IMRSIVO, affichées en iframe. */
export const VirtualTours: CollectionConfig = {
  slug: 'virtual-tours',
  labels: {
    singular: l('Visite virtuelle', 'Virtual tour'),
    plural: l('Visites virtuelles', 'Virtual tours'),
  },
  admin: {
    group: GROUPS.content,
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'availability', '_status'],
  },
  access: {
    read: publishedOrStaff,
    create: isEditorOrAI,
    update: isEditorOrAI,
    delete: isEditor,
  },
  versions: versioned,
  hooks: draftHooks,
  defaultSort: 'order',
  fields: [
    { name: 'title', label: l('Titre', 'Title'), type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          label: l('Type d’espace', 'Space type'),
          type: 'select',
          required: true,
          defaultValue: 'brand-showroom',
          options: [
            { label: l('Showroom fabricant', 'Brand showroom'), value: 'brand-showroom' },
            { label: l('Showroom PISE', 'PISE showroom'), value: 'pise-showroom' },
            { label: l('Lieu aménagé', 'Furnished venue'), value: 'venue' },
            { label: l('Salon', 'Trade fair'), value: 'trade-fair' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'availability',
          label: l('Disponibilité', 'Availability'),
          type: 'select',
          defaultValue: 'live',
          options: [
            { label: l('En ligne', 'Live'), value: 'live' },
            { label: l('Bientôt', 'Coming soon'), value: 'soon' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'embedUrl',
      label: l('Adresse de la visite (iframe)', 'Tour URL (iframe)'),
      type: 'text',
      admin: {
        description: l(
          'Adresse fournie par IMRSIVO. Son domaine doit figurer dans Réglages › Intégrations.',
          'URL provided by IMRSIVO. Its domain must be listed in Settings › Integrations.',
        ),
        condition: (data) => data?.availability !== 'soon',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'location', label: l('Lieu', 'Location'), type: 'text', admin: { width: '50%' } },
        {
          name: 'credit',
          label: l('Réalisé par', 'Produced by'),
          type: 'text',
          defaultValue: 'IMRSIVO',
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'summary', label: l('Description', 'Description'), type: 'textarea', localized: true },
    { name: 'thumbnail', label: l('Vignette', 'Thumbnail'), type: 'upload', relationTo: 'media' },
    {
      name: 'rooms',
      label: l('Pièces de la visite', 'Rooms'),
      type: 'array',
      labels: { singular: l('Pièce', 'Room'), plural: l('Pièces', 'Rooms') },
      admin: {
        description: l('Raccourcis affichés sous la visite.', 'Shortcuts shown under the tour.'),
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              label: l('Nom', 'Name'),
              type: 'text',
              localized: true,
              required: true,
            },
            {
              name: 'sceneId',
              label: l('Lien direct vers la pièce', 'Direct link to the room'),
              type: 'text',
              admin: {
                description: l(
                  'Adresse https de la pièce fournie par IMRSIVO (même domaine que la visite).',
                  'https address of the room provided by IMRSIVO (same domain as the tour).',
                ),
              },
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'brands',
          label: l('Fabricants présentés', 'Brands shown'),
          type: 'relationship',
          relationTo: 'brands',
          hasMany: true,
          admin: { width: '50%' },
        },
        {
          name: 'products',
          label: l('Produits présentés', 'Products shown'),
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          admin: { width: '50%' },
        },
      ],
    },
    slugField({ localized: true }),
    ...featuredFields(),
  ],
}
