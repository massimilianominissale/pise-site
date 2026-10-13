import type { CollectionConfig } from 'payload'

import { isEditor, isEditorOrAI, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { draftHooks, featuredFields, galleryField, GROUPS, l, UNIVERSES, versioned } from './shared'

/** Fabricants représentés par l'Agence PISE (Johanson, Nardi, Fabbian…). */
export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: { singular: l('Fabricant', 'Brand'), plural: l('Fabricants', 'Brands') },
  admin: {
    group: GROUPS.catalogue,
    useAsTitle: 'name',
    defaultColumns: ['name', 'universes', 'country', '_status', 'updatedAt'],
    listSearchableFields: ['name'],
  },
  access: {
    read: publishedOrStaff,
    create: isEditor,
    update: isEditorOrAI,
    delete: isEditor,
  },
  versions: versioned,
  hooks: draftHooks,
  defaultSort: 'order',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: l('Présentation', 'Overview'),
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
                  name: 'country',
                  label: l('Pays de fabrication', 'Country of manufacture'),
                  type: 'text',
                  localized: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'universes',
              label: l('Univers', 'Product universes'),
              type: 'select',
              hasMany: true,
              options: UNIVERSES,
            },
            {
              name: 'tagline',
              label: l('Phrase d’accroche', 'Tagline'),
              type: 'text',
              localized: true,
              admin: {
                description: l(
                  'Une phrase factuelle : qui, quoi, depuis quand. Reprise en tête de page et par les moteurs IA.',
                  'One factual sentence: who, what, since when. Shown first and reused by AI engines.',
                ),
              },
            },
            {
              name: 'story',
              label: l('Histoire de la marque', 'Brand story'),
              type: 'richText',
              localized: true,
            },
            {
              name: 'keyFigures',
              label: l('Chiffres clés', 'Key figures'),
              type: 'array',
              labels: {
                singular: l('Chiffre clé', 'Key figure'),
                plural: l('Chiffres clés', 'Key figures'),
              },
              maxRows: 6,
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
            {
              type: 'row',
              fields: [
                {
                  name: 'foundedYear',
                  label: l('Année de fondation', 'Founded'),
                  type: 'number',
                  admin: { width: '33%' },
                },
                {
                  name: 'website',
                  label: l('Site officiel', 'Official website'),
                  type: 'text',
                  admin: { width: '67%' },
                },
              ],
            },
            {
              name: 'certifications',
              label: l('Labels et certifications', 'Labels and certifications'),
              type: 'text',
              localized: true,
            },
            {
              name: 'sectors',
              label: l('Secteurs', 'Sectors'),
              type: 'relationship',
              relationTo: 'sectors',
              hasMany: true,
            },
          ],
        },
        {
          label: l('Visuels', 'Visuals'),
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  label: l('Logo', 'Logo'),
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%' },
                },
                {
                  name: 'logoOnDark',
                  label: l('Logo pour fond sombre', 'Logo for dark backgrounds'),
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'heroImage',
              label: l('Image d’en-tête', 'Hero image'),
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'cardImage',
              label: l('Image de la carte', 'Card image'),
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: l(
                  'Utilisée sur la liste des fabricants et l’accueil.',
                  'Used on the brands list and home.',
                ),
              },
            },
            galleryField(),
          ],
        },
        {
          label: l('Catalogue lié', 'Related catalogue'),
          fields: [
            {
              name: 'ranges',
              label: l('Collections', 'Collections'),
              type: 'join',
              collection: 'ranges',
              on: 'brand',
            },
            {
              name: 'products',
              label: l('Produits', 'Products'),
              type: 'join',
              collection: 'products',
              on: 'brand',
            },
            {
              name: 'documents',
              label: l('Documentation', 'Documents'),
              type: 'join',
              collection: 'documents',
              on: 'brand',
            },
          ],
        },
      ],
    },
    slugField({ from: 'name' }),
    {
      name: 'referent',
      label: l('Référent PISE', 'PISE contact'),
      type: 'relationship',
      relationTo: 'team-members',
      admin: { position: 'sidebar' },
    },
    ...featuredFields(),
  ],
}
