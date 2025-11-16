// src/services/gradeService.ts
import type { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
export type LetterGrade = "A" | "B" | "C" | "D" | "F";

export type GradeFilter = {
  firebaseUid: string; // from Firebase token
  year?: number; // 1 | 2 | 3
  subject?: string; // e.g. "English"
};

// 1. Student “Grades” page
export async function getStudentGrades(filter: GradeFilter) {
  const { firebaseUid, year, subject } = filter;

  const grades = await prisma.grade.findMany({
    where: {
      student: {
        user: {
          firebaseUid,
        },
      },
      ...(year ? { year } : {}),
      ...(subject
        ? {
            course: {
              subject,
            },
          }
        : {}),
    },
    include: {
      course: true,
    },
    orderBy: [
      { year: "asc" },
      { course: { yearOffered: "asc" } },
      { course: { name: "asc" } },
    ],
  });

  return grades;
}

// 2. Admin “Student Accounts” page
export async function getStudentsByYear(year?: number) {
  return prisma.student.findMany({
    where: year ? { year } : {},
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      user: { email: "asc" },
    },
  });
}

// 3. Admin “Register Grades” – list rows
export async function getRegisterGradesView(year: number, courseId: string) {
  const students = await prisma.student.findMany({
    where: { year },
    include: {
      user: { select: { email: true } },
      grades: {
        where: { courseId },
        take: 1,
      },
    },
    orderBy: {
      user: { email: "asc" },
    },
  });

  // Map to DTO for frontend
  return students.map((s: (typeof students)[0]) => {
    const g = s.grades[0];
    return {
      studentId: s.id,
      name: s.user.email, // or add a separate "name" field
      grade: g?.grade ?? null,
      date: g?.date ?? null,
    };
  });
}

// 4. Admin “Register Grades” – set/update a grade
export type SetGradeInput = {
  studentId: string;
  courseId: string;
  grade: LetterGrade;
  year: number;
};

export async function setGrade(input: SetGradeInput) {
  const { studentId, courseId, grade, year } = input;

  const result = await prisma.grade.upsert({
    where: {
      studentId_courseId: { studentId, courseId },
    },
    update: {
      grade,
      year,
      date: new Date(),
    },
    create: {
      studentId,
      courseId,
      grade,
      year,
      // date uses default
    },
  });

  return result;
}
