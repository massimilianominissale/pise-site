import type { CollectionConfig } from 'payload'

import { anyone, isEditor } from '../access'
import { slugField } from '../fields/slug'
import { GROUPS, l } from './shared'

/** Catégories de produits (chaises, fauteuils lounge, tables, suspensions…), hiérarchiques. */
export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: {
    singular: l('Catégorie de produits', 'Product category'),
    plural: l('Catégories de produits', 'Product categories'),
  },
  admin: {
    group: GROUPS.catalogue,
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent', 'order'],
  },
  access: {
    read: anyone,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  defaultSort: 'order',
  fields: [
    { name: 'name', label: l('Nom', 'Name'), type: 'text', required: true, localized: true },
    {
      name: 'parent',
      label: l('Catégorie parente', 'Parent category'),
      type: 'relationship',
      relationTo: 'product-categories',
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
    {
      name: 'description',
      label: l('Description', 'Description'),
      type: 'textarea',
      localized: true,
    },
    { name: 'image', label: l('Image', 'Image'), type: 'upload', relationTo: 'media' },
    slugField({ from: 'name' }),
    { name: 'order', label: l('Ordre', 'Order'), type: 'number', admin: { position: 'sidebar' } },
  ],
}
