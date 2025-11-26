// src/services/__tests__/gradeService.test.ts

jest.mock("../../utils/prisma", () => ({
  prisma: {
    student: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    grade: {
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
    course: {
      findUnique: jest.fn(),
    },
  },
}));

import { prisma } from "../../utils/prisma";
import {
  getStudentGrades,
  getRegisterGradesView,
  setGrade,
} from "../gradeService";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("gradeService", () => {
  describe("getStudentGrades", () => {
    it("returns grades for a student with firebaseUid", async () => {
      const mockStudent = {
        id: "student-1",
        userId: "user-1",
        year: 1,
      };

      const mockGrades = [
        {
          id: "grade-1",
          grade: "A",
          year: 1,
          studentId: "student-1",
          courseId: "course-1",
          date: new Date(),
          course: {
            id: "course-1",
            name: "Engelska 5",
            subject: "English",
            yearOffered: 1,
          },
        },
      ];

      (prisma.student.findUnique as jest.Mock).mockResolvedValue(mockStudent);
      (prisma.grade.findMany as jest.Mock).mockResolvedValue(mockGrades);

      const result = await getStudentGrades({
        firebaseUid: "firebase-123",
      });

      expect(result).toEqual(mockGrades);
    });

    it("filters grades by year", async () => {
      const mockStudent = {
        id: "student-1",
        userId: "user-1",
        year: 1,
      };

      (prisma.student.findUnique as jest.Mock).mockResolvedValue(mockStudent);
      (prisma.grade.findMany as jest.Mock).mockResolvedValue([]);

      const result = await getStudentGrades({
        firebaseUid: "firebase-123",
        year: 1,
      });

      expect(result).toEqual([]);
    });

    it("filters grades by subject", async () => {
      const mockStudent = {
        id: "student-1",
        userId: "user-1",
        year: 1,
      };

      (prisma.student.findUnique as jest.Mock).mockResolvedValue(mockStudent);
      (prisma.grade.findMany as jest.Mock).mockResolvedValue([]);

      const result = await getStudentGrades({
        firebaseUid: "firebase-123",
        subject: "English",
      });

      expect(result).toEqual([]);
    });

    it("returns empty array when student not found", async () => {
      (prisma.student.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getStudentGrades({ firebaseUid: "firebase-123" });
      
      expect(result).toEqual([]);
    });
  });

  describe("getRegisterGradesView", () => {
    it("returns grades for a specific year and course", async () => {
      const mockStudents = [
        {
          id: "student-1",
          user: {
            email: "student@example.com",
          },
          grades: [
            {
              id: "grade-1",
              grade: "A",
              courseId: "course-1",
              year: 1,
            },
          ],
        },
      ];

      (prisma.student.findMany as jest.Mock).mockResolvedValue(mockStudents);

      const result = await getRegisterGradesView(1, "course-1");

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("setGrade", () => {
    it("creates or updates a grade", async () => {
      const mockGrade = {
        id: "grade-1",
        grade: "A",
        studentId: "student-1",
        courseId: "course-1",
        year: 1,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.grade.upsert as jest.Mock).mockResolvedValue(mockGrade);

      const result = await setGrade({
        studentId: "student-1",
        courseId: "course-1",
        grade: "A",
        year: 1,
      });

      expect(result).toEqual(mockGrade);
      expect(result.grade).toBe("A");
      expect(result.studentId).toBe("student-1");
    });
  });
});