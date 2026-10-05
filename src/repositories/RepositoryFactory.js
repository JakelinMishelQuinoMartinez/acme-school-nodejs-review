import { EntityFactory } from '../factories/EntityFactory.js';
import { BaseRepository } from './BaseRepository.js';
import { CourseScheduleRepository, InscriptionRepository } from './SpecialRepositories.js';

// Tablas que necesitan un repositorio con consultas propias
const special = {
  courses_schedules: CourseScheduleRepository,
  inscriptions: InscriptionRepository,
};

export class RepositoryFactory {
  // Devuelve un objeto { nombre_tabla: repositorio }
  static createAll(pool) {
    const repos = {};
    for (const Entity of EntityFactory.all()) {
      const Repo = special[Entity.table];
      repos[Entity.table] = Repo ? new Repo(pool) : new BaseRepository(pool, Entity.table);
    }
    return repos;
  }
}
