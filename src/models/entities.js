// Cada clase representa una tabla. Principio SRP: solo describe sus datos.
// "fields" indica qué campos se piden en los formularios del menú.

class BaseEntity {
  constructor(data = {}) {
    Object.assign(this, data); // Copia cada columna de la fila como propiedad
  }
}

export class IdentificationType extends BaseEntity {
  static table = 'identification_types';
  static title = 'Tipos de identificación';
  static fields = [
    { name: 'code', label: 'Código', type: 'text', max: 6 },
    { name: 'name', label: 'Nombre', type: 'text', max: 100 },
    { name: 'description', label: 'Descripción', type: 'text', max: 250, optional: true },
  ];
  toString() { return `${this.id} - ${this.code} - ${this.name}`; }
}

export class City extends BaseEntity {
  static table = 'cities';
  static title = 'Ciudades';
  static fields = [
    { name: 'code', label: 'Código', type: 'text', max: 10 },
    { name: 'name', label: 'Nombre', type: 'text', max: 100 },
  ];
  toString() { return `${this.id} - ${this.code} - ${this.name}`; }
}

export class Student extends BaseEntity {
  static table = 'students';
  static title = 'Estudiantes';
  static fields = [
    { name: 'code', label: 'Código', type: 'text', max: 14 },
    { name: 'firstName', label: 'Nombres', type: 'text', max: 60 },
    { name: 'lastName', label: 'Apellidos', type: 'text', max: 60 },
    { name: 'identification_type_id', label: 'Tipo de identificación', ref: 'identification_types' },
    { name: 'identificationNumber', label: 'No. de identificación', type: 'text', max: 16 },
    { name: 'gender', label: 'Género', choices: ['Masculino', 'Femenino', 'Otro'] },
    { name: 'birthdate', label: 'Fecha de nacimiento (AAAA-MM-DD)', type: 'datetime' },
    { name: 'email', label: 'Correo', type: 'text', max: 60, optional: true },
    { name: 'address', label: 'Dirección', type: 'text', max: 100, optional: true },
    { name: 'city_id', label: 'Ciudad', ref: 'cities' },
  ];
  toString() { return `${this.id} - ${this.code} - ${this.firstName} ${this.lastName}`; }
}

export class Teacher extends BaseEntity {
  static table = 'teachers';
  static title = 'Profesores';
  static fields = [
    { name: 'firstName', label: 'Nombres', type: 'text', max: 60 },
    { name: 'lastName', label: 'Apellidos', type: 'text', max: 60 },
    { name: 'identification_type_id', label: 'Tipo de identificación', ref: 'identification_types' },
    { name: 'identificationNumber', label: 'No. de identificación', type: 'text', max: 16 },
    { name: 'email', label: 'Correo', type: 'text', max: 100 },
  ];
  toString() { return `${this.id} - ${this.firstName} ${this.lastName}`; }
}

export class Classroom extends BaseEntity {
  static table = 'classrooms';
  static title = 'Aulas';
  static fields = [
    { name: 'code', label: 'Código', type: 'text', max: 10 },
    { name: 'description', label: 'Descripción', type: 'text', max: 250, optional: true },
    { name: 'capacity', label: 'Capacidad', type: 'number' },
    { name: 'active', label: '¿Activa?', type: 'boolean' },
  ];
  toString() { return `${this.id} - ${this.code}`; }
}

export class Course extends BaseEntity {
  static table = 'courses';
  static title = 'Cursos';
  static fields = [
    { name: 'code', label: 'Código', type: 'text', max: 10 },
    { name: 'description', label: 'Descripción', type: 'text', max: 250 },
    { name: 'intensity', label: 'Intensidad (horas)', type: 'number' },
    { name: 'weight', label: 'Peso', type: 'number' },
    { name: 'active', label: '¿Activo?', type: 'boolean' },
  ];
  toString() { return `${this.id} - ${this.code} - ${this.description}`; }
}

export class Topic extends BaseEntity {
  static table = 'topics';
  static title = 'Temas';
  static fields = [
    { name: 'course_id', label: 'Curso', ref: 'courses' },
    { name: 'code', label: 'Código', type: 'text', max: 10 },
    { name: 'title', label: 'Título', type: 'text', max: 100 },
    { name: 'description', label: 'Descripción', type: 'text', max: 250, optional: true },
    { name: 'active', label: '¿Activo?', type: 'boolean' },
  ];
  toString() { return `${this.id} - ${this.code} - ${this.title}`; }
}

export class CourseSchedule extends BaseEntity {
  static table = 'courses_schedules';
  static title = 'Horarios de cursos';
  static fields = [
    { name: 'course_id', label: 'Curso', ref: 'courses' },
    { name: 'teacher_id', label: 'Profesor', ref: 'teachers' },
    { name: 'classroom_id', label: 'Aula', ref: 'classrooms' },
    { name: 'start_date', label: 'Inicio (AAAA-MM-DD HH:mm:ss)', type: 'datetime' },
    { name: 'end_date', label: 'Fin (AAAA-MM-DD HH:mm:ss)', type: 'datetime' },
    { name: 'active', label: '¿Activo?', type: 'boolean' },
  ];
  // course_code y teacher vienen del JOIN del repositorio especial
  toString() { return `${this.id} - ${this.course_code} | ${this.teacher} | ${this.start_date}`; }
}

export class Inscription extends BaseEntity {
  static table = 'inscriptions';
  static title = 'Inscripciones';
  static fields = [
    { name: 'course_schedule', label: 'Horario del curso', ref: 'courses_schedules' },
    { name: 'student_id', label: 'Estudiante', ref: 'students' },
    { name: 'register_date', label: 'Fecha de registro (AAAA-MM-DD HH:mm:ss)', type: 'datetime' },
    { name: 'active', label: '¿Activa?', type: 'boolean' },
  ];
  toString() { return `${this.id} - ${this.student_name} en ${this.course_code}`; }
}

export class Rate extends BaseEntity {
  static table = 'rates';
  static title = 'Notas';
  static fields = [
    { name: 'inscription_id', label: 'Inscripción', ref: 'inscriptions' },
    { name: 'rate', label: 'Nota', type: 'number' },
    { name: 'comments', label: 'Comentarios', type: 'text', max: 250, optional: true },
  ];
  toString() { return `${this.id} - Nota ${this.rate} (inscripción ${this.inscription_id})`; }
}

// El orden de esta lista es el orden del menú principal
export const entityClasses = [
  IdentificationType, City, Student, Teacher, Classroom,
  Course, Topic, CourseSchedule, Inscription, Rate,
];
