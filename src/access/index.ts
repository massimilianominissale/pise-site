import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'

/**
 * Rôles des comptes du back-office.
 * - admin : tout, y compris les comptes, les intégrations et les réglages
 * - editor : crée, modifie et publie les contenus et le catalogue
 * - sales : lit les leads et les comptes pro, valide les demandes d'accès
 * - ai : compte technique des assistants IA (MCP) — écrit uniquement des brouillons
 */
export const ROLES = ['admin', 'editor', 'sales', 'ai'] as const
export type Role = (typeof ROLES)[number]

type StaffUser = { collection: 'users'; role?: Role | null }
type CustomerUser = { collection: 'customers'; status?: string | null }

const staffUser = (req: PayloadRequest): StaffUser | null =>
  req.user && req.user.collection === 'users' ? (req.user as unknown as StaffUser) : null

export const roleOf = (req: PayloadRequest): Role | null => staffUser(req)?.role ?? null

export const hasRole = (req: PayloadRequest, ...roles: Role[]): boolean => {
  const role = roleOf(req)
  return role !== null && roles.includes(role)
}

export const isApprovedCustomer = (req: PayloadRequest): boolean =>
  Boolean(
    req.user &&
    req.user.collection === 'customers' &&
    (req.user as unknown as CustomerUser).status === 'approved',
  )

// ---------------------------------------------------------------------------
// Accès de collection
// ---------------------------------------------------------------------------

export const anyone: Access = () => true
export const nobody: Access = () => false

export const isStaff: Access = ({ req }) => Boolean(staffUser(req))
export const isAdmin: Access = ({ req }) => hasRole(req, 'admin')
export const isEditor: Access = ({ req }) => hasRole(req, 'admin', 'editor')
export const isSales: Access = ({ req }) => hasRole(req, 'admin', 'sales')

/** Contenus que l'IA peut créer et modifier (toujours en brouillon, voir hooks/aiDraftsOnly). */
export const isEditorOrAI: Access = ({ req }) => hasRole(req, 'admin', 'editor', 'ai')

/**
 * Lecture des contenus versionnés : le public ne voit que ce qui est publié,
 * l'équipe voit aussi les brouillons.
 */
export const publishedOrStaff: Access = ({ req }) => {
  if (staffUser(req)) return true
  const published: Where = { _status: { equals: 'published' } }
  return published
}

// ---------------------------------------------------------------------------
// Accès de champ
// ---------------------------------------------------------------------------

export const fieldIsAdmin: FieldAccess = ({ req }) => hasRole(req, 'admin')
export const fieldIsStaff: FieldAccess = ({ req }) => Boolean(staffUser(req))
export const fieldIsSales: FieldAccess = ({ req }) => hasRole(req, 'admin', 'sales')
