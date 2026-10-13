import type { Access, CollectionConfig, Where } from 'payload'

import { isApprovedCustomer, isEditor, isEditorOrAI } from '../access'
import { GROUPS, l } from './shared'

/**
 * Lecture selon le niveau d'accès du document :
 * - public : tout le monde ;
 * - pro : comptes pro validés et équipe ;
 * - interne : équipe uniquement (pièces jointes des demandes, par exemple).
 * Les fichiers passent par la route contrôlée de Payload, qui applique ces règles.
 */
const readByAccessLevel: Access = ({ req }) => {
  if (req.user?.collection === 'users') return true
  const allowed = isApprovedCustomer(req) ? ['public', 'pro'] : ['public']
  const where: Where = { access: { in: allowed } }
  return where
}

/** Documentation téléchargeable : fiches techniques, catalogues, tarifs, BIM, EPD… */
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: l('Document', 'Document'), plural: l('Documents', 'Documents') },
  admin: {
    group: GROUPS.media,
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'access', 'brand', 'updatedAt'],
  },
  access: {
    read: readByAccessLevel,
    create: isEditorOrAI,
    update: isEditor,
    delete: isEditor,
  },
  upload: {
    mimeTypes: [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'application/acad',
      'image/vnd.dwg',
      'application/octet-stream',
      'image/*',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
  fields: [
    { name: 'title', label: l('Titre', 'Title'), type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          label: l('Type', 'Type'),
          type: 'select',
          required: true,
          defaultValue: 'datasheet',
          options: [
            { label: l('Fiche technique', 'Datasheet'), value: 'datasheet' },
            { label: l('Catalogue', 'Catalogue'), value: 'catalogue' },
            { label: l('Tarif', 'Price list'), value: 'pricelist' },
            { label: l('Modèle 2D / 3D (BIM)', '2D / 3D model (BIM)'), value: 'cad' },
            { label: l('Fiche environnementale (EPD)', 'EPD'), value: 'epd' },
            { label: l('Notice', 'Instructions'), value: 'manual' },
            { label: l('Certificat', 'Certificate'), value: 'certificate' },
            { label: l('Conditions générales', 'Terms'), value: 'terms' },
            { label: l('Autre', 'Other'), value: 'other' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'access',
          label: l('Niveau d’accès', 'Access level'),
          type: 'select',
          required: true,
          defaultValue: 'public',
          index: true,
          options: [
            { label: l('Public', 'Public'), value: 'public' },
            { label: l('Pro (comptes validés)', 'Pro (approved accounts)'), value: 'pro' },
            { label: l('Interne (équipe)', 'Internal (team)'), value: 'internal' },
          ],
          admin: { width: '50%' },
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
          index: true,
          admin: { width: '50%' },
        },
        {
          name: 'language',
          label: l('Langue du document', 'Document language'),
          type: 'select',
          defaultValue: 'fr',
          options: [
            { label: 'Français', value: 'fr' },
            { label: 'English', value: 'en' },
            { label: 'Italiano', value: 'it' },
            { label: l('Multilingue', 'Multilingual'), value: 'multi' },
          ],
          admin: { width: '25%' },
        },
        { name: 'year', label: l('Année', 'Year'), type: 'number', admin: { width: '25%' } },
      ],
    },
  ],
}
