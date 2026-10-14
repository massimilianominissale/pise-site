'use client'

import Link from 'next/link'
import { startTransition, useActionState, useId, useMemo, useState } from 'react'

import { Img } from '@/components/ui/Img'
import { type FormState, submitAppointment } from '@/lib/actions/leads'
import { type AppointmentFormat, isBookableDay, isoDate, slotsFor } from '@/lib/forms'

import { Field, FieldError, Honeypot } from './fields'

const FORMATS: AppointmentFormat[] = ['video', 'showroom', 'virtual-tour', 'factory']

export type AppointmentLabels = {
  form: {
    firstName: string
    lastName: string
    company: string
    companyPlaceholder: string
    profile: string
    email: string
    emailPlaceholder: string
    phone: string
    phonePlaceholder: string
    privacy: string
    newsletter: string
    sending: string
    errors: Record<'required' | 'email' | 'file' | 'fileSize' | 'slot' | 'global', string>
    profiles: Record<string, string>
  }
  page: {
    steps: { format: string; member: string; when: string; contact: string }
    /** « Étape {n} sur {total} · {label} » */
    stepOf: string
    formatTitle: string
    formats: Record<AppointmentFormat, { label: string; duration: string; text: string }>
    showroom: string
    memberTitle: string
    firstAvailable: string
    moreSlots: string
    whenTitle: string
    previousMonth: string
    nextMonth: string
    weekdays: string[]
    parisTime: string
    morning: string
    afternoon: string
    pickDay: string
    periodLabel: string
    periodPlaceholder: string
    contactTitle: string
    projectLabel: string
    projectPlaceholder: string
    consent: string
    recap: string
    recapFormat: string
    recapWith: string
    recapDate: string
    recapTime: string
    recapPeriod: string
    toChoose: string
    /** « {time}, heure de Paris » */
    timeAt: string
    confirm: string
    confirmShort: string
    continue: string
    back: string
    edit: string
    confirmNote: string
    successTitle: string
    successText: string
    home: string
  }
}

export type Member = { id: number; name: string; caption: string | null; photo: unknown }

type Props = {
  locale: string
  labels: AppointmentLabels
  members: Member[]
  showrooms: { id: number; name: string }[]
  initialFormat?: AppointmentFormat | null
  initialMember?: number | null
  /** Contexte venu du lien : marque, visite, produit (enregistrés avec la demande). */
  context?: string | null
  hidden: { fabricant?: string; visite?: string; produit?: string }
  privacyHref?: string | null
  homeHref: string
}

type Step = 'format' | 'member' | 'when' | 'contact'

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))

/** Demande de rendez-vous en quatre étapes, avec récapitulatif. */
export function AppointmentForm({
  locale,
  labels,
  members,
  showrooms,
  initialFormat,
  initialMember,
  context,
  hidden,
  privacyHref,
  homeHref,
}: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitAppointment, {
    status: 'idle',
  })
  const id = useId()
  const t = labels.page
  const f = labels.form

  const steps: Step[] = members.length
    ? ['format', 'member', 'when', 'contact']
    : ['format', 'when', 'contact']
  const [current, setCurrent] = useState(0)
  const [format, setFormat] = useState<AppointmentFormat>(initialFormat ?? 'video')
  const [member, setMember] = useState<number | null>(
    initialMember && members.some((m) => m.id === initialMember) ? initialMember : null,
  )
  const [showroom, setShowroom] = useState(showrooms[0]?.name ?? '')
  const today = useMemo(() => new Date(), [])
  const [month, setMonth] = useState(() => {
    // Premier mois avec un jour réservable (demain peut tomber le mois suivant).
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    return new Date(start.getFullYear(), start.getMonth(), 1)
  })
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [period, setPeriod] = useState('')
  const [stepError, setStepError] = useState<string | null>(null)

  const err = (name: string) => {
    const key = state.errors?.[name]
    return key ? f.errors[key] : null
  }

  const dateFormat = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const dateFormatLong = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const shortFormat = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  const monthFormat = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })
  const parse = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  const whenDone = format === 'factory' ? period.trim().length > 0 : Boolean(date && time)
  const done: Record<Step, boolean> = { format: true, member: true, when: whenDone, contact: false }
  const firstOpen = steps.findIndex((s) => !done[s])
  const open = firstOpen < 0 ? steps.length - 1 : firstOpen

  // Sur mobile, une erreur de créneau renvoyée par le serveur ramène à l'étape « Quand ».
  const active = state.errors?.slot && !whenDone ? steps.indexOf('when') : current
  const memberName = members.find((m) => m.id === member)?.name ?? t.firstAvailable
  const formatLabel = `${t.formats[format].label} · ${t.formats[format].duration}`

  // Grille du mois : lundi en premier.
  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1)
    const offset = (first.getDay() + 6) % 7
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from(
        { length: count },
        (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1),
      ),
    ]
  }, [month])
  const canPrev = month > new Date(today.getFullYear(), today.getMonth(), 1)
  const canNext = month < new Date(today.getFullYear(), today.getMonth() + 2, 1)
  const slots = slotsFor(format)

  const next = () => {
    const step = steps[active]
    if (step === 'when' && !whenDone) {
      setStepError(format === 'factory' ? f.errors.required : f.errors.slot)
      return
    }
    setStepError(null)
    setCurrent(Math.min(active + 1, steps.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (state.status === 'success') {
    return (
      <div className="form-success" role="status">
        <span className="h2">{t.successTitle}</span>
        <dl className="recap">
          <div className="kv">
            <span>{t.recapFormat}</span>
            <span>{formatLabel}</span>
          </div>
          {format === 'factory' ? (
            <div className="kv">
              <span>{t.recapPeriod}</span>
              <span>{period}</span>
            </div>
          ) : date && time ? (
            <div className="kv">
              <span>{t.recapDate}</span>
              <span>
                {cap(dateFormatLong.format(parse(date)))} · {fill(t.timeAt, { time })}
              </span>
            </div>
          ) : null}
        </dl>
        <p className="body mute">{t.successText}</p>
        <Link className="pise-btn pise-btn--outline" href={homeHref}>
          {t.home}
        </Link>
      </div>
    )
  }

  const stepClass = (step: Step) => {
    const index = steps.indexOf(step)
    return `rdv-step${index === active ? ' is-current' : ''}`
  }

  const summaryRow = (step: Step, label: string, value: string) => {
    const index = steps.indexOf(step)
    if (index < 0 || index >= active) return null
    return (
      <div key={step} className="rdv-done">
        <div className="rdv-done__text">
          <span className="pise-eyebrow eyebrow-mute">{label}</span>
          <span className="body">{value}</span>
        </div>
        <button
          type="button"
          className="pise-textlink rdv-done__edit"
          onClick={() => setCurrent(index)}
        >
          {t.edit}
        </button>
      </div>
    )
  }

  const whenValue =
    format === 'factory'
      ? period || t.toChoose
      : date && time
        ? `${cap(shortFormat.format(parse(date)))} · ${time}`
        : t.toChoose

  return (
    <form
      className="rdv"
      noValidate
      onSubmit={(e) => {
        // Envoi sans remise à zéro automatique des champs (React le ferait avec action=…).
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(() => action(data))
      }}
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="format" value={format} />
      <input type="hidden" name="member" value={member ?? ''} />
      <input type="hidden" name="date" value={format === 'factory' ? '' : (date ?? '')} />
      <input type="hidden" name="time" value={format === 'factory' ? '' : (time ?? '')} />
      <input type="hidden" name="period" value={format === 'factory' ? period : ''} />
      {format === 'showroom' && showroom ? (
        <input type="hidden" name="showroom" value={showroom} />
      ) : null}
      {hidden.fabricant ? <input type="hidden" name="fabricant" value={hidden.fabricant} /> : null}
      {hidden.visite ? <input type="hidden" name="visite" value={hidden.visite} /> : null}
      {hidden.produit ? <input type="hidden" name="produit" value={hidden.produit} /> : null}
      <Honeypot id={id} />

      <div className="rdv__main">
        <ol className="steps" aria-label={t.recap}>
          {steps.map((step, i) => (
            <li
              key={step}
              data-state={i < open ? 'done' : undefined}
              aria-current={i === open ? 'step' : undefined}
            >
              <b>{String(i + 1).padStart(2, '0')}</b>
              {t.steps[step]}
            </li>
          ))}
        </ol>

        <div className="rdv__progress">
          <span className="pise-eyebrow">
            {fill(t.stepOf, {
              n: active + 1,
              total: steps.length,
              label: t.steps[steps[active]],
            })}
          </span>
          <span className="rdv__bar-track" aria-hidden="true">
            <span style={{ width: `${((active + 1) / steps.length) * 100}%` }} />
          </span>
        </div>

        {context ? <p className="form-context">{context}</p> : null}

        <div className="rdv-summary">
          {summaryRow('format', t.recapFormat, formatLabel)}
          {summaryRow('member', t.recapWith, memberName)}
          {summaryRow('when', format === 'factory' ? t.recapPeriod : t.recapDate, whenValue)}
        </div>

        <fieldset className={stepClass('format')}>
          <legend className="h2">{t.formatTitle}</legend>
          <div className="opts opts--2">
            {FORMATS.map((value) => (
              <button
                key={value}
                type="button"
                className="opt"
                aria-pressed={format === value}
                onClick={() => {
                  setFormat(value)
                  setTime(null)
                }}
              >
                <span className="opt__tick" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M2 6.5l2.5 2.5L10 3.5" fill="none" stroke="#fff" strokeWidth="1.6" />
                  </svg>
                </span>
                <span className="pise-eyebrow eyebrow-ocean">{t.formats[value].duration}</span>
                <span className="h3">{t.formats[value].label}</span>
                <span className="body mute">{t.formats[value].text}</span>
              </button>
            ))}
          </div>
          {format === 'showroom' && showrooms.length > 1 ? (
            <Field id={`${id}-sr`} label={t.showroom} className="rdv-showroom">
              <select
                id={`${id}-sr`}
                className="pise-input is-select"
                value={showroom}
                onChange={(e) => setShowroom(e.target.value)}
              >
                {showrooms.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}
        </fieldset>

        {members.length ? (
          <fieldset className={stepClass('member')}>
            <legend className="h2">{t.memberTitle}</legend>
            <div className="opts opts--3">
              <button
                type="button"
                className="opt opt--person"
                aria-pressed={member === null}
                onClick={() => setMember(null)}
              >
                <span className="opt__tick" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M2 6.5l2.5 2.5L10 3.5" fill="none" stroke="#fff" strokeWidth="1.6" />
                  </svg>
                </span>
                <span className="opt__avatar opt__avatar--pise">PISE</span>
                <span className="h3">{t.firstAvailable}</span>
                <span className="cap">{t.moreSlots}</span>
              </button>
              {members.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="opt opt--person"
                  aria-pressed={member === m.id}
                  onClick={() => setMember(m.id)}
                >
                  <span className="opt__tick" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <path d="M2 6.5l2.5 2.5L10 3.5" fill="none" stroke="#fff" strokeWidth="1.6" />
                    </svg>
                  </span>
                  <span className="opt__avatar">
                    <Img media={m.photo} sizes="56px" alt="" />
                  </span>
                  <span className="h3">{m.name}</span>
                  {m.caption ? <span className="cap">{m.caption}</span> : null}
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        <fieldset className={stepClass('when')}>
          <legend className="h2">{t.whenTitle}</legend>
          {format === 'factory' ? (
            <Field id={`${id}-pe`} label={t.periodLabel}>
              <textarea
                id={`${id}-pe`}
                className="area"
                rows={3}
                value={period}
                placeholder={t.periodPlaceholder}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </Field>
          ) : (
            <div className="when">
              <div className="when__cal">
                <div className="when__head">
                  <span className="h3">{cap(monthFormat.format(month))}</span>
                  <div className="when__nav">
                    <button
                      type="button"
                      className="pise-chip when__arrow"
                      aria-label={t.previousMonth}
                      disabled={!canPrev}
                      onClick={() =>
                        setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
                      }
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="pise-chip when__arrow"
                      aria-label={t.nextMonth}
                      disabled={!canNext}
                      onClick={() =>
                        setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
                      }
                    >
                      ›
                    </button>
                  </div>
                </div>
                <div className="cal" role="group" aria-label={cap(monthFormat.format(month))}>
                  {t.weekdays.map((d) => (
                    <span key={d} className="cal__h" aria-hidden="true">
                      {d}
                    </span>
                  ))}
                  {days.map((day, i) =>
                    day ? (
                      <button
                        key={i}
                        type="button"
                        className={`day${isBookableDay(day, today) ? ' has' : ''}`}
                        disabled={!isBookableDay(day, today)}
                        aria-pressed={date === isoDate(day)}
                        aria-label={cap(dateFormat.format(day))}
                        onClick={() => {
                          setDate(isoDate(day))
                          setTime(null)
                          setStepError(null)
                        }}
                      >
                        {day.getDate()}
                      </button>
                    ) : (
                      <span key={i} />
                    ),
                  )}
                </div>
              </div>
              <div className="when__slots">
                {date ? (
                  <>
                    <div className="when__day">
                      <span className="h3">{cap(dateFormat.format(parse(date)))}</span>
                      <span className="cap">
                        {t.parisTime}
                        {t.formats[format].duration ? ` · ${t.formats[format].duration}` : ''}
                      </span>
                    </div>
                    {(['morning', 'afternoon'] as const).map((part) => (
                      <div key={part} className="when__part">
                        <span className="pise-eyebrow eyebrow-mute">{t[part]}</span>
                        <div className="slots">
                          {slots[part].map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              className="slot"
                              aria-pressed={time === slot}
                              onClick={() => {
                                setTime(slot)
                                setStepError(null)
                              }}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="body mute when__empty">{t.pickDay}</p>
                )}
              </div>
            </div>
          )}
          <FieldError message={stepError ?? err('slot')} />
        </fieldset>

        <fieldset className={stepClass('contact')}>
          <legend className="h2">{t.contactTitle}</legend>
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
                placeholder={f.companyPlaceholder}
                autoComplete="organization"
              />
            </Field>
            <Field id={`${id}-pr`} label={f.profile}>
              <select
                id={`${id}-pr`}
                name="profile"
                className="pise-input is-select"
                defaultValue="architect"
              >
                {Object.entries(f.profiles).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
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
          </div>
          <Field id={`${id}-ms`} label={t.projectLabel}>
            <textarea
              id={`${id}-ms`}
              name="message"
              className="area"
              rows={4}
              placeholder={t.projectPlaceholder}
            />
          </Field>
          <div className="form-checks">
            <label className="check">
              <input type="checkbox" name="consent" required />
              <span>
                {t.consent}{' '}
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
          <button type="submit" className="pise-btn rdv__submit" disabled={pending}>
            {pending ? f.sending : t.confirm}
          </button>
        </fieldset>
      </div>

      <aside className="rdv__aside" aria-label={t.recap}>
        <div className="panel">
          <span className="h3">{t.recap}</span>
          <div>
            <div className="kv">
              <span>{t.recapFormat}</span>
              <span>{formatLabel}</span>
            </div>
            {members.length ? (
              <div className="kv">
                <span>{t.recapWith}</span>
                <span>{memberName}</span>
              </div>
            ) : null}
            {format === 'factory' ? (
              <div className="kv kv--last">
                <span>{t.recapPeriod}</span>
                <span>{period || t.toChoose}</span>
              </div>
            ) : (
              <>
                <div className="kv">
                  <span>{t.recapDate}</span>
                  <span>{date ? cap(dateFormatLong.format(parse(date))) : t.toChoose}</span>
                </div>
                <div className="kv kv--last">
                  <span>{t.recapTime}</span>
                  <span>{time ? fill(t.timeAt, { time }) : t.toChoose}</span>
                </div>
              </>
            )}
          </div>
          <button type="submit" className="pise-btn" disabled={pending}>
            {pending ? f.sending : t.confirmShort}
          </button>
          <p className="cap">{t.confirmNote}</p>
        </div>
      </aside>

      <div className="rdv__bar">
        <div className="rdv__bar-text">
          <span className="body">{whenValue}</span>
          <span className="cap">{formatLabel}</span>
        </div>
        {active > 0 ? (
          <button
            type="button"
            className="pise-btn pise-btn--outline rdv__back"
            onClick={() => setCurrent(active - 1)}
          >
            {t.back}
          </button>
        ) : null}
        {active < steps.length - 1 ? (
          <button
            key="continue"
            type="button"
            className="pise-btn"
            onClick={(e) => {
              // Le bouton suivant (« Confirmer ») ne doit pas recevoir ce clic.
              e.preventDefault()
              next()
            }}
          >
            {t.continue}
          </button>
        ) : (
          <button key="confirm" type="submit" className="pise-btn" disabled={pending}>
            {pending ? f.sending : t.confirmShort}
          </button>
        )}
      </div>
    </form>
  )
}
