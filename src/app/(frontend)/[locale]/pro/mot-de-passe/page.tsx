import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PasswordForm } from '@/components/pro/ProForms'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string }> }

export const metadata: Metadata = { robots: { index: false, follow: false } }

/** Nouveau mot de passe, depuis le lien reçu par e-mail (« Mot de passe oublié »). */
export default async function ResetPasswordPage({ params, searchParams }: Props) {
  const { locale: param } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const t = dict.proPage
  const { token } = await searchParams

  return (
    <section className="container pro-reset">
      <nav aria-label={dict.breadcrumb} className="crumb">
        <Link href={localizedPath(locale, 'pro')}>{dict.pro}</Link> / {t.resetTitle}
      </nav>
      <h1 className="page-title page-title--md">{t.newPassword}</h1>
      {token ? (
        <PasswordForm
          token={token}
          labels={{
            current: t.currentPassword,
            password: t.newPassword,
            confirm: t.confirmPassword,
            save: t.savePassword,
            sending: dict.form.sending,
            done: t.messages.resetDone,
            messages: t.messages,
            weak: t.fieldErrors.password,
          }}
        />
      ) : (
        <p className="form-alert">{t.messages.resetExpired}</p>
      )}
      <Link className="pise-link" href={localizedPath(locale, 'pro')}>
        {t.backToLogin}
      </Link>
    </section>
  )
}
