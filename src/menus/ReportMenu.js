import inquirer from 'inquirer';
import chalk from 'chalk';

// Submenú de reportes: solo pide opciones y delega el trabajo al servicio
export class ReportMenu {
  constructor(reportService, repositories) {
    this.service = reportService;
    this.repos = repositories;
  }

  async run() {
    let back = false;
    while (!back) {
      const { option } = await inquirer.prompt([{
        type: 'list',
        name: 'option',
        message: chalk.cyan('Reportes HTML'),
        choices: [
          { name: 'Lista de estudiantes', value: 'students' },
          { name: 'Lista de profesores', value: 'teachers' },
          { name: 'Horarios por curso', value: 'schedulesByCourse' },
          { name: 'Estudiantes por curso', value: 'studentsByCourse' },
          { name: 'Temas de un curso', value: 'topics' },
          { name: 'Volver', value: 'back' },
        ],
      }]);

      try {
        if (option === 'back') back = true;
        else {
          const filePath = option === 'topics'
            ? await this.topicsReport()
            : await this.service[option]();
          if (filePath) console.log(chalk.green(`✔ Reporte generado en: ${filePath}`));
        }
      } catch (error) {
        console.log(chalk.red(`✖ Error: ${error.message}`));
      }
    }
  }

  // Este reporte necesita que el usuario escoja primero un curso
  async topicsReport() {
    const courses = await this.repos.courses.findAll();
    if (courses.length === 0) return console.log(chalk.yellow('No hay cursos.'));
    const { course } = await inquirer.prompt([{
      type: 'list',
      name: 'course',
      message: 'Escoge el curso:',
      choices: courses.map((c) => ({ name: String(c), value: c })),
    }]);
    return this.service.topicsByCourse(course);
  }
}
