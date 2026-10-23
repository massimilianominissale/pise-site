import * as migration_20261013_114936_initial from './20261013_114936_initial'
import * as migration_20261013_190947_modele_de_contenu from './20261013_190947_modele_de_contenu'
import * as migration_20261013_194519_stockage_blob from './20261013_194519_stockage_blob'
import * as migration_20261013_200000_fabricants_de_depart from './20261013_200000_fabricants_de_depart'
import * as migration_20261013_200939_gabarits_socle from './20261013_200939_gabarits_socle'
import * as migration_20261013_201500_contenus_de_depart from './20261013_201500_contenus_de_depart'
import * as migration_20261014_041333_rubrique_produits from './20261014_041333_rubrique_produits'
import * as migration_20261014_050000_produits_de_depart from './20261014_050000_produits_de_depart'
import * as migration_20261014_171107_liste_de_salons from './20261014_171107_liste_de_salons'
import * as migration_20261014_184812_ouverture_des_visites from './20261014_184812_ouverture_des_visites'
import * as migration_20261014_200000_ancien_site from './20261014_200000_ancien_site'
import * as migration_20261014_210000_imrsivo_et_accueil from './20261014_210000_imrsivo_et_accueil'
import * as migration_20261014_220000_images_originales from './20261014_220000_images_originales'
import * as migration_20261022_200000_mosaique_johanson from './20261022_200000_mosaique_johanson'
import * as migration_20261022_210000_mosaique_johanson_showroom from './20261022_210000_mosaique_johanson_showroom'
import * as migration_20261022_195000_marques_by from './20261022_195000_marques_by'
import * as migration_20261022_220000_notre_selection from './20261022_220000_notre_selection'

export const migrations = [
  {
    up: migration_20261013_114936_initial.up,
    down: migration_20261013_114936_initial.down,
    name: '20261013_114936_initial',
  },
  {
    up: migration_20261013_190947_modele_de_contenu.up,
    down: migration_20261013_190947_modele_de_contenu.down,
    name: '20261013_190947_modele_de_contenu',
  },
  {
    up: migration_20261013_194519_stockage_blob.up,
    down: migration_20261013_194519_stockage_blob.down,
    name: '20261013_194519_stockage_blob',
  },
  {
    up: migration_20261013_200000_fabricants_de_depart.up,
    down: migration_20261013_200000_fabricants_de_depart.down,
    name: '20261013_200000_fabricants_de_depart',
  },
  {
    up: migration_20261013_200939_gabarits_socle.up,
    down: migration_20261013_200939_gabarits_socle.down,
    name: '20261013_200939_gabarits_socle',
  },
  {
    up: migration_20261013_201500_contenus_de_depart.up,
    down: migration_20261013_201500_contenus_de_depart.down,
    name: '20261013_201500_contenus_de_depart',
  },
  {
    up: migration_20261014_041333_rubrique_produits.up,
    down: migration_20261014_041333_rubrique_produits.down,
    name: '20261014_041333_rubrique_produits',
  },
  {
    up: migration_20261014_050000_produits_de_depart.up,
    down: migration_20261014_050000_produits_de_depart.down,
    name: '20261014_050000_produits_de_depart',
  },
  {
    up: migration_20261014_171107_liste_de_salons.up,
    down: migration_20261014_171107_liste_de_salons.down,
    name: '20261014_171107_liste_de_salons',
  },
  {
    up: migration_20261014_184812_ouverture_des_visites.up,
    down: migration_20261014_184812_ouverture_des_visites.down,
    name: '20261014_184812_ouverture_des_visites',
  },
  {
    up: migration_20261014_200000_ancien_site.up,
    down: migration_20261014_200000_ancien_site.down,
    name: '20261014_200000_ancien_site',
  },
  {
    up: migration_20261014_210000_imrsivo_et_accueil.up,
    down: migration_20261014_210000_imrsivo_et_accueil.down,
    name: '20261014_210000_imrsivo_et_accueil',
  },
  {
    up: migration_20261014_220000_images_originales.up,
    down: migration_20261014_220000_images_originales.down,
    name: '20261014_220000_images_originales',
  },
  // Schéma avant les migrations de données qui lisent les fabricants (elles utilisent la
  // configuration actuelle, qui contient déjà le champ « parent »).
  {
    up: migration_20261022_195000_marques_by.up,
    down: migration_20261022_195000_marques_by.down,
    name: '20261022_195000_marques_by',
  },
  {
    up: migration_20261022_200000_mosaique_johanson.up,
    down: migration_20261022_200000_mosaique_johanson.down,
    name: '20261022_200000_mosaique_johanson',
  },
  {
    up: migration_20261022_210000_mosaique_johanson_showroom.up,
    down: migration_20261022_210000_mosaique_johanson_showroom.down,
    name: '20261022_210000_mosaique_johanson_showroom',
  },
  {
    up: migration_20261022_220000_notre_selection.up,
    down: migration_20261022_220000_notre_selection.down,
    name: '20261022_220000_notre_selection',
  },
]
