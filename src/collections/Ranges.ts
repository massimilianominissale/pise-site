import type { CollectionConfig } from 'payload'

import { isEditor, isEditorOrAI, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { draftHooks, featuredFields, galleryField, GROUPS, l, versioned } from './shared'

/**
 * Collections d'un fabricant (Split chez Johanson, Net chez Nardi…).
 * Le slug « ranges » évite le mot réservé « collections » de Payload ;
 * l'interface affiche « Collections ».
 */
export const Ranges: CollectionConfig = {
  slug: 'ranges',
  labels: { singular: l('Collection', 'Collection'), plural: l('Collections', 'Collections') },
  admin: {
    group: GROUPS.catalogue,
    useAsTitle: 'name',
    defaultColumns: ['name', 'brand', '_status', 'updatedAt'],
  },
  access: {
    read: publishedOrStaff,
    create: isEditorOrAI,
    update: isEditorOrAI,
    delete: isEditor,
  },
  versions: versioned,
  hooks: draftHooks,
  // Deux fabricants peuvent avoir une collection du même nom : l'identifiant est unique par fabricant.
  indexes: [{ fields: ['brand', 'slug'], unique: true }],
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          label: l('Nom', 'Name'),
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'brand',
          label: l('Fabricant', 'Brand'),
          type: 'relationship',
          relationTo: 'brands',
          required: true,
          index: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'designer',
          label: l('Designer', 'Designer'),
          type: 'text',
          admin: { width: '50%' },
        },
        {
          name: 'year',
          label: l('Année de lancement', 'Launch year'),
          type: 'number',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'summary',
      label: l('Résumé', 'Summary'),
      type: 'textarea',
      localized: true,
      admin: {
        description: l(
          'Une à deux phrases, reprises sur les cartes.',
          'One or two sentences, used on cards.',
        ),
      },
    },
    {
      name: 'description',
      label: l('Présentation', 'Description'),
      type: 'richText',
      localized: true,
    },
    {
      name: 'heroImage',
      label: l('Image principale', 'Main image'),
      type: 'upload',
      relationTo: 'media',
    },
    galleryField(),
    {
      name: 'products',
      label: l('Produits de la collection', 'Products in this collection'),
      type: 'join',
      collection: 'products',
      on: 'range',
    },
    slugField({ from: 'name', unique: false }),
    ...featuredFields(),
  ],
}
