# Agence PISE — site et back-office

Site de l'Agence PISE et son back-office, dans un seul projet :

- **Next.js** (App Router) pour le site public ;
- **Payload CMS 3** pour le back-office (`/admin`) et l'API (`/api`) ;
- **Postgres** : Neon en préversion et en production, Postgres local en développement ;
- **Vercel Blob** pour les médias ;
- déploiement sur **Vercel**, avec une préversion par branche.

Langues des contenus : français (par défaut), anglais, italien. L'interface d'administration est en français.

## Démarrer en local

Prérequis : Node.js 20.18 ou plus, pnpm, et une base Postgres.

```bash
# 1. Base de données (au choix)
docker compose up -d          # Postgres + pgvector dans Docker
# ou un Postgres déjà installé, avec une base « pise »

# 2. Variables d'environnement
cp .env.example .env          # puis renseigner PAYLOAD_SECRET (chaîne aléatoire)

# 3. Dépendances et lancement
pnpm install
pnpm dev
```

Le site s'ouvre sur http://localhost:3000 et le back-office sur http://localhost:3000/admin. Au premier accès, Payload demande de créer le premier compte administrateur.

En local, le schéma de la base suit automatiquement le code. Sans `BLOB_READ_WRITE_TOKEN`, les médias sont stockés sur le disque.

## Modèle de contenu

| Groupe | Collections |
|---|---|
| Catalogue | Fabricants (`brands`), Collections (`ranges`), Produits (`products`), Catégories de produits, Secteurs |
| Contenus | Réalisations, Visites virtuelles, Salons, Actualités, Pages (blocs), Questions fréquentes, Annonces, Équipe, Showrooms |
| Médias | Médiathèque, Documents (niveau d'accès public, pro ou interne) |
| Relation client | Demandes (`leads`), Comptes pro (`customers`, authentification séparée) |
| Système | Utilisateurs, Redirections, Index de recherche |

Réglages globaux : Accueil (mosaïque et sections), Navigation, Pied de page, Réglages généraux, Intégrations.

Rôles des utilisateurs : administrateur, éditeur, commercial et assistant IA. Le compte IA ne peut écrire que des brouillons (`src/hooks/aiDraftsOnly.ts`) : la version publiée reste en ligne jusqu'à ce qu'un humain publie. Les règles sont vérifiées par `tests/int/model.int.spec.ts`.

## Faire évoluer le modèle de contenu

Les collections sont décrites dans `src/collections`. Après toute modification de structure :

```bash
pnpm generate:types               # met à jour src/payload-types.ts
pnpm migrate:create nom-du-changement
```

La migration générée dans `src/migrations` est à committer avec le code. Sur Vercel, `pnpm run build:vercel` applique les migrations avant chaque build : la base de chaque environnement évolue uniquement par migrations.

## Scripts utiles

| Commande | Rôle |
|---|---|
| `pnpm dev` | Serveur de développement |
| `pnpm build` / `pnpm start` | Build et serveur de production |
| `pnpm migrate` | Applique les migrations en attente |
| `pnpm migrate:create <nom>` | Crée une migration à partir des changements de schéma |
| `pnpm generate:types` | Régénère les types TypeScript des contenus |
| `pnpm generate:importmap` | Régénère la carte des composants de l'admin (après ajout d'un plugin) |
| `pnpm lint` | Vérifie le code |
| `pnpm test` | Tests d'intégration et de bout en bout |

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Connexion Postgres (injectée par l'intégration Neon sur Vercel) |
| `PAYLOAD_SECRET` | Secret de chiffrement de Payload, différent par environnement |
| `NEXT_PUBLIC_SERVER_URL` | Adresse publique du site, sans barre finale : vide sur les préversions, renseignée en production une fois le domaine branché |
| `BLOB_READ_WRITE_TOKEN` | Jeton Vercel Blob (injecté par Vercel), vide en local |
| `SITE_INDEXABLE` | `true` en production le jour de la bascule du domaine : lève le `noindex` (jamais actif sur les préversions) |

## Organisation du code

```
src/
  app/(frontend)/[locale]/  site public, une route par gabarit (accueil, fabricants…)
  app/(frontend)/styles.css feuille de style (jetons et composants du design system)
  app/(payload)/            back-office et API Payload (fichiers générés, à ne pas modifier)
  components/               en-tête, pied de page, cartes, mosaïque, formulaires
  lib/                      lecture des contenus (payload.ts), adresses (links.ts), SEO
  i18n/                     langues, rubriques traduites, libellés de l'interface
  proxy.ts                  langue dans l'URL
  collections/, globals/    modèle de contenu
  seed/                     contenus de départ (fabricants, accueil, menus)
  migrations/               migrations de la base
  payload.config.ts         configuration de Payload
public/brand/               logos
```

### Langues et adresses

Le français est servi sans préfixe (`/fabricants/nardi`), l'anglais et l'italien sous `/en` et `/it`
avec des rubriques traduites (`/en/brands/nardi`, `/it/marchi/nardi`), déclarées dans `src/i18n/config.ts`.

Chaque rubrique a **un dossier par langue** : le dossier français contient la page, les dossiers anglais
et italien la reprennent en une ligne (`export { default, generateMetadata } from '../fabricants/page'`).
Le proxy n'ajoute que la langue et redirige une rubrique saisie dans la mauvaise langue. Un test vérifie
qu'aucun dossier ne manque.

Dans le back-office, un lien vers une rubrique se saisit en français (`/rendez-vous`) : il est traduit
automatiquement selon la langue de la page.

Le site n'est pas encore lancé : toutes les pages portent `noindex` jusqu'à la bascule du domaine agencepise.fr.
