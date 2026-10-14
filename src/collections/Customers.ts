import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { fieldIsSales, hasRole, isSales } from '../access'
import { GROUPS, l } from './shared'

/**
 * Comptes de l'espace pro (architectes, exploitants, revendeurs).
 * Collection d'authentification séparée de l'équipe : ces comptes n'ont pas accès
 * à l'administration. Les conditions commerciales sont lues en direct dans Zoho
 * et ne sont jamais stockées ici ; le K-bis est transmis à Zoho puis supprimé.
 */
export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: { singular: l('Compte pro', 'Pro account'), plural: l('Comptes pro', 'Pro accounts') },
  admin: {
    group: GROUPS.customers,
    useAsTitle: 'email',
    defaultColumns: ['company', 'email', 'status', 'createdAt'],
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    // Le lien de réinitialisation mène à l'espace pro du site, pas à l'administration.
    forgotPassword: {
      generateEmailSubject: () => 'Agence PISE · Réinitialiser votre mot de passe',
      generateEmailHTML: (args) => {
        const site =
          process.env.NEXT_PUBLIC_SERVER_URL ||
          (process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
            : 'http://localhost:3000')
        const url = `${site}/pro/mot-de-passe?token=${encodeURIComponent(String(args?.token ?? ''))}`
        return `<p>Bonjour,</p><p>Pour choisir un nouveau mot de passe pour votre espace pro Agence PISE, suivez ce lien (valable une heure) :</p><p><a href="${url}">${url}</a></p><p>Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.</p>`
      },
    },
  },
  access: {
    // Un client voit son propre compte ; l'équipe commerciale voit tous les comptes.
    read: ({ req }) => {
      if (hasRole(req, 'admin', 'sales', 'editor')) return true
      if (req.user?.collection === 'customers') return { id: { equals: req.user.id } }
      return false
    },
    // Les demandes d'accès sont créées par le formulaire du site, côté serveur.
    create: isSales,
    update: ({ req }) => {
      if (hasRole(req, 'admin', 'sales')) return true
      if (req.user?.collection === 'customers') return { id: { equals: req.user.id } }
      return false
    },
    delete: isSales,
    admin: () => false,
  },
  hooks: {
    beforeLogin: [
      ({ user }) => {
        if (user.status !== 'approved') {
          throw new APIError("Ce compte n'est pas encore validé par l'équipe PISE.", 403)
        }
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          label: l('Prénom', 'First name'),
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'lastName',
          label: l('Nom', 'Last name'),
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'company',
          label: l('Société', 'Company'),
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
        { name: 'siret', label: l('SIRET', 'SIRET'), type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'activity',
          label: l('Activité', 'Activity'),
          type: 'select',
          options: [
            { label: l('Architecte ou décorateur', 'Architect or designer'), value: 'architect' },
            { label: l('Hôtel ou restaurant', 'Hotel or restaurant'), value: 'hospitality' },
            { label: l('Entreprise', 'Company'), value: 'company' },
            { label: l('Revendeur', 'Reseller'), value: 'reseller' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'jobTitle',
          label: l('Fonction', 'Job title'),
          type: 'text',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', label: l('Téléphone', 'Phone'), type: 'text', admin: { width: '50%' } },
        { name: 'website', label: l('Site web', 'Website'), type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'status',
      label: l('Statut', 'Status'),
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: [
        { label: l('En attente de validation', 'Pending'), value: 'pending' },
        { label: l('Validé', 'Approved'), value: 'approved' },
        { label: l('Refusé', 'Rejected'), value: 'rejected' },
      ],
      access: { update: fieldIsSales },
      admin: { position: 'sidebar' },
    },
    {
      name: 'referent',
      label: l('Référent PISE', 'PISE contact'),
      type: 'relationship',
      relationTo: 'team-members',
      access: { update: fieldIsSales },
      admin: { position: 'sidebar' },
    },
    {
      name: 'zohoAccountId',
      label: l('Identifiant Zoho', 'Zoho ID'),
      type: 'text',
      access: { read: fieldIsSales, update: fieldIsSales },
      admin: {
        position: 'sidebar',
        description: l(
          'Sert à lire les conditions en direct dans Zoho.',
          'Used to read terms live from Zoho.',
        ),
      },
    },
    {
      name: 'kbisSentAt',
      label: l('K-bis transmis à Zoho le', 'K-bis sent to Zoho on'),
      type: 'date',
      access: { read: fieldIsSales, update: fieldIsSales },
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
