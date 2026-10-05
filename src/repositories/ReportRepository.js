// Solo consultas de lectura para los reportes (SRP: separado del CRUD)
export class ReportRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.query(sql, params);
    return rows;
  }

  students() {
    return this.query(`
      SELECT s.code, s.firstName, s.lastName, it.name AS idType, s.identificationNumber,
             s.gender, s.birthdate, s.email, s.address, c.name AS city
      FROM students s
      JOIN identification_types it ON it.id = s.identification_type_id
      JOIN cities c ON c.id = s.city_id
      ORDER BY s.lastName`);
  }

  teachers() {
    return this.query(`
      SELECT t.firstName, t.lastName, it.name AS idType, t.identificationNumber, t.email
      FROM teachers t
      JOIN identification_types it ON it.id = t.identification_type_id
      ORDER BY t.lastName`);
  }

  schedulesByCourse() {
    return this.query(`
      SELECT c.code AS courseCode, c.description AS course,
             CONCAT(t.firstName, ' ', t.lastName) AS teacher, cl.code AS classroom,
             cs.start_date, cs.end_date, IF(cs.active, 'Sí', 'No') AS active
      FROM courses_schedules cs
      JOIN courses c ON c.id = cs.course_id
      JOIN teachers t ON t.id = cs.teacher_id
      JOIN classrooms cl ON cl.id = cs.classroom_id
      ORDER BY c.code, cs.start_date`);
  }

  studentsByCourse() {
    return this.query(`
      SELECT c.code AS courseCode, c.description AS course, s.code AS studentCode,
             CONCAT(s.firstName, ' ', s.lastName) AS student, s.email, i.register_date
      FROM inscriptions i
      JOIN students s ON s.id = i.student_id
      JOIN courses_schedules cs ON cs.id = i.course_schedule
      JOIN courses c ON c.id = cs.course_id
      ORDER BY c.code, s.lastName`);
  }

  topicsByCourse(courseId) {
    return this.query(
      `SELECT code, title, description, IF(active, 'Sí', 'No') AS active
       FROM topics WHERE course_id = ? ORDER BY code`,
      [courseId]
    );
  }
}
