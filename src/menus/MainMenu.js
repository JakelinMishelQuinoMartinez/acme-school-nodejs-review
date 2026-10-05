import inquirer from 'inquirer';
import chalk from 'chalk';
import { CrudMenu } from './CrudMenu.js';
import { EntityFactory } from '../factories/EntityFactory.js';

export class MainMenu {
  constructor(repositories, reportMenu) {
    this.repos = repositories;
    this.reportMenu = reportMenu;
  }

  async run() {
    console.log(chalk.bold.green('\n=== ACME SCHOOL ===\n'));
    while (true) {
      const { option } = await inquirer.prompt([{
        type: 'list',
        name: 'option',
        message: chalk.cyan('Menú principal'),
        pageSize: 15,
        choices: [
          // Una opción por cada entidad, se crean solas desde la lista de clases
          ...EntityFactory.all().map((E) => ({ name: E.title, value: E.table })),
          new inquirer.Separator(),
          { name: 'Reportes HTML', value: 'reports' },
          { name: 'Salir', value: 'exit' },
        ],
      }]);

      if (option === 'exit') return console.log(chalk.green('¡Hasta pronto!'));
      if (option === 'reports') await this.reportMenu.run();
      else await new CrudMenu(this.repos[option], this.repos).run();
    }
  }
}
