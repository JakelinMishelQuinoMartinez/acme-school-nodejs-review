CREATE DATABASE IF NOT EXISTS acme_school;
USE acme_school;

CREATE TABLE identification_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(6) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(250) NULL
);

CREATE TABLE cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(14) NOT NULL,
  firstName VARCHAR(60) NOT NULL,
  lastName VARCHAR(60) NOT NULL,
  identification_type_id INT NOT NULL,
  identificationNumber VARCHAR(16) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  birthdate DATETIME NOT NULL,
  email VARCHAR(60) NULL,
  address VARCHAR(100) NULL,
  city_id INT NOT NULL,
  FOREIGN KEY (identification_type_id) REFERENCES identification_types(id),
  FOREIGN KEY (city_id) REFERENCES cities(id)
);

CREATE TABLE teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(60) NOT NULL,
  lastName VARCHAR(60) NOT NULL,
  identification_type_id INT NOT NULL,
  identificationNumber VARCHAR(16) NOT NULL,
  email VARCHAR(100) NOT NULL,
  FOREIGN KEY (identification_type_id) REFERENCES identification_types(id)
);

CREATE TABLE classrooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  description VARCHAR(250) NULL,
  capacity INT NOT NULL,
  active TINYINT NOT NULL DEFAULT 1
);

CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  description VARCHAR(250) NOT NULL,
  intensity INT NOT NULL,
  weight INT NOT NULL,
  active TINYINT NOT NULL DEFAULT 1
);

CREATE TABLE topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  code VARCHAR(10) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(250) NULL,
  active TINYINT NOT NULL DEFAULT 1,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE courses_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  teacher_id INT NOT NULL,
  classroom_id INT NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  active TINYINT NOT NULL DEFAULT 1,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(id),
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id)
);

CREATE TABLE inscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_schedule INT NOT NULL,
  student_id INT NOT NULL,
  register_date DATETIME NOT NULL,
  active TINYINT NOT NULL DEFAULT 1,
  FOREIGN KEY (course_schedule) REFERENCES courses_schedules(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE rates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  inscription_id INT NOT NULL,
  rate INT NOT NULL,
  comments VARCHAR(250) NULL,
  FOREIGN KEY (inscription_id) REFERENCES inscriptions(id)
);


-- Datos de ejemplo para probar la app
INSERT INTO identification_types (code, name, description) VALUES
  ('DPI', 'Documento Personal de Identificación', 'Documento nacional'),
  ('PAS', 'Pasaporte', NULL);
INSERT INTO cities (code, name) VALUES ('GUA', 'Guatemala'), ('QZT', 'Quetzaltenango');
INSERT INTO students (code, firstName, lastName, identification_type_id, identificationNumber, gender, birthdate, email, address, city_id) VALUES
  ('STU-001', 'Ana', 'López', 1, '1234567890101', 'Femenino', '2002-05-14 00:00:00', 'ana@mail.com', 'Zona 1', 1),
  ('STU-002', 'Luis', 'Pérez', 1, '9876543210101', 'Masculino', '2001-11-02 00:00:00', 'luis@mail.com', 'Zona 5', 2);
INSERT INTO teachers (firstName, lastName, identification_type_id, identificationNumber, email) VALUES
  ('Carlos', 'Méndez', 1, '5555555550101', 'carlos@acme.edu');
INSERT INTO classrooms (code, description, capacity, active) VALUES ('A-101', 'Aula principal', 30, 1);
INSERT INTO courses (code, description, intensity, weight, active) VALUES
  ('MAT-01', 'Matemática básica', 40, 5, 1),
  ('PRO-01', 'Introducción a la programación', 60, 8, 1);
INSERT INTO topics (course_id, code, title, description, active) VALUES
  (1, 'T-01', 'Números enteros', 'Operaciones básicas', 1),
  (2, 'T-01', 'Variables', 'Tipos de datos', 1),
  (2, 'T-02', 'Ciclos', 'for y while', 1);
INSERT INTO courses_schedules (course_id, teacher_id, classroom_id, start_date, end_date, active) VALUES
  (1, 1, 1, '2026-02-01 08:00:00', '2026-04-30 10:00:00', 1),
  (2, 1, 1, '2026-02-01 10:30:00', '2026-06-30 12:30:00', 1);
INSERT INTO inscriptions (course_schedule, student_id, register_date, active) VALUES
  (1, 1, NOW(), 1), (2, 1, NOW(), 1), (2, 2, NOW(), 1);
INSERT INTO rates (inscription_id, rate, comments) VALUES (1, 90, 'Excelente');
