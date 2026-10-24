import type { CollectionConfig, Where } from 'payload'

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
              name: 'catalogues',
              label: l('Catalogues', 'Catalogues'),
              type: 'array',
              labels: {
                singular: l('Catalogue', 'Catalogue'),
                plural: l('Catalogues', 'Catalogues'),
              },
              admin: {
                description: l(
                  'Boutons affichés à côté du lien vers le site officiel : un lien (Dropbox, site du fabricant…) ou un document de la documentation.',
                  'Buttons shown next to the official website link: a link (Dropbox, maker’s site…) or a document.',
                ),
              },
              fields: [
                {
                  name: 'label',
                  label: l('Libellé du bouton', 'Button label'),
                  type: 'text',
                  localized: true,
                  required: true,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'url',
                      label: l('Lien', 'Link'),
                      type: 'text',
                      admin: { width: '50%' },
                      validate: (value: unknown, { siblingData }: { siblingData: unknown }) =>
                        value || (siblingData as { document?: unknown })?.document
                          ? true
                          : 'Indiquez un lien ou choisissez un document.',
                    },
                    {
                      name: 'document',
                      label: l('ou document', 'or document'),
                      type: 'relationship',
                      relationTo: 'documents',
                      admin: { width: '50%' },
                    },
                  ],
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
              // Les collections sont remplacées par « Notre sélection » (produits) depuis le 22/10.
              admin: { hidden: true },
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
      name: 'parent',
      label: l('Marque « by »… de', 'Sub-brand of'),
      type: 'relationship',
      relationTo: 'brands',
      index: true,
      admin: {
        position: 'sidebar',
        description: l(
          'Pour une marque d’un fabricant (Noon by Johanson…) : elle s’affiche sur la page de ce fabricant, pas dans la liste des fabricants.',
          'For a brand belonging to another brand (Noon by Johanson…): shown on that brand’s page, not in the brands list.',
        ),
      },
      // Un seul niveau : on ne rattache qu'à un fabricant principal, jamais à soi-même.
      filterOptions: ({ id }): Where => {
        const conditions: Where[] = [{ parent: { exists: false } }]
        if (id) conditions.push({ id: { not_equals: id } })
        return { and: conditions }
      },
    },
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
