import * as migration_20261013_114936_initial from './20261013_114936_initial'
import * as migration_20261013_190947_modele_de_contenu from './20261013_190947_modele_de_contenu'

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
]
