import type { ReactNode } from 'react'

/** Champ de formulaire : libellé en capitales, contrôle, message d'erreur relié. */
export function Field({
  id,
  label,
  error,
  children,
  className,
}: {
  id: string
  label: string
  error?: string | null
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`pise-field${error ? ' pise-field--error' : ''}${className ? ` ${className}` : ''}`}
    >
      <label htmlFor={id}>{label}</label>
      {children}
      <FieldError message={error} />
    </div>
  )
}

export function FieldError({ message }: { message?: string | null }) {
  if (!message) return null
  return (
    <p className="pise-field__msg" role="alert">
      {message}
    </p>
  )
}

/** Champ invisible : seuls les robots le remplissent (l'envoi est alors ignoré). */
export function Honeypot({ id }: { id: string }) {
  return (
    <div className="form-hp" aria-hidden="true">
      <label htmlFor={`${id}-website`}>Site web</label>
      <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  )
}
