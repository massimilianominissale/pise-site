import type { CollectionConfig } from 'payload'

import { isEditor, isEditorOrAI, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { draftHooks, featuredFields, GROUPS, l, versioned } from './shared'

/**
 * Produits du catalogue. Chaque produit a un lien stable /p/[référence],
 * utilisé par les légendes du générateur Mobilia : il ne change jamais,
 * même si le nom ou l'identifiant d'URL du produit évolue.
 */
export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: l('Produit', 'Product'), plural: l('Produits', 'Products') },
  admin: {
    group: GROUPS.catalogue,
    useAsTitle: 'name',
    defaultColumns: ['name', 'reference', 'brand', 'range', '_status', 'updatedAt'],
    listSearchableFields: ['name', 'reference'],
  },
  access: {
    read: publishedOrStaff,
    create: isEditor,
    update: isEditorOrAI,
    delete: isEditor,
  },
  versions: versioned,
  hooks: draftHooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: l('Fiche', 'Details'),
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
                  name: 'reference',
                  label: l('Référence', 'Reference'),
                  type: 'text',
                  required: true,
                  unique: true,
                  index: true,
                  admin: {
                    width: '50%',
                    description: l(
                      'Sert au lien permanent /p/[référence] utilisé dans Mobilia. Ne pas modifier une fois publiée.',
                      'Used for the permanent /p/[reference] link in Mobilia. Do not change once published.',
                    ),
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'brand',
                  label: l('Fabricant', 'Brand'),
                  type: 'relationship',
                  relationTo: 'brands',
                  required: true,
                  index: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'range',
                  label: l('Collection', 'Collection'),
                  type: 'relationship',
                  relationTo: 'ranges',
                  index: true,
                  admin: { width: '50%' },
                  // Ne propose que les collections du fabricant choisi.
                  filterOptions: ({ siblingData }) => {
                    const brand = (siblingData as { brand?: unknown })?.brand
                    return brand ? { brand: { equals: brand } } : true
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'categories',
                  label: l('Catégories', 'Categories'),
                  type: 'relationship',
                  relationTo: 'product-categories',
                  hasMany: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'sectors',
                  label: l('Secteurs', 'Sectors'),
                  type: 'relationship',
                  relationTo: 'sectors',
                  hasMany: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'shortDescription',
              label: l('Description courte', 'Short description'),
              type: 'textarea',
              localized: true,
              admin: {
                description: l(
                  'Deux phrases : usage, matière, point fort. Reprise en tête de fiche, dans les cartes et par les moteurs IA.',
                  'Two sentences: use, material, key benefit.',
                ),
              },
            },
            {
              name: 'description',
              label: l('Description détaillée', 'Full description'),
              type: 'richText',
              localized: true,
            },
            {
              name: 'images',
              label: l('Images', 'Images'),
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: {
                description: l(
                  'La première image sert de vignette.',
                  'The first image is the thumbnail.',
                ),
              },
            },
          ],
        },
        {
          label: l('Finitions', 'Finishes'),
          fields: [
            {
              name: 'finishes',
              label: l('Finitions', 'Finishes'),
              type: 'array',
              labels: { singular: l('Finition', 'Finish'), plural: l('Finitions', 'Finishes') },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      label: l('Nom', 'Name'),
                      type: 'text',
                      localized: true,
                      required: true,
                      admin: { width: '40%' },
                    },
                    {
                      name: 'code',
                      label: l('Code fabricant', 'Manufacturer code'),
                      type: 'text',
                      admin: { width: '30%' },
                    },
                    {
                      name: 'swatch',
                      label: l('Couleur (hex)', 'Swatch (hex)'),
                      type: 'text',
                      admin: { width: '30%', placeholder: '#3B3D40' },
                      validate: (value: unknown) =>
                        !value ||
                        /^#[0-9a-fA-F]{6}$/.test(String(value)) ||
                        'Format attendu : #RRGGBB',
                    },
                  ],
                },
                {
                  name: 'image',
                  label: l('Photo dans cette finition', 'Photo in this finish'),
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },
        {
          label: l('Caractéristiques', 'Specifications'),
          fields: [
            {
              name: 'dimensions',
              label: l('Dimensions (cm)', 'Dimensions (cm)'),
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'width',
                      label: l('Largeur', 'Width'),
                      type: 'number',
                      admin: { width: '20%' },
                    },
                    {
                      name: 'depth',
                      label: l('Profondeur', 'Depth'),
                      type: 'number',
                      admin: { width: '20%' },
                    },
                    {
                      name: 'height',
                      label: l('Hauteur', 'Height'),
                      type: 'number',
                      admin: { width: '20%' },
                    },
                    {
                      name: 'seatHeight',
                      label: l('Hauteur d’assise', 'Seat height'),
                      type: 'number',
                      admin: { width: '20%' },
                    },
                    {
                      name: 'diameter',
                      label: l('Diamètre', 'Diameter'),
                      type: 'number',
                      admin: { width: '20%' },
                    },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'weight',
                  label: l('Poids (kg)', 'Weight (kg)'),
                  type: 'number',
                  admin: { width: '33%' },
                },
                {
                  name: 'designer',
                  label: l('Designer', 'Designer'),
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'warranty',
                  label: l('Garantie', 'Warranty'),
                  type: 'text',
                  localized: true,
                  admin: { width: '34%' },
                },
              ],
            },
            {
              name: 'materials',
              label: l('Matériaux', 'Materials'),
              type: 'text',
              localized: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'stackable',
                  label: l('Empilable', 'Stackable'),
                  type: 'checkbox',
                  admin: { width: '33%' },
                },
                {
                  name: 'indoor',
                  label: l('Usage intérieur', 'Indoor use'),
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '33%' },
                },
                {
                  name: 'outdoor',
                  label: l('Usage extérieur', 'Outdoor use'),
                  type: 'checkbox',
                  admin: { width: '34%' },
                },
              ],
            },
            {
              name: 'certifications',
              label: l('Labels et normes', 'Labels and standards'),
              type: 'text',
              localized: true,
            },
            {
              name: 'specs',
              label: l('Autres caractéristiques', 'Other specifications'),
              type: 'array',
              labels: {
                singular: l('Caractéristique', 'Specification'),
                plural: l('Caractéristiques', 'Specifications'),
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      label: l('Libellé', 'Label'),
                      type: 'text',
                      localized: true,
                      required: true,
                    },
                    {
                      name: 'value',
                      label: l('Valeur', 'Value'),
                      type: 'text',
                      localized: true,
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: l('Liens', 'Relations'),
          fields: [
            {
              name: 'documents',
              label: l('Documents', 'Documents'),
              type: 'relationship',
              relationTo: 'documents',
              hasMany: true,
            },
            {
              name: 'faqs',
              label: l('Questions fréquentes', 'FAQs'),
              type: 'relationship',
              relationTo: 'faqs',
              hasMany: true,
            },
            {
              name: 'relatedProducts',
              label: l('Produits associés', 'Related products'),
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
            },
          ],
        },
      ],
    },
    slugField({ from: 'name' }),
    ...featuredFields(),
  ],
}
