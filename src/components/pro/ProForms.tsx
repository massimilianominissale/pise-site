'use client'

import Link from 'next/link'
import { startTransition, useActionState, useId, useRef, useState } from 'react'

import { Field, FieldError } from '@/components/forms/fields'
import {
  changePassword,
  loginCustomer,
  type ProState,
  requestAccess,
  requestPasswordReset,
  resetPassword,
} from '@/lib/actions/pro'
import { MAX_ATTACHMENT_BYTES } from '@/lib/forms'

type Messages = Record<NonNullable<ProState['message']>, string>

export type ProLabels = {
  login: string
  request: string
  welcomeBack: string
  loginLead: string
  email: string
  emailPlaceholder: string
  password: string
  forgot: string
  noAccount: string
  noAccountLink: string
  noAccountEnd: string
  resetTitle: string
  resetLead: string
  resetSend: string
  backToLogin: string
  sending: string
  messages: Messages
  required: string
  invalidEmail: string
}

/** Envoi sans remise à zéro des champs (React viderait le formulaire avec action=…). */
const submitWith = (action: (data: FormData) => void) => (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const data = new FormData(e.currentTarget)
  startTransition(() => action(data))
}

/** Panneau de connexion, avec bascule vers « Mot de passe oublié ». */
export function LoginPanel({ locale, labels }: { locale: string; labels: ProLabels }) {
  const [mode, setMode] = useState<'login' | 'reset'>('login')
  const [loginState, login, loggingIn] = useActionState<ProState, FormData>(loginCustomer, {
    status: 'idle',
  })
  const [resetState, reset, resetting] = useActionState<ProState, FormData>(requestPasswordReset, {
    status: 'idle',
  })
  const id = useId()

  return (
    <div className="pro-login">
      <div className="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          className="tab"
          aria-selected={true}
          onClick={() => setMode('login')}
        >
          {labels.login}
        </button>
        <a role="tab" className="tab" aria-selected={false} href="#acces">
          {labels.request}
        </a>
      </div>

      {mode === 'login' ? (
        <form className="pro-login__form" noValidate onSubmit={submitWith(login)}>
          <input type="hidden" name="locale" value={locale} />
          <div className="pro-login__intro">
            <h2 className="h2">{labels.welcomeBack}</h2>
            <p className="body mute">{labels.loginLead}</p>
          </div>
          <Field id={`${id}-em`} label={labels.email}>
            <input
              id={`${id}-em`}
              name="email"
              type="email"
              className="pise-input"
              placeholder={labels.emailPlaceholder}
              autoComplete="username"
              required
            />
          </Field>
          <Field id={`${id}-pw`} label={labels.password}>
            <input
              id={`${id}-pw`}
              name="password"
              type="password"
              className="pise-input"
              autoComplete="current-password"
              required
            />
          </Field>
          <div className="pro-login__row">
            <button
              type="button"
              className="pise-textlink pro-login__forgot"
              onClick={() => setMode('reset')}
            >
              {labels.forgot}
            </button>
          </div>
          {loginState.message ? (
            <p className="form-alert" role="alert">
              {labels.messages[loginState.message]}
            </p>
          ) : null}
          <button type="submit" className="pise-btn" disabled={loggingIn}>
            {loggingIn ? labels.sending : labels.login}
          </button>
          <p className="cap pro-login__note">
            {labels.noAccount}{' '}
            <a href="#acces" className="pise-textlink">
              {labels.noAccountLink}
            </a>
            {labels.noAccountEnd}
          </p>
        </form>
      ) : (
        <form className="pro-login__form" noValidate onSubmit={submitWith(reset)}>
          <div className="pro-login__intro">
            <h2 className="h2">{labels.resetTitle}</h2>
            <p className="body mute">{labels.resetLead}</p>
          </div>
          {resetState.status === 'success' && resetState.message ? (
            <p className="form-context" role="status">
              {labels.messages[resetState.message]}
            </p>
          ) : (
            <>
              <Field
                id={`${id}-rem`}
                label={labels.email}
                error={resetState.errors?.email ? labels.invalidEmail : null}
              >
                <input
                  id={`${id}-rem`}
                  name="email"
                  type="email"
                  className="pise-input"
                  placeholder={labels.emailPlaceholder}
                  autoComplete="email"
                  required
                />
              </Field>
              <button type="submit" className="pise-btn" disabled={resetting}>
                {resetting ? labels.sending : labels.resetSend}
              </button>
            </>
          )}
          <button
            type="button"
            className="pise-textlink pro-login__forgot"
            onClick={() => setMode('login')}
          >
            {labels.backToLogin}
          </button>
        </form>
      )}
    </div>
  )
}

export type AccessLabels = {
  company: string
  companyPlaceholder: string
  siret: string
  siretPlaceholder: string
  activity: string
  activities: Record<string, string>
  website: string
  websitePlaceholder: string
  firstName: string
  lastName: string
  jobTitle: string
  jobTitlePlaceholder: string
  proEmail: string
  emailPlaceholder: string
  phone: string
  phonePlaceholder: string
  choosePassword: string
  kbis: string
  kbisHint: string
  kbisNote: string
  browse: string
  remove: string
  consent: string
  privacy: string
  send: string
  sending: string
  doneTitle: string
  doneText: string
  messages: Messages
  errors: {
    required: string
    email: string
    siret: string
    password: string
    file: string
    fileSize: string
  }
}

/** Demande d'ouverture d'un compte pro, avec K-bis. */
export function AccessRequestForm({
  locale,
  labels,
  privacyHref,
}: {
  locale: string
  labels: AccessLabels
  privacyHref?: string | null
}) {
  const [state, action, pending] = useActionState<ProState, FormData>(requestAccess, {
    status: 'idle',
  })
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const id = useId()
  const err = (name: string) => {
    const key = state.errors?.[name]
    return key ? labels.errors[key as keyof AccessLabels['errors']] : null
  }

  if (state.status === 'success') {
    return (
      <div className="form-success pro-access__form" role="status">
        <span className="h2">{labels.doneTitle}</span>
        <p className="body mute">{labels.doneText}</p>
      </div>
    )
  }

  return (
    <form className="pro-access__form" noValidate onSubmit={submitWith(action)}>
      <input type="hidden" name="locale" value={locale} />
      <div className="form-hp" aria-hidden="true">
        <label htmlFor={`${id}-hp`}>Site</label>
        <input id={`${id}-hp`} name="website_hp" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-grid">
        <Field id={`${id}-co`} label={labels.company} error={err('company')}>
          <input
            id={`${id}-co`}
            name="company"
            className="pise-input"
            placeholder={labels.companyPlaceholder}
            autoComplete="organization"
            required
          />
        </Field>
        <Field id={`${id}-si`} label={labels.siret} error={err('siret')}>
          <input
            id={`${id}-si`}
            name="siret"
            className="pise-input"
            placeholder={labels.siretPlaceholder}
            inputMode="numeric"
            required
          />
        </Field>
        <Field id={`${id}-ac`} label={labels.activity}>
          <select
            id={`${id}-ac`}
            name="activity"
            className="pise-input is-select"
            defaultValue="architect"
          >
            {Object.entries(labels.activities).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`${id}-we`} label={labels.website}>
          <input
            id={`${id}-we`}
            name="website"
            className="pise-input"
            placeholder={labels.websitePlaceholder}
            autoComplete="url"
          />
        </Field>
        <Field id={`${id}-fn`} label={labels.firstName} error={err('firstName')}>
          <input
            id={`${id}-fn`}
            name="firstName"
            className="pise-input"
            autoComplete="given-name"
            required
          />
        </Field>
        <Field id={`${id}-ln`} label={labels.lastName} error={err('lastName')}>
          <input
            id={`${id}-ln`}
            name="lastName"
            className="pise-input"
            autoComplete="family-name"
            required
          />
        </Field>
        <Field id={`${id}-jt`} label={labels.jobTitle}>
          <input
            id={`${id}-jt`}
            name="jobTitle"
            className="pise-input"
            placeholder={labels.jobTitlePlaceholder}
            autoComplete="organization-title"
          />
        </Field>
        <Field id={`${id}-ph`} label={labels.phone}>
          <input
            id={`${id}-ph`}
            name="phone"
            type="tel"
            className="pise-input"
            placeholder={labels.phonePlaceholder}
            autoComplete="tel"
          />
        </Field>
        <Field id={`${id}-em`} label={labels.proEmail} error={err('email')}>
          <input
            id={`${id}-em`}
            name="email"
            type="email"
            className="pise-input"
            placeholder={labels.emailPlaceholder}
            autoComplete="email"
            required
          />
        </Field>
        <Field id={`${id}-pw`} label={labels.choosePassword} error={err('password')}>
          <input
            id={`${id}-pw`}
            name="password"
            type="password"
            className="pise-input"
            autoComplete="new-password"
            minLength={10}
            required
          />
        </Field>
      </div>

      <div className="drop">
        <span className="drop__ic" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M9 13V3M5 7l4-4 4 4M3 15h12" fill="none" stroke="#1f2227" strokeWidth="1.4" />
          </svg>
        </span>
        <div className="drop__text">
          <span className="body drop__title">{file ? file.name : labels.kbis}</span>
          <span className="cap">{labels.kbisHint}</span>
          <FieldError message={fileError ?? err('kbis')} />
        </div>
        <input
          ref={input}
          id={`${id}-kb`}
          type="file"
          name="kbis"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={(e) => {
            const chosen = e.target.files?.[0] ?? null
            if (chosen && chosen.size > MAX_ATTACHMENT_BYTES) {
              setFileError(labels.errors.fileSize)
              e.target.value = ''
              setFile(null)
              return
            }
            setFileError(null)
            setFile(chosen)
          }}
        />
        {file ? (
          <button
            type="button"
            className="pise-btn pise-btn--outline pise-btn--small drop__btn"
            onClick={() => {
              if (input.current) input.current.value = ''
              setFile(null)
            }}
          >
            {labels.remove}
          </button>
        ) : (
          <label
            htmlFor={`${id}-kb`}
            className="pise-btn pise-btn--outline pise-btn--small drop__btn"
          >
            {labels.browse}
          </label>
        )}
      </div>
      <p className="cap pro-access__note">{labels.kbisNote}</p>

      <div className="form-checks">
        <label className="check">
          <input type="checkbox" name="consent" required />
          <span>
            {labels.consent}{' '}
            {privacyHref ? (
              <Link className="pise-textlink" href={privacyHref}>
                {labels.privacy}
              </Link>
            ) : null}
          </span>
        </label>
        <FieldError message={err('consent')} />
      </div>

      {state.message ? (
        <p className="form-alert" role="alert">
          {labels.messages[state.message]}
        </p>
      ) : null}

      <button type="submit" className="pise-btn pro-access__submit" disabled={pending}>
        {pending ? labels.sending : labels.send}
      </button>
    </form>
  )
}

export type PasswordLabels = {
  current: string
  password: string
  confirm: string
  save: string
  sending: string
  done: string
  messages: Messages
  weak: string
}

/** Changement de mot de passe (connecté) ou réinitialisation (lien reçu par e-mail). */
export function PasswordForm({ labels, token }: { labels: PasswordLabels; token?: string }) {
  const [state, action, pending] = useActionState<ProState, FormData>(
    token ? resetPassword : changePassword,
    {
      status: 'idle',
    },
  )
  const id = useId()

  if (state.status === 'success') {
    return (
      <p className="form-context" role="status">
        {state.message ? labels.messages[state.message] : labels.done}
      </p>
    )
  }

  return (
    <form className="pro-password" noValidate onSubmit={submitWith(action)}>
      {token ? <input type="hidden" name="token" value={token} /> : null}
      {!token ? (
        <Field id={`${id}-cu`} label={labels.current}>
          <input
            id={`${id}-cu`}
            name="current"
            type="password"
            className="pise-input"
            autoComplete="current-password"
            required
          />
        </Field>
      ) : null}
      <Field
        id={`${id}-pw`}
        label={labels.password}
        error={state.errors?.password ? labels.weak : null}
      >
        <input
          id={`${id}-pw`}
          name="password"
          type="password"
          className="pise-input"
          autoComplete="new-password"
          minLength={10}
          required
        />
      </Field>
      <Field id={`${id}-co`} label={labels.confirm}>
        <input
          id={`${id}-co`}
          name="confirm"
          type="password"
          className="pise-input"
          autoComplete="new-password"
          required
        />
      </Field>
      {state.message ? (
        <p className="form-alert" role="alert">
          {labels.messages[state.message]}
        </p>
      ) : null}
      <button type="submit" className="pise-btn" disabled={pending}>
        {pending ? labels.sending : labels.save}
      </button>
    </form>
  )
}
