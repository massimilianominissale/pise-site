import type { CollectionConfig } from 'payload'

import { isEditor, isEditorOrAI, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { draftHooks, featuredFields, galleryField, GROUPS, l, versioned } from './shared'

/** Réalisations : hôtels, restaurants, bureaux et écoles aménagés avec les fabricants PISE. */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: l('Réalisation', 'Project'), plural: l('Réalisations', 'Projects') },
  admin: {
    group: GROUPS.content,
    useAsTitle: 'title',
    defaultColumns: ['title', 'city', 'year', '_status', 'updatedAt'],
  },
  access: {
    read: publishedOrStaff,
    create: isEditorOrAI,
    update: isEditorOrAI,
    delete: isEditor,
  },
  versions: versioned,
  hooks: draftHooks,
  defaultSort: '-year',
  fields: [
    {
      name: 'title',
      label: l('Nom du projet', 'Project name'),
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'client', label: l('Client', 'Client'), type: 'text', admin: { width: '34%' } },
        { name: 'city', label: l('Ville', 'City'), type: 'text', admin: { width: '33%' } },
        { name: 'year', label: l('Année', 'Year'), type: 'number', admin: { width: '33%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sectors',
          label: l('Secteurs', 'Sectors'),
          type: 'relationship',
          relationTo: 'sectors',
          hasMany: true,
          admin: { width: '50%' },
        },
        { name: 'region', label: l('Région', 'Region'), type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'summary',
      label: l('Résumé', 'Summary'),
      type: 'textarea',
      localized: true,
      admin: {
        description: l(
          'Le projet en deux phrases : lieu, besoin, solution.',
          'The project in two sentences.',
        ),
      },
    },
    {
      name: 'body',
      label: l('Récit du projet', 'Project story'),
      type: 'richText',
      localized: true,
    },
    {
      name: 'cover',
      label: l('Photo principale', 'Main photo'),
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    galleryField(),
    {
      type: 'row',
      fields: [
        {
          name: 'brands',
          label: l('Fabricants', 'Brands'),
          type: 'relationship',
          relationTo: 'brands',
          hasMany: true,
          admin: { width: '50%' },
        },
        {
          name: 'products',
          label: l('Produits utilisés', 'Products used'),
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'virtualTour',
      label: l('Visite virtuelle', 'Virtual tour'),
      type: 'relationship',
      relationTo: 'virtual-tours',
    },
    slugField({ localized: true }),
    ...featuredFields(),
  ],
}
