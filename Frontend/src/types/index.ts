// src/types/index.ts

export type Student = {
  id: string;
  year: number;
  personNr: string | null;
  phoneNr: string | null;
  address: string | null;
  user: { email: string };
};

export type Course = {
  id: string;
  name: string;
  subject: string;
  yearOffered: number;
};

export type GradeCourse = {
  id: string;
  grade: string | null;
  year: number;
  date: string | null;
  course: Course;
};

export type RegisterRow = {
  studentId: string;
  name: string;
  grade: string | null;
  date: string | null;
};

export type YearFilter = 1 | 2 | 3 | "all";

export type StudentsResponse = {
  students: Student[];
};

export type GradesResponse = {
  grades: GradeCourse[];
};

export type RegisterResponse = {
  rows: RegisterRow[];
};