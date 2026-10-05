CREATE DATABASE IF NOT EXISTS acme_school;
USE acme_school;

CREATE TABLE identification_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(6) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(250) NULL
);

CREATE TABLE cities (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE students (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(14) NOT NULL,
  firstName VARCHAR(60) NOT NULL,
  lastName VARCHAR(60) NOT NULL,
  identification_type_id INT NOT NULL,
  identificationNumber VARCHAR(16) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  birthdate DATETIME NOT NULL,
  email VARCHAR(60) NULL,
  address VARCHAR(100) NULL,
  city_id BIGINT NOT NULL,
  FOREIGN KEY (identification_type_id) REFERENCES identification_types(id),
  FOREIGN KEY (city_id) REFERENCES cities(id)
);

CREATE TABLE teachers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
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
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  description VARCHAR(250) NOT NULL,
  intensity INT NOT NULL,
  weight INT NOT NULL,
  active TINYINT NOT NULL DEFAULT 1
);

CREATE TABLE topics (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT NOT NULL,
  code VARCHAR(10) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(250) NULL,
  active TINYINT NOT NULL DEFAULT 1,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE courses_schedules (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT NOT NULL,
  teacher_id BIGINT NOT NULL,
  classroom_id INT NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  active TINYINT NOT NULL DEFAULT 1,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(id),
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id)
);

CREATE TABLE inscriptions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  course_schedule BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  register_date DATETIME NOT NULL,
  active TINYINT NOT NULL DEFAULT 1,
  FOREIGN KEY (course_schedule) REFERENCES courses_schedules(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE rates (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  inscription_id BIGINT NOT NULL,
  rate BIGINT NOT NULL,
  comments VARCHAR(250) NULL,
  FOREIGN KEY (inscription_id) REFERENCES inscriptions(id)
);
