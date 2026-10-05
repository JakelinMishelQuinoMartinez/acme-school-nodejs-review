import { entityClasses } from '../models/entities.js';

// Factory: crea la entidad correcta a partir del nombre de la tabla
export class EntityFactory {
  static all() {
    return entityClasses;
  }

  static getClass(table) {
    const Entity = entityClasses.find((e) => e.table === table);
    if (!Entity) throw new Error(`No existe una entidad para la tabla "${table}"`);
    return Entity;
  }

  static create(table, row) {
    const Entity = this.getClass(table);
    return new Entity(row);
  }
}
