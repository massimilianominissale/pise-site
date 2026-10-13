'use client'

import { useActionState, useId } from 'react'

import { type NewsletterState, subscribeNewsletter } from '@/lib/actions/newsletter'

type Labels = {
  email: string
  placeholder: string
  submit: string
  consent: string
  success: string
  error: string
}

export function NewsletterForm({ locale, labels }: { locale: string; labels: Labels }) {
  const [state, action, pending] = useActionState<NewsletterState, FormData>(subscribeNewsletter, {
    status: 'idle',
  })
  const id = useId()

  if (state.status === 'success') {
    return (
      <p className="body newsletter__done" role="status">
        {labels.success}
      </p>
    )
  }

  return (
    <form action={action} className="newsletter__form">
      <input type="hidden" name="locale" value={locale} />
      <div className="newsletter__hp" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Site web</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="newsletter__row">
        <div className="pise-field newsletter__field">
          <label htmlFor={`${id}-email`}>{labels.email}</label>
          <input
            className="pise-input"
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={labels.placeholder}
          />
        </div>
        <button className="pise-btn" type="submit" disabled={pending}>
          {labels.submit}
        </button>
      </div>
      <label className="check">
        <input type="checkbox" name="consent" required />
        <span>{labels.consent}</span>
      </label>
      {state.status === 'error' ? (
        <p className="pise-field__msg" role="alert">
          {labels.error}
        </p>
      ) : null}
    </form>
  )
}
