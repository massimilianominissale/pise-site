'use client'

import Link from 'next/link'
import { startTransition, useActionState, useId, useRef, useState } from 'react'

import { type FormState, submitContact } from '@/lib/actions/leads'
import { MAX_ATTACHMENT_BYTES } from '@/lib/forms'

import { Field, FieldError, Honeypot } from './fields'

type Labels = {
  form: {
    firstName: string
    lastName: string
    company: string
    email: string
    emailPlaceholder: string
    phone: string
    phonePlaceholder: string
    choose: string
    consent: string
    privacy: string
    newsletter: string
    sending: string
    errors: Record<'required' | 'email' | 'file' | 'fileSize' | 'slot' | 'global', string>
    profiles: Record<string, string>
  }
  page: {
    youAre: string
    placeType: string
    placeTypes: string[]
    brands: string
    region: string
    outsideFrance: string
    deadline: string
    deadlines: string[]
    quantities: string
    quantitiesPlaceholder: string
    message: string
    messagePlaceholder: string
    attach: string
    attachHint: string
    browse: string
    remove: string
    submit: string
    submitHint: string
    successTitle: string
    successText: string
    another: string
    takeAppointment: string
  }
}

type Props = {
  locale: string
  labels: Labels
  /** Marques proposées (identifiant d'URL et nom). */
  brands: { slug: string; name: string }[]
  regions: string[]
  /** Contexte venu du lien (devis d'un produit, sourcing…). */
  request?: string | null
  context?: string | null
  products?: string[]
  preselectedBrands?: string[]
  privacyHref?: string | null
  appointmentHref: string
}

/** Formulaire de contact : qualification en pastilles, coordonnées, message et pièce jointe. */
export function ContactForm({
  locale,
  labels,
  brands,
  regions,
  request,
  context,
  products = [],
  preselectedBrands = [],
  privacyHref,
  appointmentHref,
}: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitContact, {
    status: 'idle',
  })
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const id = useId()
  const t = labels.page
  const f = labels.form
  const err = (name: string) => {
    const key = state.errors?.[name]
    return key ? f.errors[key] : null
  }

  if (state.status === 'success') {
    return (
      <div className="form-success" role="status">
        <span className="h2">{t.successTitle}</span>
        <p className="body mute">{t.successText}</p>
        <div className="actions">
          <a className="pise-btn pise-btn--outline" href="">
            {t.another}
          </a>
          <Link className="pise-btn" href={appointmentHref}>
            {t.takeAppointment}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form
      className="contact-form"
      noValidate
      onSubmit={(e) => {
        // Envoi sans remise à zéro automatique des champs (React le ferait avec action=…).
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(() => action(data))
      }}
    >
      <input type="hidden" name="locale" value={locale} />
      {request ? <input type="hidden" name="demande" value={request} /> : null}
      {products.map((reference) => (
        <input key={reference} type="hidden" name="produit" value={reference} />
      ))}
      <Honeypot id={id} />

      {context ? <p className="form-context">{context}</p> : null}

      <fieldset className="form-group">
        <legend className="pise-eyebrow eyebrow-mute">{t.youAre}</legend>
        <div className="pise-chips">
          {Object.entries(f.profiles).map(([value, label]) => (
            <label key={value} className="pise-chip pise-chip--input">
              <input
                type="radio"
                name="profile"
                value={value}
                className="sr-only"
                defaultChecked={value === 'architect'}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="form-group">
        <legend className="pise-eyebrow eyebrow-mute">{t.placeType}</legend>
        <div className="pise-chips">
          {t.placeTypes.map((label) => (
            <label key={label} className="pise-chip pise-chip--input">
              <input type="radio" name="placeType" value={label} className="sr-only" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {brands.length ? (
        <fieldset className="form-group">
          <legend className="pise-eyebrow eyebrow-mute">{t.brands}</legend>
          <div className="pise-chips">
            {brands.map((b) => (
              <label key={b.slug} className="pise-chip pise-chip--input">
                <input
                  type="checkbox"
                  name="brands"
                  value={b.slug}
                  className="sr-only"
                  defaultChecked={preselectedBrands.includes(b.slug)}
                />
                {b.name}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="form-grid">
        <Field id={`${id}-fn`} label={f.firstName} error={err('firstName')}>
          <input
            id={`${id}-fn`}
            name="firstName"
            className="pise-input"
            autoComplete="given-name"
            required
          />
        </Field>
        <Field id={`${id}-ln`} label={f.lastName} error={err('lastName')}>
          <input
            id={`${id}-ln`}
            name="lastName"
            className="pise-input"
            autoComplete="family-name"
            required
          />
        </Field>
        <Field id={`${id}-co`} label={f.company}>
          <input
            id={`${id}-co`}
            name="company"
            className="pise-input"
            autoComplete="organization"
          />
        </Field>
        <Field id={`${id}-re`} label={t.region}>
          <select id={`${id}-re`} name="region" className="pise-input is-select" defaultValue="">
            <option value="">{f.choose}</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
            <option value={t.outsideFrance}>{t.outsideFrance}</option>
          </select>
        </Field>
        <Field id={`${id}-em`} label={f.email} error={err('email')}>
          <input
            id={`${id}-em`}
            name="email"
            type="email"
            className="pise-input"
            placeholder={f.emailPlaceholder}
            autoComplete="email"
            required
          />
        </Field>
        <Field id={`${id}-ph`} label={f.phone}>
          <input
            id={`${id}-ph`}
            name="phone"
            type="tel"
            className="pise-input"
            placeholder={f.phonePlaceholder}
            autoComplete="tel"
          />
        </Field>
        <Field id={`${id}-dl`} label={t.deadline}>
          <select id={`${id}-dl`} name="deadline" className="pise-input is-select" defaultValue="">
            <option value="">{f.choose}</option>
            {t.deadlines.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`${id}-qt`} label={t.quantities}>
          <input
            id={`${id}-qt`}
            name="quantities"
            className="pise-input"
            placeholder={t.quantitiesPlaceholder}
          />
        </Field>
      </div>

      <Field id={`${id}-ms`} label={t.message}>
        <textarea
          id={`${id}-ms`}
          name="message"
          className="area"
          placeholder={t.messagePlaceholder}
          rows={6}
        />
      </Field>

      <div className="drop">
        <span className="drop__ic" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M9 13V3M5 7l4-4 4 4M3 15h12" fill="none" stroke="#1f2227" strokeWidth="1.4" />
          </svg>
        </span>
        <div className="drop__text">
          <span className="body drop__title">{file ? file.name : t.attach}</span>
          <span className="cap">{t.attachHint}</span>
          <FieldError message={fileError ?? err('attachment')} />
        </div>
        <input
          ref={fileInput}
          id={`${id}-file`}
          type="file"
          name="attachment"
          className="sr-only"
          accept=".pdf,.dwg,.jpg,.jpeg,.png,.webp,.zip"
          onChange={(e) => {
            const chosen = e.target.files?.[0] ?? null
            if (chosen && chosen.size > MAX_ATTACHMENT_BYTES) {
              setFileError(f.errors.fileSize)
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
              if (fileInput.current) fileInput.current.value = ''
              setFile(null)
            }}
          >
            {t.remove}
          </button>
        ) : (
          <label
            htmlFor={`${id}-file`}
            className="pise-btn pise-btn--outline pise-btn--small drop__btn"
          >
            {t.browse}
          </label>
        )}
      </div>

      <div className="form-checks">
        <label className="check">
          <input type="checkbox" name="consent" required />
          <span>
            {f.consent}{' '}
            {privacyHref ? (
              <Link className="pise-textlink" href={privacyHref}>
                {f.privacy}
              </Link>
            ) : null}
          </span>
        </label>
        <FieldError message={err('consent')} />
        <label className="check">
          <input type="checkbox" name="newsletter" />
          <span>{f.newsletter}</span>
        </label>
      </div>

      {state.status === 'error' ? (
        <p className="form-alert" role="alert">
          {f.errors.global}
        </p>
      ) : null}

      <div className="form-submit">
        <button className="pise-btn" type="submit" disabled={pending}>
          {pending ? f.sending : t.submit}
        </button>
        <span className="cap">{t.submitHint}</span>
      </div>
    </form>
  )
}
