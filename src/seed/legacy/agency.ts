import { a, h2, h3, p, type RichNode, toLexical } from '../rich'
import type { LegacyImage, Locale, T } from './brands'

/**
 * Coordonnées, réseaux sociaux et pages de l'agence repris de l'ancien site :
 * page Contact, pied de page, « Nos valeurs / Nos services », « L'équipe », mentions légales.
 */

export const LEGACY_SETTINGS = {
  legalName: 'PALMA SAS',
  contact: {
    street: '76 rue de la Cigogne',
    postalCode: '45100',
    city: 'Orléans',
    phone: '02 38 42 00 42',
    email: 'contact@agencepise.com',
  },
  socials: [
    { network: 'instagram', url: 'https://www.instagram.com/agencepise/' },
    { network: 'linkedin', url: 'https://www.linkedin.com/company/agence-pise/' },
    { network: 'facebook', url: 'https://www.facebook.com/agencepise' },
    { network: 'youtube', url: 'https://www.youtube.com/@agencepise1210' },
    { network: 'pinterest', url: 'https://www.pinterest.fr/pcprot/agence-pise/' },
  ] as { network: 'instagram' | 'linkedin' | 'facebook' | 'youtube' | 'pinterest'; url: string }[],
}

export const LEGACY_SHOWROOM = {
  name: 'Showroom Paris',
  address: { street: '3 avenue du Maine', postalCode: '75015', city: 'Paris', country: 'France' },
  order: 1,
}

/* ---------- Pages ---------- */

export type Link = { type: 'external'; url: string; label: string; newTab: boolean }
/** Lien vers une rubrique du site (adresse française, traduite à l'affichage). */
export const link = (url: string, label: string): Link => ({
  type: 'external',
  url,
  label,
  newTab: false,
})
/** Lien vers un autre site, ouvert dans un nouvel onglet. */
export const outLink = (url: string, label: string): Link => ({
  type: 'external',
  url,
  label,
  newTab: true,
})

export type LegacyBlock =
  | { blockType: 'hero'; eyebrow?: string; title: string; lead?: string; cta?: Link }
  | { blockType: 'content'; body: ReturnType<typeof toLexical> }
  | {
      blockType: 'mediaText'
      /** Photo importée au moment de créer la page (identifiant commun aux trois langues). */
      image: LegacyImage
      imagePosition: 'left' | 'right'
      title: string
      body: ReturnType<typeof toLexical>
      cta?: Link
    }
  | { blockType: 'cta'; title: string; text?: string; links: { link: Link }[] }
  | { blockType: 'events'; title: string; period: 'upcoming' | 'past' }

/** Photo de l'équipe (maquettes) : page L'équipe et bloc « Parlons de votre projet » de l'accueil. */
export const TEAM_PHOTO: LegacyImage = {
  file: 'pise-equipe.jpg',
  repo: true,
  alt: {
    fr: 'L’équipe de l’Agence PISE autour d’une table de réunion',
    en: 'The Agence PISE team around a meeting table',
    it: 'Il team dell’Agence PISE intorno a un tavolo riunioni',
  },
}

export type LegacyPage = {
  key: string
  parent?: string
  slug: T
  title: T
  /** Même structure dans les trois langues (les blocs sont communs, leurs textes traduits). */
  layout: (locale: Locale) => LegacyBlock[]
}

const content = (nodes: RichNode[]): LegacyBlock => ({
  blockType: 'content',
  body: toLexical(nodes),
})

const pick = <V>(locale: Locale, values: Record<Locale, V>): V => values[locale]

const AGENCY: T = { fr: 'L’agence', en: 'The agency', it: 'L’agenzia' }
const BOOK: T = { fr: 'Prendre rendez-vous', en: 'Book an appointment', it: 'Prendi appuntamento' }

/** Section « Nos valeurs / Nos services » de l'ancien site, sans les passages datés. */
const values: Record<Locale, RichNode[]> = {
  fr: [
    h2('Nos valeurs, nos services'),
    h3('Be Green'),
    p(
      'Nos sociétés partenaires démontrent toutes un engagement fort en faveur de la Responsabilité Sociétale des Entreprises (RSE). Leur souci de l’environnement se reflète par le biais de processus de production durable, de l’utilisation de matériaux recyclés et de l’éco-conception, minimisant ainsi leur empreinte écologique. Ces entreprises valorisent aussi l’aspect social en encourageant l’artisanat local, en améliorant les conditions de travail et en adoptant des pratiques éthiques. Ce choix de marques est en cohérence avec notre volonté de promouvoir une approche respectueuse de l’environnement et socialement responsable dans l’industrie du mobilier et de l’éclairage.',
    ),
    p(
      'Chacune de nos marques partenaires incarne une vision durable, centrée sur l’humain et respectueuse de l’environnement. Elles sont toutes déterminées à aller au-delà des simples discours pour incarner de véritables acteurs du changement dans le secteur du design et de la fabrication.',
    ),
    p(
      'Ensemble, ces entreprises illustrent la cohérence de notre sélection de marques qui se soucient de l’environnement et des aspects sociaux. Leur engagement envers la RSE ne se limite pas aux mots, mais se manifeste à chaque étape de leur processus de production, de la conception à la fabrication et à la distribution. Il est évident que nos partenaires croient fermement en une économie qui est à la fois verte et inclusive, en accord avec notre vision de représentation de marques soucieuses de la RSE.',
    ),
    h3('Be Safe'),
    p(
      'Avec l’Agence PISE, vous êtes tranquille, nous veillons sur vous et sur vos clients. Tout d’abord par la sélection de marques et d’usines que nous avons mise en place. Nous visitons systématiquement nos partenaires et nous assurons que leur système de production est compatible avec nos valeurs et nos engagements. Ensuite, nous privilégions des partenaires capables d’offrir des garanties sérieuses : plusieurs d’entre eux offrent 5 années de garantie. Les productions sont toutes européennes, pas de produits asiatiques chez PISE.',
    ),
    p('Nous avons besoin de vous sentir rassurés lorsque vous prescrivez !'),
    h3('Be Rich'),
    p(
      'Nous sommes tous là pour gagner notre vie, alors essayons ensemble d’offrir les meilleurs produits à nos clients tout en préservant les marges. Nos produits présentent un excellent rapport qualité / service / prix. La fidélité est une valeur chère à nos yeux, c’est pourquoi nous privilégions les partenariats réguliers plutôt que les affaires « one shot ». Vos conditions d’achat s’amélioreront avec le temps et votre fidélité ; ainsi, un nouveau venu ne pourra pas être aussi compétitif qu’un ancien client sur un appel d’offres, par exemple. Nous sommes aussi reconnaissants et savons partager une partie de notre rémunération dans le cas d’apport d’affaires extérieur à notre réseau habituel.',
    ),
    h3('Be Proud'),
    p(
      'Vous pouvez être fier, car vous ne vous êtes pas laissé entraîner par une de ces marques qui dominent le marché. En nous confiant un projet, vous êtes allé chercher la différence et la personnalisation, bravo. Nous ne travaillons pas avec les moutons de Panurge mais avec de fortes personnalités !',
    ),
    h3('Be Lucky'),
    p(
      'Vous-même ou vos clients pouvez être chanceux et bénéficier de conditions tout à fait avantageuses sur certains produits en déstockage. Ils proviennent généralement d’expositions, de shootings ou, plus rarement, d’erreurs de commande. Consultez-nous pour connaître les dernières affaires.',
    ),
    h3('Be You'),
    p(
      'Vous êtes unique, comme vous le savez ! Votre société l’est aussi. Nous vous considérons comme une personne : nos rapports seront personnalisés, comme les produits que vous pourrez concevoir.',
    ),
    h3('Be Happy'),
    p(
      'Nous célébrons ici une chose essentielle pour nous, à l’Agence PISE : votre satisfaction. La joie que vous ressentez, que vous soyez client, architecte ou distributeur, est ce qui alimente notre passion pour ce que nous faisons.',
    ),
    p(
      'Comme client, nous vous promettons de toujours vous fournir des produits de la plus haute qualité. Nous nous efforçons de surpasser vos attentes à chaque interaction. Votre satisfaction est notre victoire, et voir vos visages éclatants de joie avec le produit que vous avez reçu est notre plus grande récompense.',
    ),
    p(
      'Aux distributeurs qui nous font confiance, nous garantissons des délais de livraison respectés et une collaboration sans faille. Notre but est de rendre chaque transaction aussi fluide et efficace que possible, car nous savons combien la ponctualité est précieuse dans votre métier.',
    ),
    p(
      'Aux architectes, nous assurons que notre mobilier viendra compléter et magnifier vos œuvres. Nous avons une profonde admiration pour votre travail et nous nous engageons à créer des pièces qui vont s’harmoniser avec vos designs sans jamais les desservir.',
    ),
    p(
      'Chez l’Agence PISE, nous voulons voir nos clients heureux et souriants. Parce que votre bonheur est le reflet de notre réussite.',
    ),
    h3('Be Together'),
    p(
      'Ce sont les meilleurs moments ! Les moments d’échange et de partage : on se retrouve sur un salon, sur un événement ? ',
      a('Retrouvez ici', '/agence/salons'),
      ' les prochaines dates de nos manifestations. Pour les salons, nous préférons planifier les rencontres avec un rendez-vous.',
    ),
    h3('Bespoke'),
    p(
      'C’est le savoir-faire et le point fort de l’agence. Nos marques n’ont peut-être pas les plus fortes notoriétés, mais avec PISE vous pouvez demander des réalisations spéciales, c’est notre force ! Que ce soit en acier, en HPL, en bois ou en tissu, que ça éclaire, que ce soit confortable ou bien solide, nous saurons vous trouver le ou les partenaires pour réaliser votre projet. Il ne faut pas oublier d’où l’on vient : avec plus de 20 ans à la tête d’une entreprise de production de sièges, la fabrication et la technique, on connaît !',
    ),
    h3('Be Fast'),
    p(
      'Quand ça ne vient pas de l’autre bout du monde, c’est moins polluant et c’est aussi beaucoup plus rapide, surtout quand on fabrique ! Chez PISE, pas de faux fabricants, pas d’import : tout est produit chez nos partenaires, en Europe.',
    ),
    p('Nos délais sont courts et sont respectés !'),
  ],
  en: [
    h2('Our values, our services'),
    h3('Be Green'),
    p(
      'Our partner companies all show a strong commitment to corporate social responsibility (CSR). Their concern for the environment is reflected in sustainable production processes, the use of recycled materials and eco-design, minimising their ecological footprint. They also value the social dimension by supporting local craftsmanship, improving working conditions and adopting ethical practices. This choice of brands is consistent with our wish to promote an environmentally friendly and socially responsible approach in the furniture and lighting industry.',
    ),
    p(
      'Each of our partner brands embodies a sustainable, people-centred and environmentally friendly vision. They are all determined to go beyond words and act as genuine drivers of change in the design and manufacturing sector.',
    ),
    p(
      'Together, these companies illustrate the consistency of our selection of brands that care about the environment and social issues. Their commitment to CSR is not limited to words: it shows at every stage of their production process, from design to manufacturing and distribution. Our partners firmly believe in an economy that is both green and inclusive, in line with our vision of representing CSR-minded brands.',
    ),
    h3('Be Safe'),
    p(
      'With Agence PISE you can rest easy: we look after you and your clients. First, through the selection of brands and factories we have put in place. We systematically visit our partners and make sure their production system is compatible with our values and commitments. Then, we favour partners able to offer serious guarantees — several of them offer a 5-year warranty. All production is European: no Asian products at PISE.',
    ),
    p('We want you to feel confident when you specify!'),
    h3('Be Rich'),
    p(
      'We are all here to make a living, so let’s work together to offer our clients the best products while protecting margins. Our products offer excellent value in terms of quality, service and price. Loyalty is a value we hold dear, which is why we favour regular partnerships over one-off deals. Your purchasing terms will improve over time and with your loyalty, so a newcomer cannot be as competitive as a long-standing client on a tender, for example. We are also grateful, and we share part of our commission when business is brought to us from outside our usual network.',
    ),
    h3('Be Proud'),
    p(
      'You can be proud: you didn’t let yourself be swept along by one of the brands that dominate the market. By entrusting us with a project, you went looking for difference and personalisation — well done. We don’t work with followers, we work with strong personalities!',
    ),
    h3('Be Lucky'),
    p(
      'You or your clients may be in luck and benefit from very attractive terms on certain clearance products. They usually come from exhibitions, photo shoots or, more rarely, ordering errors. Ask us about the latest deals.',
    ),
    h3('Be You'),
    p(
      'You are unique, as you know! So is your company. We see you as a person: our relationship will be tailored, just like the products you will be able to design.',
    ),
    h3('Be Happy'),
    p(
      'Here we celebrate something essential to us at Agence PISE: your satisfaction. The joy you feel, whether you are a client, an architect or a retailer, is what fuels our passion for what we do.',
    ),
    p(
      'To our clients, we promise to always provide products of the highest quality. We strive to exceed your expectations at every interaction. Your satisfaction is our victory, and seeing your faces light up with the product you have received is our greatest reward.',
    ),
    p(
      'To the retailers who trust us, we guarantee on-time deliveries and seamless collaboration. Our aim is to make every transaction as smooth and efficient as possible, because we know how precious punctuality is in your business.',
    ),
    p(
      'To architects, we promise that our furniture will complement and enhance your work. We deeply admire what you do, and we are committed to providing pieces that harmonise with your designs without ever detracting from them.',
    ),
    p(
      'At Agence PISE, we want to see our clients happy and smiling, because your happiness reflects our success.',
    ),
    h3('Be Together'),
    p(
      'These are the best moments! Moments of exchange and sharing: shall we meet at a trade fair or an event? ',
      a('Find the dates', '/en/agency/salons'),
      ' of our upcoming appearances here. At trade fairs, we prefer to schedule meetings by appointment.',
    ),
    h3('Bespoke'),
    p(
      'This is the agency’s know-how and its great strength. Our brands may not be the best known, but with PISE you can ask for special projects — that is our strength! Whether in steel, HPL, wood or fabric, whether it lights up, needs to be comfortable or tough, we will find the right partner or partners to bring your project to life. We haven’t forgotten where we come from: with more than 20 years running a seating manufacturer, we know manufacturing and technique!',
    ),
    h3('Be Fast'),
    p(
      'When it doesn’t come from the other side of the world, it pollutes less and it’s also much faster, especially when things are made to order! At PISE there are no fake manufacturers and no imports: everything is produced by our partners, in Europe.',
    ),
    p('Our lead times are short, and we stick to them!'),
  ],
  it: [
    h2('I nostri valori, i nostri servizi'),
    h3('Be Green'),
    p(
      'Le nostre aziende partner dimostrano tutte un forte impegno a favore della responsabilità sociale d’impresa (RSI). La loro attenzione all’ambiente si riflette in processi produttivi sostenibili, nell’uso di materiali riciclati e nell’eco-progettazione, riducendo al minimo la loro impronta ecologica. Queste aziende valorizzano anche l’aspetto sociale, sostenendo l’artigianato locale, migliorando le condizioni di lavoro e adottando pratiche etiche. Questa scelta di marchi è coerente con la nostra volontà di promuovere un approccio rispettoso dell’ambiente e socialmente responsabile nel settore dell’arredo e dell’illuminazione.',
    ),
    p(
      'Ognuno dei nostri marchi partner incarna una visione sostenibile, incentrata sulla persona e rispettosa dell’ambiente. Sono tutti determinati ad andare oltre le parole per essere veri attori del cambiamento nel settore del design e della produzione.',
    ),
    p(
      'Insieme, queste aziende illustrano la coerenza della nostra selezione di marchi attenti all’ambiente e agli aspetti sociali. Il loro impegno per la RSI non si limita alle parole, ma si manifesta in ogni fase del processo produttivo, dalla progettazione alla fabbricazione e alla distribuzione. I nostri partner credono fermamente in un’economia al tempo stesso verde e inclusiva, in linea con la nostra visione di rappresentare marchi attenti alla RSI.',
    ),
    h3('Be Safe'),
    p(
      'Con l’Agence PISE potete stare tranquilli: ci prendiamo cura di voi e dei vostri clienti. Innanzitutto grazie alla selezione di marchi e stabilimenti che abbiamo messo in atto. Visitiamo sistematicamente i nostri partner e ci assicuriamo che il loro sistema produttivo sia compatibile con i nostri valori e i nostri impegni. Inoltre privilegiamo partner in grado di offrire garanzie serie: diversi di loro offrono 5 anni di garanzia. Tutte le produzioni sono europee, nessun prodotto asiatico da PISE.',
    ),
    p('Vogliamo che vi sentiate sicuri quando prescrivete!'),
    h3('Be Rich'),
    p(
      'Siamo tutti qui per guadagnarci da vivere: cerchiamo quindi insieme di offrire i migliori prodotti ai nostri clienti preservando i margini. I nostri prodotti offrono un ottimo rapporto qualità / servizio / prezzo. La fedeltà è un valore a cui teniamo molto, per questo privilegiamo le collaborazioni regolari rispetto agli affari «one shot». Le vostre condizioni d’acquisto miglioreranno nel tempo e con la vostra fedeltà: un nuovo arrivato non potrà essere competitivo quanto un cliente di lunga data, per esempio in una gara d’appalto. Sappiamo anche essere riconoscenti e condividere una parte della nostra remunerazione in caso di segnalazione di affari esterni alla nostra rete abituale.',
    ),
    h3('Be Proud'),
    p(
      'Potete esserne fieri: non vi siete lasciati trascinare da uno dei marchi che dominano il mercato. Affidandoci un progetto avete cercato la differenza e la personalizzazione, complimenti. Non lavoriamo con chi segue il gregge, ma con personalità forti!',
    ),
    h3('Be Lucky'),
    p(
      'Voi o i vostri clienti potreste essere fortunati e beneficiare di condizioni particolarmente vantaggiose su alcuni prodotti in svendita. Provengono generalmente da esposizioni, servizi fotografici o, più raramente, da errori d’ordine. Contattateci per conoscere le ultime occasioni.',
    ),
    h3('Be You'),
    p(
      'Siete unici, come sapete! E lo è anche la vostra azienda. Vi consideriamo come persone: il nostro rapporto sarà personalizzato, come i prodotti che potrete progettare.',
    ),
    h3('Be Happy'),
    p(
      'Celebriamo qui una cosa essenziale per noi dell’Agence PISE: la vostra soddisfazione. La gioia che provate, che siate clienti, architetti o distributori, è ciò che alimenta la nostra passione per il nostro lavoro.',
    ),
    p(
      'Ai clienti promettiamo di fornire sempre prodotti della massima qualità. Ci impegniamo a superare le vostre aspettative a ogni interazione. La vostra soddisfazione è la nostra vittoria, e vedere i vostri volti illuminarsi di gioia con il prodotto ricevuto è la nostra più grande ricompensa.',
    ),
    p(
      'Ai distributori che ci danno fiducia garantiamo il rispetto dei tempi di consegna e una collaborazione impeccabile. Il nostro obiettivo è rendere ogni transazione il più fluida ed efficiente possibile, perché sappiamo quanto la puntualità sia preziosa nel vostro mestiere.',
    ),
    p(
      'Agli architetti assicuriamo che i nostri arredi completeranno e valorizzeranno le vostre opere. Nutriamo una profonda ammirazione per il vostro lavoro e ci impegniamo a proporre pezzi in armonia con i vostri progetti, senza mai sminuirli.',
    ),
    p(
      'All’Agence PISE vogliamo vedere i nostri clienti felici e sorridenti, perché la vostra felicità è il riflesso del nostro successo.',
    ),
    h3('Be Together'),
    p(
      'Sono i momenti migliori! Momenti di scambio e di condivisione: ci vediamo a una fiera o a un evento? ',
      a('Qui trovate', '/it/agenzia/salons'),
      ' le prossime date delle nostre manifestazioni. In fiera preferiamo organizzare gli incontri su appuntamento.',
    ),
    h3('Bespoke'),
    p(
      'È il savoir-faire e il punto di forza dell’agenzia. I nostri marchi non sono forse i più noti, ma con PISE potete richiedere realizzazioni speciali: è la nostra forza! Che si tratti di acciaio, HPL, legno o tessuto, che debba illuminare, essere confortevole o resistente, sapremo trovare il partner o i partner giusti per realizzare il vostro progetto. Non dimentichiamo da dove veniamo: con oltre 20 anni alla guida di un’azienda produttrice di sedute, la produzione e la tecnica le conosciamo!',
    ),
    h3('Be Fast'),
    p(
      'Quando non arriva dall’altra parte del mondo inquina meno ed è anche molto più rapido, soprattutto quando si produce su misura! Da PISE niente falsi produttori e niente importazioni: tutto è prodotto dai nostri partner, in Europa.',
    ),
    p('I nostri tempi di consegna sono brevi e vengono rispettati!'),
  ],
}

const legal: Record<Locale, RichNode[]> = {
  fr: [
    h3('1. Informations légales'),
    p('Société : PALMA SAS'),
    p('Siège social : 76 rue de la Cigogne, 45100 Orléans'),
    p('Téléphone : 02 38 42 00 42'),
    p('E-mail : contact@agencepise.com'),
    p('SIRET : 881 265 862 00014'),
    h3('2. Directeur de la publication'),
    p('Pierre-Christophe Prot — pcp@agencepise.com'),
    h3('3. Hébergement'),
    p(
      'Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.',
    ),
    h3('4. Propriété intellectuelle'),
    p(
      'Le contenu du site (textes, images, vidéos, etc.) est protégé par le droit de la propriété intellectuelle. Toute reproduction, totale ou partielle, est strictement interdite sans autorisation préalable.',
    ),
    h3('5. Collecte de données personnelles'),
    p(
      'Le site collecte des données personnelles dans le respect de la réglementation en vigueur. Pour en savoir plus sur la collecte et le traitement de vos données, veuillez consulter notre politique de confidentialité.',
    ),
    h3('6. Cookies'),
    p(
      'Le site utilise des cookies. Pour en savoir plus sur l’utilisation des cookies et les options de gestion, veuillez consulter notre politique en matière de cookies.',
    ),
    h3('7. Liens externes'),
    p(
      'Le site peut contenir des liens vers des sites externes. Nous déclinons toute responsabilité quant au contenu de ces sites et aux pratiques de confidentialité qui y sont appliquées.',
    ),
  ],
  en: [
    h3('1. Legal information'),
    p('Company: PALMA SAS'),
    p('Registered office: 76 rue de la Cigogne, 45100 Orléans, France'),
    p('Phone: +33 2 38 42 00 42'),
    p('Email: contact@agencepise.com'),
    p('SIRET: 881 265 862 00014'),
    h3('2. Publication director'),
    p('Pierre-Christophe Prot — pcp@agencepise.com'),
    h3('3. Hosting'),
    p(
      'The site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States.',
    ),
    h3('4. Intellectual property'),
    p(
      'The content of the site (text, images, videos, etc.) is protected by intellectual property law. Any reproduction, in whole or in part, is strictly prohibited without prior authorisation.',
    ),
    h3('5. Collection of personal data'),
    p(
      'The site collects personal data in compliance with the regulations in force. To find out more about how your data is collected and processed, please see our privacy policy.',
    ),
    h3('6. Cookies'),
    p(
      'The site uses cookies. To find out more about how cookies are used and how to manage them, please see our cookie policy.',
    ),
    h3('7. External links'),
    p(
      'The site may contain links to external websites. We accept no responsibility for the content of these sites or for their privacy practices.',
    ),
  ],
  it: [
    h3('1. Informazioni legali'),
    p('Società: PALMA SAS'),
    p('Sede legale: 76 rue de la Cigogne, 45100 Orléans, Francia'),
    p('Telefono: +33 2 38 42 00 42'),
    p('E-mail: contact@agencepise.com'),
    p('SIRET: 881 265 862 00014'),
    h3('2. Direttore della pubblicazione'),
    p('Pierre-Christophe Prot — pcp@agencepise.com'),
    h3('3. Hosting'),
    p(
      'Il sito è ospitato da Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, Stati Uniti.',
    ),
    h3('4. Proprietà intellettuale'),
    p(
      'I contenuti del sito (testi, immagini, video, ecc.) sono protetti dal diritto della proprietà intellettuale. Qualsiasi riproduzione, totale o parziale, è severamente vietata senza autorizzazione preventiva.',
    ),
    h3('5. Raccolta dei dati personali'),
    p(
      'Il sito raccoglie dati personali nel rispetto della normativa vigente. Per saperne di più sulla raccolta e sul trattamento dei vostri dati, consultate la nostra informativa sulla privacy.',
    ),
    h3('6. Cookie'),
    p(
      'Il sito utilizza cookie. Per saperne di più sull’uso dei cookie e sulle opzioni di gestione, consultate la nostra informativa sui cookie.',
    ),
    h3('7. Link esterni'),
    p(
      'Il sito può contenere link a siti esterni. Decliniamo ogni responsabilità per i contenuti di tali siti e per le pratiche in materia di privacy che vi sono applicate.',
    ),
  ],
}

export const LEGACY_PAGES: LegacyPage[] = [
  {
    key: 'agence',
    slug: { fr: 'agence', en: 'agency', it: 'agenzia' },
    title: AGENCY,
    layout: (l) => [
      {
        blockType: 'hero',
        eyebrow: pick(l, { fr: 'Qui sommes-nous', en: 'About us', it: 'Chi siamo' }),
        title: pick(l, {
          fr: 'Votre expert en mobilier et luminaires européens haut de gamme',
          en: 'Your specialist in high-end European furniture and lighting',
          it: 'Il vostro esperto di arredi e illuminazione europei di alta gamma',
        }),
        lead: pick(l, {
          fr: 'Depuis 2013, nous accompagnons architectes, décorateurs et prescripteurs dans leurs projets d’aménagement en proposant une sélection rigoureuse de mobilier design pour l’hôtellerie, les bureaux et les espaces résidentiels.',
          en: 'Since 2013 we have been supporting architects, interior designers and specifiers in their fit-out projects, with a carefully curated selection of design furniture for hospitality, offices and residential spaces.',
          it: 'Dal 2013 affianchiamo architetti, decoratori e prescrittori nei loro progetti di allestimento, proponendo una selezione rigorosa di arredi di design per l’hôtellerie, gli uffici e gli spazi residenziali.',
        }),
      },
      content(
        pick(l, {
          fr: [
            p(
              'Aujourd’hui, notre expertise s’étend particulièrement au mobilier outdoor et aux aménagements sur mesure pour l’hôtellerie et les environnements tertiaires, secteurs dans lesquels nous rencontrons un vif succès.',
            ),
            p(
              'Notre catalogue met à l’honneur des collections responsables et durables : assises, tables, accessoires, luminaires et solutions de rangement modulables, issus des meilleurs fabricants européens.',
            ),
            p(
              'Nous proposons également des services de conseil en sourcing et collaborons avec des designers indépendants et ateliers spécialisés pour répondre à vos projets les plus créatifs.',
            ),
          ],
          en: [
            p(
              'Today our expertise extends in particular to outdoor furniture and bespoke fit-outs for hospitality and office environments — sectors in which we are enjoying great success.',
            ),
            p(
              'Our catalogue showcases responsible, sustainable collections: seating, tables, accessories, lighting and modular storage solutions from the best European manufacturers.',
            ),
            p(
              'We also offer sourcing advice and work with independent designers and specialist workshops to bring your most creative projects to life.',
            ),
          ],
          it: [
            p(
              'Oggi la nostra competenza si estende in particolare agli arredi outdoor e agli allestimenti su misura per l’hôtellerie e gli ambienti terziari, settori in cui riscuotiamo un grande successo.',
            ),
            p(
              'Il nostro catalogo mette in primo piano collezioni responsabili e durevoli: sedute, tavoli, accessori, illuminazione e soluzioni di contenimento modulari, dei migliori produttori europei.',
            ),
            p(
              'Offriamo inoltre consulenza di sourcing e collaboriamo con designer indipendenti e laboratori specializzati per rispondere ai vostri progetti più creativi.',
            ),
          ],
        }),
      ),
      content(values[l]),
      {
        blockType: 'cta',
        title: pick(l, {
          fr: 'Une question, un projet ?',
          en: 'A question, a project?',
          it: 'Una domanda, un progetto?',
        }),
        text: pick(l, {
          fr: 'Laissez-nous vos coordonnées et nous vous recontacterons dans les meilleurs délais.',
          en: 'Leave us your details and we’ll get back to you as soon as possible.',
          it: 'Lasciateci i vostri recapiti e vi ricontatteremo al più presto.',
        }),
        links: [
          { link: link('/rendez-vous', BOOK[l]) },
          {
            link: link(
              '/contact',
              pick(l, { fr: 'Nous contacter', en: 'Contact us', it: 'Contattaci' }),
            ),
          },
        ],
      },
    ],
  },
  {
    key: 'equipe',
    parent: 'agence',
    slug: { fr: 'equipe', en: 'team', it: 'team' },
    title: { fr: 'L’équipe', en: 'Our team', it: 'Il team' },
    layout: (l) => [
      {
        blockType: 'hero',
        eyebrow: AGENCY[l],
        title: pick(l, { fr: 'L’équipe', en: 'Our team', it: 'Il team' }),
        lead: pick(l, {
          fr: 'Notre équipe est constituée de personnes passionnées par le design et par les relations humaines. Nous sommes tous dotés d’une longue expérience dans l’aménagement, le mobilier et le luminaire.',
          en: 'Our team is made up of people with a passion for design and for human relationships. We all have long experience in fit-out, furniture and lighting.',
          it: 'Il nostro team è composto da persone appassionate di design e di relazioni umane. Abbiamo tutti una lunga esperienza nell’allestimento, nell’arredo e nell’illuminazione.',
        }),
      },
      {
        blockType: 'mediaText',
        image: TEAM_PHOTO,
        imagePosition: 'left',
        title: pick(l, {
          fr: 'Le mieux, c’est d’en parler ensemble !',
          en: 'The best thing is to talk it through together!',
          it: 'La cosa migliore è parlarne insieme!',
        }),
        body: toLexical([
          p(
            pick(l, {
              fr: 'Ça tombe bien, nous sommes près de chez vous…',
              en: 'Good news: we’re close to you…',
              it: 'Per fortuna siamo vicini a voi…',
            }),
          ),
        ]),
        cta: link('/rendez-vous', BOOK[l]),
      },
    ],
  },
  {
    key: 'showrooms',
    parent: 'agence',
    slug: { fr: 'showrooms', en: 'showrooms', it: 'showroom' },
    title: { fr: 'Showrooms', en: 'Showrooms', it: 'Showroom' },
    layout: (l) => [
      {
        blockType: 'hero',
        eyebrow: AGENCY[l],
        title: pick(l, { fr: 'Showrooms', en: 'Showrooms', it: 'Showroom' }),
        lead: pick(l, {
          fr: 'Pour voir et essayer les collections, nous vous recevons sur rendez-vous.',
          en: 'To see and try the collections, we welcome you by appointment.',
          it: 'Per vedere e provare le collezioni vi accogliamo su appuntamento.',
        }),
      },
      content(
        pick(l, {
          fr: [
            h3('Paris'),
            p('Showroom : 3 avenue du Maine, 75015 Paris'),
            h3('Orléans'),
            p('Bureaux : 76 rue de la Cigogne, 45100 Orléans'),
            p('Téléphone : 02 38 42 00 42 · contact@agencepise.com'),
          ],
          en: [
            h3('Paris'),
            p('Showroom: 3 avenue du Maine, 75015 Paris'),
            h3('Orléans'),
            p('Offices: 76 rue de la Cigogne, 45100 Orléans'),
            p('Phone: +33 2 38 42 00 42 · contact@agencepise.com'),
          ],
          it: [
            h3('Parigi'),
            p('Showroom: 3 avenue du Maine, 75015 Parigi'),
            h3('Orléans'),
            p('Uffici: 76 rue de la Cigogne, 45100 Orléans'),
            p('Telefono: +33 2 38 42 00 42 · contact@agencepise.com'),
          ],
        }),
      ),
      {
        blockType: 'cta',
        title: pick(l, {
          fr: 'Visiter le showroom',
          en: 'Visit the showroom',
          it: 'Visitare lo showroom',
        }),
        text: pick(l, {
          fr: 'Ou découvrez nos espaces virtuels, accessibles à toute heure.',
          en: 'Or explore our virtual spaces, open around the clock.',
          it: 'Oppure scoprite i nostri spazi virtuali, accessibili a qualsiasi ora.',
        }),
        links: [
          { link: link('/rendez-vous', BOOK[l]) },
          {
            link: link(
              '/espaces-virtuels',
              pick(l, { fr: 'Espaces virtuels', en: 'Virtual spaces', it: 'Spazi virtuali' }),
            ),
          },
        ],
      },
    ],
  },
  {
    key: 'salons',
    parent: 'agence',
    // Toujours « salons » : c'est aussi le segment des fiches de salon (/agence/salons/…).
    slug: { fr: 'salons', en: 'salons', it: 'salons' },
    title: { fr: 'Salons', en: 'Trade fairs', it: 'Fiere' },
    layout: (l) => [
      {
        blockType: 'hero',
        eyebrow: AGENCY[l],
        title: pick(l, {
          fr: 'Salons et événements',
          en: 'Trade fairs and events',
          it: 'Fiere ed eventi',
        }),
        lead: pick(l, {
          fr: 'Ce sont les meilleurs moments : les moments d’échange et de partage. Pour les salons, nous préférons planifier les rencontres avec un rendez-vous.',
          en: 'These are the best moments: moments of exchange and sharing. At trade fairs, we prefer to schedule meetings by appointment.',
          it: 'Sono i momenti migliori: momenti di scambio e di condivisione. In fiera preferiamo organizzare gli incontri su appuntamento.',
        }),
        cta: link('/rendez-vous', BOOK[l]),
      },
      {
        blockType: 'events',
        title: pick(l, { fr: 'À venir', en: 'Upcoming', it: 'Prossimamente' }),
        period: 'upcoming',
      },
      {
        blockType: 'events',
        title: pick(l, { fr: 'Salons passés', en: 'Past fairs', it: 'Fiere passate' }),
        period: 'past',
      },
    ],
  },
  {
    key: 'mentions-legales',
    slug: { fr: 'mentions-legales', en: 'legal-notice', it: 'note-legali' },
    title: { fr: 'Mentions légales', en: 'Legal notice', it: 'Note legali' },
    layout: (l) => [content(legal[l])],
  },
]
