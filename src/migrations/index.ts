import * as migration_20261013_114936_initial from './20261013_114936_initial'
import * as migration_20261013_190947_modele_de_contenu from './20261013_190947_modele_de_contenu'
import * as migration_20261013_200000_fabricants_de_depart from './20261013_200000_fabricants_de_depart'

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
    up: migration_20261013_200000_fabricants_de_depart.up,
    down: migration_20261013_200000_fabricants_de_depart.down,
    name: '20261013_200000_fabricants_de_depart',
  },
]
