import inquirer from 'inquirer';
import chalk from 'chalk';

// Un solo menú CRUD sirve para TODAS las entidades (principio DRY y OCP):
// se adapta leyendo los "fields" de la clase de la entidad.
export class CrudMenu {
  constructor(repository, repositories) {
    this.repo = repository;
    this.repos = repositories; // Se usa para listar opciones de llaves foráneas
    this.Entity = repository.EntityClass;
  }

  async run() {
    let back = false;
    while (!back) {
      const { action } = await inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: chalk.cyan(`${this.Entity.title} - ¿Qué deseas hacer?`),
        choices: [
          { name: 'Listar', value: 'list' },
          { name: 'Crear', value: 'create' },
          { name: 'Editar', value: 'update' },
          { name: 'Eliminar', value: 'delete' },
          { name: 'Volver', value: 'back' },
        ],
      }]);

      try {
        if (action === 'back') back = true;
        else await this[action](); // Llama al método list, create, update o delete
      } catch (error) {
        this.showError(error);
      }
    }
  }

  async list() {
    const items = await this.repo.findAll();
    if (items.length === 0) return console.log(chalk.yellow('No hay registros.'));
    console.table(items);
  }

  async create() {
    const data = await this.askData();
    const id = await this.repo.create(data);
    console.log(chalk.green(`✔ Registro creado con id ${id}`));
  }

  async update() {
    const item = await this.chooseItem('¿Cuál registro quieres editar?');
    if (!item) return;
    const data = await this.askData(item);
    await this.repo.update(item.id, data);
    console.log(chalk.green('✔ Registro actualizado'));
  }

  async delete() {
    const item = await this.chooseItem('¿Cuál registro quieres eliminar?');
    if (!item) return;
    const { ok } = await inquirer.prompt([
      { type: 'confirm', name: 'ok', message: `¿Seguro de eliminar "${item}"?`, default: false },
    ]);
    if (!ok) return;
    await this.repo.delete(item.id);
    console.log(chalk.green('✔ Registro eliminado'));
  }

  // Muestra una lista para escoger un registro
  async chooseItem(message) {
    const items = await this.repo.findAll();
    if (items.length === 0) {
      console.log(chalk.yellow('No hay registros.'));
      return null;
    }
    const { item } = await inquirer.prompt([{
      type: 'list',
      name: 'item',
      message,
      pageSize: 12,
      choices: items.map((i) => ({ name: String(i), value: i })),
    }]);
    return item;
  }

  // Pide todos los campos de la entidad (current = valores actuales al editar)
  async askData(current = {}) {
    const data = {};
    for (const field of this.Entity.fields) {
      data[field.name] = await this.askField(field, current[field.name]);
    }
    return data;
  }

  // Construye la pregunta correcta según el tipo de campo
  async askField(field, current) {
    const base = { name: 'value', message: `${field.label}:` };
    let question;

    if (field.ref) {
      // Llave foránea: se muestra una lista con los registros de la otra tabla
      const options = await this.repos[field.ref].findAll();
      if (options.length === 0) throw new Error(`Primero crea registros en "${field.ref}".`);
      question = { ...base, type: 'list', default: current,
        choices: options.map((o) => ({ name: String(o), value: o.id })) };
    } else if (field.choices) {
      question = { ...base, type: 'list', choices: field.choices, default: current };
    } else if (field.type === 'boolean') {
      question = { ...base, type: 'confirm', default: current === undefined ? true : Boolean(current) };
    } else if (field.type === 'number') {
      question = { ...base, type: 'number', default: current,
        validate: (v) => !Number.isNaN(v) || 'Escribe un número válido' };
    } else if (field.type === 'datetime') {
      question = { ...base, type: 'input', default: current,
        validate: (v) => /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}(:\d{2})?)?$/.test(v) || 'Formato: AAAA-MM-DD HH:mm:ss' };
    } else {
      question = { ...base, type: 'input', default: current ?? '', filter: (v) => v.trim(),
        validate: (v) => {
          if (!field.optional && v === '') return 'Este campo es obligatorio';
          if (v.length > field.max) return `Máximo ${field.max} caracteres`;
          return true;
        } };
    }

    const { value } = await inquirer.prompt([question]);
    return value === '' ? null : value; // Un campo opcional vacío se guarda como NULL
  }

  showError(error) {
    // Este código lo envía MySQL cuando el registro está relacionado con otro
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return console.log(chalk.red('✖ No se puede eliminar: otros registros dependen de este.'));
    }
    console.log(chalk.red(`✖ Error: ${error.message}`));
  }
}
