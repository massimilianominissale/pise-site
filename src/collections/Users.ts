import type { CollectionConfig } from 'payload'

import { fieldIsAdmin, hasRole, isAdmin, ROLES } from '../access'
import { GROUPS, l } from './shared'

const ROLE_LABELS = {
  admin: l('Administrateur', 'Administrator'),
  editor: l('Éditeur', 'Editor'),
  sales: l('Commercial', 'Sales'),
  ai: l('Assistant IA', 'AI assistant'),
}

/** Comptes du back-office : l'équipe PISE et le compte technique des assistants IA. */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: l('Utilisateur', 'User'),
    plural: l('Utilisateurs', 'Users'),
  },
  admin: {
    group: GROUPS.system,
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: true,
  access: {
    // Chacun voit et modifie son propre compte ; l'administrateur gère tous les comptes.
    read: ({ req }) =>
      hasRole(req, 'admin') ? true : req.user ? { id: { equals: req.user.id } } : false,
    create: isAdmin,
    update: ({ req }) =>
      hasRole(req, 'admin') ? true : req.user ? { id: { equals: req.user.id } } : false,
    delete: isAdmin,
    // Le compte IA n'ouvre pas l'interface d'administration : il passe par l'API.
    admin: ({ req }) => Boolean(req.user && req.user.collection === 'users' && !hasRole(req, 'ai')),
  },
  hooks: {
    beforeChange: [
      // Le tout premier compte créé est administrateur.
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({
            collection: 'users',
            req,
            overrideAccess: true,
          })
          if (totalDocs === 0) return { ...data, role: 'admin' }
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', label: l('Nom', 'Name'), type: 'text' },
    {
      name: 'role',
      label: l('Rôle', 'Role'),
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: ROLES.map((value) => ({ value, label: ROLE_LABELS[value] })),
      access: { update: fieldIsAdmin },
      admin: { position: 'sidebar' },
    },
  ],
}
