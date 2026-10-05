import { BaseRepository } from './BaseRepository.js';

// Estos repositorios heredan todo el CRUD y solo cambian el SELECT
// para traer nombres legibles (así los menús muestran datos claros).

export class CourseScheduleRepository extends BaseRepository {
  constructor(pool) {
    super(pool, 'courses_schedules');
  }

  async findAll() {
    const [rows] = await this.pool.query(`
      SELECT cs.*, c.code AS course_code, CONCAT(t.firstName, ' ', t.lastName) AS teacher
      FROM courses_schedules cs
      JOIN courses c ON c.id = cs.course_id
      JOIN teachers t ON t.id = cs.teacher_id
      ORDER BY cs.id`);
    return this.toEntities(rows);
  }
}

export class InscriptionRepository extends BaseRepository {
  constructor(pool) {
    super(pool, 'inscriptions');
  }

  async findAll() {
    const [rows] = await this.pool.query(`
      SELECT i.*, CONCAT(s.firstName, ' ', s.lastName) AS student_name, c.code AS course_code
      FROM inscriptions i
      JOIN students s ON s.id = i.student_id
      JOIN courses_schedules cs ON cs.id = i.course_schedule
      JOIN courses c ON c.id = cs.course_id
      ORDER BY i.id`);
    return this.toEntities(rows);
  }
}
