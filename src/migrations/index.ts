import * as migration_20261013_114936_initial from './20261013_114936_initial'
import * as migration_20261013_190947_modele_de_contenu from './20261013_190947_modele_de_contenu'
import * as migration_20261013_194519_stockage_blob from './20261013_194519_stockage_blob'
import * as migration_20261013_200000_fabricants_de_depart from './20261013_200000_fabricants_de_depart'
import * as migration_20261013_200939_gabarits_socle from './20261013_200939_gabarits_socle'
import * as migration_20261013_201500_contenus_de_depart from './20261013_201500_contenus_de_depart'
import * as migration_20261014_041333_rubrique_produits from './20261014_041333_rubrique_produits'
import * as migration_20261014_050000_produits_de_depart from './20261014_050000_produits_de_depart'
import * as migration_20261014_171107_liste_de_salons from './20261014_171107_liste_de_salons'
import * as migration_20261014_200000_ancien_site from './20261014_200000_ancien_site'

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
    up: migration_20261014_200000_ancien_site.up,
    down: migration_20261014_200000_ancien_site.down,
    name: '20261014_200000_ancien_site',
  },
]
