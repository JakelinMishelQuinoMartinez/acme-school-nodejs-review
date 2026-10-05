import chalk from 'chalk';
import { pool } from './config/database.js';
import { RepositoryFactory } from './repositories/RepositoryFactory.js';
import { ReportRepository } from './repositories/ReportRepository.js';
import { HtmlReportGenerator } from './services/HtmlReportGenerator.js';
import { ReportService } from './services/ReportService.js';
import { ReportMenu } from './menus/ReportMenu.js';
import { MainMenu } from './menus/MainMenu.js';

// Aquí se "ensamblan" todas las piezas (composición de dependencias)
async function main() {
  try {
    await pool.query('SELECT 1'); // Prueba rápida de conexión

    const repositories = RepositoryFactory.createAll(pool);
    const reportService = new ReportService(new ReportRepository(pool), new HtmlReportGenerator());
    const reportMenu = new ReportMenu(reportService, repositories);

    await new MainMenu(repositories, reportMenu).run();
  } catch (error) {
    console.log(chalk.red(`No se pudo iniciar la app: ${error.message}`));
  } finally {
    await pool.end(); // Cierra las conexiones al salir
  }
}

main();
