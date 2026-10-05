import { EntityFactory } from '../factories/EntityFactory.js';

// Repository genérico: el CRUD es igual para todas las tablas
export class BaseRepository {
  constructor(pool, table) {
    this.pool = pool; // Se recibe desde afuera (inyección de dependencias)
    this.table = table;
  }

  get EntityClass() {
    return EntityFactory.getClass(this.table);
  }

  // Convierte las filas de MySQL en objetos de nuestras clases
  toEntities(rows) {
    return rows.map((row) => EntityFactory.create(this.table, row));
  }

  async findAll() {
    // ?? se reemplaza por el nombre de la tabla de forma segura
    const [rows] = await this.pool.query('SELECT * FROM ?? ORDER BY id', [this.table]);
    return this.toEntities(rows);
  }

  async create(data) {
    // "SET ?" convierte el objeto {campo: valor} en "campo = valor"
    const [result] = await this.pool.query('INSERT INTO ?? SET ?', [this.table, data]);
    return result.insertId;
  }

  async update(id, data) {
    await this.pool.query('UPDATE ?? SET ? WHERE id = ?', [this.table, data, id]);
  }

  async delete(id) {
    await this.pool.query('DELETE FROM ?? WHERE id = ?', [this.table, id]);
  }
}
