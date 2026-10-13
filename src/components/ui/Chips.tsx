'use client'

type Option = { value: string; label: string }

type Props = {
  label: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  className?: string
}

/** Filtres en pastilles (un seul choix actif). */
export function Chips({ label, options, value, onChange, className }: Props) {
  return (
    <div
      className={className ? `pise-chips ${className}` : 'pise-chips'}
      role="group"
      aria-label={label}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="pise-chip"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
