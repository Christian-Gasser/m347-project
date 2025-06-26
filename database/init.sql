DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'm347_grades_management'
   ) THEN
      EXECUTE 'CREATE DATABASE m347_grades_management';
   END IF;
END
$$;

CREATE TABLE IF NOT EXISTS spaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS semesters (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    space_id INTEGER NOT NULL,
    CONSTRAINT fk_semester_space FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    semester_id INTEGER NOT NULL,
    CONSTRAINT fk_subject_semester FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grades (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    exam_date DATE NOT NULL,
    grade_weight DOUBLE PRECISION NOT NULL,
    grade DOUBLE PRECISION NOT NULL,
    subject_id INTEGER NOT NULL,
    CONSTRAINT fk_grade_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);