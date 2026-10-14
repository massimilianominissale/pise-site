/** SIRET : 14 chiffres et clé de Luhn (La Poste fait exception à la clé). */
export const normalizeSiret = (value: string) => value.replace(/\s+/g, '')

export const isValidSiret = (value: string): boolean => {
  const siret = normalizeSiret(value)
  if (!/^\d{14}$/.test(siret)) return false
  if (siret.startsWith('356000000')) {
    // La Poste : la somme des chiffres est un multiple de 5.
    return siret.split('').reduce((sum, d) => sum + Number(d), 0) % 5 === 0
  }
  let sum = 0
  for (let i = 0; i < 14; i++) {
    let digit = Number(siret[13 - i])
    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}
