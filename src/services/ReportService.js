// Une las consultas (ReportRepository) con el generador de HTML
export class ReportService {
  constructor(reportRepository, generator) {
    this.repo = reportRepository;
    this.generator = generator;
  }

  // Agrupa filas por curso: { "MAT-01 - Matemática": [filas] } -> [{heading, rows}]
  groupByCourse(rows) {
    const groups = {};
    for (const row of rows) {
      const key = `${row.courseCode} - ${row.course}`;
      (groups[key] ??= []).push(row); // ??= crea el arreglo si aún no existe
    }
    return Object.entries(groups).map(([heading, rows]) => ({ heading, rows }));
  }

  async students() {
    const rows = await this.repo.students();
    return this.generator.generate({
      fileName: 'estudiantes',
      title: 'Lista de estudiantes',
      columns: [
        { key: 'code', label: 'Código' }, { key: 'firstName', label: 'Nombres' },
        { key: 'lastName', label: 'Apellidos' }, { key: 'idType', label: 'Tipo ID' },
        { key: 'identificationNumber', label: 'No. ID' }, { key: 'gender', label: 'Género' },
        { key: 'birthdate', label: 'Nacimiento' }, { key: 'email', label: 'Correo' },
        { key: 'address', label: 'Dirección' }, { key: 'city', label: 'Ciudad' },
      ],
      sections: [{ rows }],
    });
  }

  async teachers() {
    const rows = await this.repo.teachers();
    return this.generator.generate({
      fileName: 'profesores',
      title: 'Lista de profesores',
      columns: [
        { key: 'firstName', label: 'Nombres' }, { key: 'lastName', label: 'Apellidos' },
        { key: 'idType', label: 'Tipo ID' }, { key: 'identificationNumber', label: 'No. ID' },
        { key: 'email', label: 'Correo' },
      ],
      sections: [{ rows }],
    });
  }

  async schedulesByCourse() {
    const rows = await this.repo.schedulesByCourse();
    return this.generator.generate({
      fileName: 'horarios_por_curso',
      title: 'Horarios por curso',
      columns: [
        { key: 'teacher', label: 'Profesor' }, { key: 'classroom', label: 'Aula' },
        { key: 'start_date', label: 'Inicio' }, { key: 'end_date', label: 'Fin' },
        { key: 'active', label: 'Activo' },
      ],
      sections: this.groupByCourse(rows),
    });
  }

  async studentsByCourse() {
    const rows = await this.repo.studentsByCourse();
    return this.generator.generate({
      fileName: 'estudiantes_por_curso',
      title: 'Estudiantes por curso',
      columns: [
        { key: 'studentCode', label: 'Código' }, { key: 'student', label: 'Estudiante' },
        { key: 'email', label: 'Correo' }, { key: 'register_date', label: 'Fecha de inscripción' },
      ],
      sections: this.groupByCourse(rows),
    });
  }

  async topicsByCourse(course) {
    const rows = await this.repo.topicsByCourse(course.id);
    return this.generator.generate({
      fileName: 'temas_del_curso',
      title: `Temas del curso ${course.code} - ${course.description}`,
      columns: [
        { key: 'code', label: 'Código' }, { key: 'title', label: 'Título' },
        { key: 'description', label: 'Descripción' }, { key: 'active', label: 'Activo' },
      ],
      sections: [{ rows }],
    });
  }
}
