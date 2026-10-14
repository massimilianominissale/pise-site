import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AccessRequestForm, LoginPanel, PasswordForm } from '@/components/pro/ProForms'
import { asMedia, Img } from '@/components/ui/Img'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { type Dictionary, getDictionary } from '@/i18n/dictionary'
import { logoutCustomer } from '@/lib/actions/pro'
import { getCustomer, type SessionCustomer } from '@/lib/auth'
import { formatFile, namesOf } from '@/lib/format'
import { getPrivacyHref } from '@/lib/legal'
import { getBrands, getGlobal, getIntegrations, getPayloadClient } from '@/lib/payload'
import { alternates } from '@/lib/seo'
import type { Document, TeamMember } from '@/payload-types'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  const listings = await getGlobal('listings', locale)
  return {
    title: listings.pro?.title || dict.pro,
    description: listings.pro?.lead || dict.proPage.title,
    alternates: alternates(locale, '/pro'),
    // Espace réservé : ni indexé ni mis en cache partagé.
    robots: { index: false, follow: false },
  }
}

export default async function ProPage({ params }: Props) {
  const { locale: param } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const customer = await getCustomer()
  return customer ? (
    <Dashboard customer={customer} locale={locale} dict={dict} />
  ) : (
    <Welcome locale={locale} dict={dict} />
  )
}

/** Visiteur : connexion et demande d'accès. */
async function Welcome({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.proPage
  const [listings, brands, privacy] = await Promise.all([
    getGlobal('listings', locale),
    getBrands(locale),
    getPrivacyHref(locale),
  ])
  const image = asMedia(listings.pro?.image) ?? asMedia(brands[0]?.heroImage)

  return (
    <>
      <section className="pro-hero">
        <div className="pro-hero__visual">
          <Img media={image} sizes="(min-width: 1100px) 50vw, 100vw" priority />
          <span className="pro-hero__scrim" />
          <div className="pro-hero__text">
            <span className="pise-eyebrow">{t.eyebrow}</span>
            <h1 className="pro-hero__title">{listings.pro?.title || t.title}</h1>
            <ul className="pro-hero__perks">
              {t.perks.map((perk) => (
                <li key={perk} className="body">
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pro-hero__panel">
          <LoginPanel
            locale={locale}
            labels={{
              login: t.login,
              request: t.request,
              welcomeBack: t.welcomeBack,
              loginLead: listings.pro?.lead || t.loginLead,
              email: dict.form.email,
              emailPlaceholder: dict.form.emailPlaceholder,
              password: t.password,
              forgot: t.forgot,
              noAccount: t.noAccount,
              noAccountLink: t.noAccountLink,
              noAccountEnd: t.noAccountEnd,
              resetTitle: t.resetTitle,
              resetLead: t.resetLead,
              resetSend: t.resetSend,
              backToLogin: t.backToLogin,
              sending: dict.form.sending,
              messages: t.messages,
              required: dict.form.errors.required,
              invalidEmail: dict.form.errors.email,
            }}
          />
        </div>
      </section>

      <section id="acces" className="band band--stone">
        <div className="container pro-access">
          <div className="pro-access__intro">
            <span className="pise-eyebrow eyebrow-mute">{t.requestEyebrow}</span>
            <h2 className="sec-title">{t.requestTitle}</h2>
            <p className="body mute">{t.requestLead}</p>
            <ol className="steps-list">
              {t.requestSteps.map((step, i) => (
                <li key={step} className="step">
                  <span className="step__n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="body">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <AccessRequestForm
            locale={locale}
            privacyHref={privacy}
            labels={{
              company: t.company,
              companyPlaceholder: t.companyPlaceholder,
              siret: t.siret,
              siretPlaceholder: t.siretPlaceholder,
              activity: t.activity,
              activities: {
                architect: dict.form.profiles.architect,
                hospitality: dict.form.profiles.hospitality,
                company: dict.form.profiles.company,
                reseller: dict.form.profiles.reseller,
              },
              website: t.website,
              websitePlaceholder: t.websitePlaceholder,
              firstName: dict.form.firstName,
              lastName: dict.form.lastName,
              jobTitle: t.jobTitle,
              jobTitlePlaceholder: t.jobTitlePlaceholder,
              proEmail: t.proEmail,
              emailPlaceholder: dict.form.emailPlaceholder,
              phone: dict.form.phone,
              phonePlaceholder: dict.form.phonePlaceholder,
              choosePassword: t.choosePassword,
              kbis: t.kbis,
              kbisHint: t.kbisHint,
              kbisNote: t.kbisNote,
              browse: dict.contactPage.browse,
              remove: dict.contactPage.remove,
              consent: t.requestConsent,
              privacy: dict.form.privacy,
              send: t.send,
              sending: dict.form.sending,
              doneTitle: t.requestDoneTitle,
              doneText: t.requestDoneText,
              messages: t.messages,
              errors: {
                required: dict.form.errors.required,
                email: dict.form.errors.email,
                siret: t.fieldErrors.siret,
                password: t.fieldErrors.password,
                file: t.fieldErrors.file,
                fileSize: dict.form.errors.fileSize,
              },
            }}
          />
        </div>
      </section>
    </>
  )
}

const PRICE_KINDS = ['pricelist', 'terms'] as const

/** Compte pro validé : conditions, tarifs, documents, demandes, référent, compte. */
async function Dashboard({
  customer,
  locale,
  dict,
}: {
  customer: SessionCustomer
  locale: Locale
  dict: Dictionary
}) {
  const t = dict.proPage
  const payload = await getPayloadClient()
  const [account, documents, leads, integrations] = await Promise.all([
    payload.findByID({ collection: 'customers', id: customer.id, depth: 1, overrideAccess: true }),
    // Lecture avec les droits du client : documents publics et pro uniquement.
    payload.find({
      collection: 'documents',
      locale,
      depth: 1,
      limit: 200,
      sort: 'title',
      overrideAccess: false,
      user: customer,
      populate: { brands: { name: true } },
    }),
    payload.find({
      collection: 'leads',
      depth: 1,
      limit: 10,
      sort: '-createdAt',
      where: {
        and: [{ email: { equals: customer.email } }, { kind: { not_equals: 'newsletter' } }],
      },
      populate: { brands: { name: true } },
    }),
    getIntegrations(),
  ])
  const referent =
    account.referent && typeof account.referent === 'object'
      ? (account.referent as TeamMember)
      : null
  const pro = documents.docs.filter((d) => d.access === 'pro')
  const prices = pro.filter((d) => (PRICE_KINDS as readonly string[]).includes(d.kind ?? ''))
  const reserved = pro.filter((d) => !(PRICE_KINDS as readonly string[]).includes(d.kind ?? ''))
  const dateFormat = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const sinceYear = new Date(account.createdAt).getFullYear()
  const activity = account.activity ? dict.form.profiles[account.activity] : null
  const appointment = `${localizedPath(locale, 'appointment')}?${new URLSearchParams(
    referent ? { conseiller: String(referent.id) } : {},
  )}`

  const docRow = (doc: Document) => {
    const ext = (doc.filename?.split('.').pop() ?? 'pdf').toUpperCase().slice(0, 4)
    const brand = doc.brand && typeof doc.brand === 'object' ? doc.brand.name : null
    return (
      <li key={doc.id}>
        <a className="doc-row" href={doc.url ?? '#'} download>
          <span className="doc-ic" aria-hidden="true">
            {ext}
          </span>
          <span className="doc-row__name">
            {doc.title}
            {brand ? <span className="cap doc-row__brand"> · {brand}</span> : null}
          </span>
          <span className="cap">{formatFile(locale, doc.mimeType, doc.filesize)}</span>
        </a>
      </li>
    )
  }

  return (
    <section className="container pro-dash">
      <nav className="side pro-dash__nav" aria-label={dict.pro}>
        <a href="#conditions">{t.nav.conditions}</a>
        <a href="#tarifs">{t.nav.prices}</a>
        <a href="#documents">{t.nav.documents}</a>
        <a href="#demandes">{t.nav.requests}</a>
        <a href="#referent">{t.nav.referent}</a>
        <a href="#compte">{t.nav.account}</a>
        <form action={logoutCustomer}>
          <input type="hidden" name="locale" value={locale} />
          <button type="submit" className="side__logout">
            {t.nav.logout}
          </button>
        </form>
      </nav>

      <div className="pro-dash__main">
        <header className="pro-dash__head">
          <div className="pro-dash__hello">
            <span className="pill pill--ok">{t.validated}</span>
            <h1 className="page-title page-title--md">{t.hello(account.firstName)}</h1>
            <span className="body mute">
              {[account.company, activity, t.clientSince(sinceYear)].filter(Boolean).join(' · ')}
            </span>
          </div>
          <Link
            className="pise-btn pise-btn--outline"
            href={`${localizedPath(locale, 'contact')}?demande=devis`}
          >
            {t.newQuote}
          </Link>
        </header>

        <section id="conditions" className="pro-dash__section">
          <div className="pro-dash__title">
            <h2 className="h2">{t.conditionsTitle}</h2>
            {integrations.zohoEnabled ? (
              <span className="pill pill--live">{t.conditionsLive}</span>
            ) : null}
          </div>
          <div className="panel pro-dash__pending">
            <p className="body">{t.conditionsPending}</p>
            <Link className="pise-textlink" href={appointment}>
              {dict.takeAppointment}
            </Link>
          </div>
        </section>

        <div className="pro-dash__docs">
          <section id="tarifs" className="pro-dash__section">
            <h2 className="h3">{t.pricesTitle}</h2>
            {prices.length ? (
              <ul className="doc-list">{prices.map(docRow)}</ul>
            ) : (
              <p className="body mute">{t.noDocuments}</p>
            )}
          </section>
          <section id="documents" className="pro-dash__section">
            <h2 className="h3">{t.documentsTitle}</h2>
            {reserved.length ? (
              <ul className="doc-list">{reserved.map(docRow)}</ul>
            ) : (
              <p className="body mute">{t.noDocuments}</p>
            )}
          </section>
        </div>

        <section id="demandes" className="pro-dash__section">
          <h2 className="h3">{t.requestsTitle}</h2>
          {leads.docs.length ? (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th scope="col">{t.table.date}</th>
                    <th scope="col">{t.table.request}</th>
                    <th scope="col">{t.table.brands}</th>
                    <th scope="col">{t.table.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.docs.map((lead) => (
                    <tr key={lead.id}>
                      <td>{dateFormat.format(new Date(lead.createdAt))}</td>
                      <td>{t.leadKinds[lead.kind]}</td>
                      <td>{namesOf(lead.project?.brands).join(', ') || '—'}</td>
                      <td>
                        <span
                          className={`pill ${lead.status === 'quoted' ? 'pill--ok' : lead.status === 'closed' ? 'pill--line' : 'pill--live'}`}
                        >
                          {t.leadStatus[lead.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="body mute">{t.noRequests}</p>
          )}
        </section>

        <section id="referent" className="pro-dash__referent">
          {referent && asMedia(referent.photo) ? (
            <span className="pro-dash__avatar">
              <Img media={referent.photo} sizes="72px" />
            </span>
          ) : null}
          <div className="pro-dash__referent-text">
            <span className="pise-eyebrow on-ink-mute">{t.referentTitle}</span>
            <span className="h3">{referent ? referent.name : t.noReferent}</span>
            {referent ? (
              <span className="cap on-ink-mute">
                {[referent.phone, referent.email].filter(Boolean).join(' · ')}
              </span>
            ) : null}
          </div>
          <Link className="pise-btn pise-btn--light" href={appointment}>
            {dict.takeAppointment}
          </Link>
        </section>

        <section id="compte" className="pro-dash__section pro-dash__account">
          <h2 className="h3">{t.accountTitle}</h2>
          <dl className="pro-dash__kv">
            {[
              [t.company, account.company],
              [t.siret, account.siret],
              [dict.form.email, account.email],
              [dict.form.phone, account.phone],
            ]
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <div key={label} className="kv">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
          </dl>
          <PasswordForm
            labels={{
              current: t.currentPassword,
              password: t.newPassword,
              confirm: t.confirmPassword,
              save: t.savePassword,
              sending: dict.form.sending,
              done: t.passwordChanged,
              messages: t.messages,
              weak: t.fieldErrors.password,
            }}
          />
        </section>
      </div>
    </section>
  )
}
