// src/routes/__tests__/gradeRoutes.test.ts

jest.mock("../../services/gradeService", () => ({
  getStudentGrades: jest.fn().mockResolvedValue([
    {
      id: "grade-1",
      grade: "A",
      year: 1,
      date: new Date().toISOString(),
      studentId: "student-1",
      courseId: "course-1",
      course: {
        id: "course-1",
        name: "Engelska 5",
        subject: "English",
        yearOffered: 1,
      },
    },
  ]),
  getRegisterGradesView: jest.fn().mockResolvedValue([
    {
      studentId: "student-1",
      studentName: "Test Student",
      email: "student@example.com",
      grade: "A",
    },
  ]),
  setGrade: jest.fn().mockResolvedValue({
    id: "grade-1",
    grade: "A",
    studentId: "student-1",
    courseId: "course-1",
    year: 1,
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
}));

jest.mock("../../utils/prisma", () => {
  return {
    prisma: {
      grade: {
        findMany: jest.fn(),
      },
    },
  };
});

import express from "express";
import request from "supertest";
import gradeRoutes from "../gradeRoutes";

const app = express();
app.use(express.json());

// Fake auth for tests
app.use((req, _res, next) => {
  (req as any).user = {
    id: "test-user",
    firebaseUid: "firebase-123",
    email: "test@example.com",
    role: "STUDENT",
  };
  next();
});

app.use("/api", gradeRoutes);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/me/grades", () => {
  it("returns 200 and an array of grades", async () => {
    const res = await request(app).get("/api/me/grades");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("grades");
    expect(Array.isArray(res.body.grades)).toBe(true);
  });

  it("accepts a year filter", async () => {
    const res = await request(app).get("/api/me/grades?year=1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("grades");
  });

  it("accepts a subject filter", async () => {
    const res = await request(app).get("/api/me/grades?subject=English");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("grades");
  });

});

describe("Admin Grade Routes", () => {
  let adminApp: express.Application;

  beforeEach(() => {
    adminApp = express();
    adminApp.use(express.json());
    
    // Mock admin user
    adminApp.use((req, _res, next) => {
      (req as any).user = {
        id: "admin-user",
        firebaseUid: "firebase-admin",
        email: "admin@example.com",
        role: "ADMIN",
      };
      next();
    });
    
    adminApp.use("/api", gradeRoutes);
  });

  describe("GET /api/admin/grades", () => {
    it("returns 200 with grades for valid year and courseId", async () => {
      const res = await request(adminApp)
        .get("/api/admin/grades?year=1&courseId=course-1");
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("rows");
    });

    it("returns 400 when year is missing", async () => {
      const res = await request(adminApp)
        .get("/api/admin/grades?courseId=course-1");
      
      expect(res.status).toBe(400);
    });

    it("returns 400 when courseId is missing", async () => {
      const res = await request(adminApp)
        .get("/api/admin/grades?year=1");
      
      expect(res.status).toBe(400);
    });

    it("returns 400 when year is invalid", async () => {
      const res = await request(adminApp)
        .get("/api/admin/grades?year=5&courseId=course-1");
      
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/admin/grades", () => {
    it("returns 201 when grade is created successfully", async () => {
      const res = await request(adminApp)
        .post("/api/admin/grades")
        .send({
          studentId: "student-123",
          courseId: "course-1",
          grade: "A",
          year: 1,
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("grade");
    });

    it("returns 400 when required fields are missing", async () => {
      const res = await request(adminApp)
        .post("/api/admin/grades")
        .send({
          studentId: "student-123",
          // missing courseId, grade, year
        });
      
      expect(res.status).toBe(400);
    });

    it("returns 400 when grade is invalid", async () => {
      const res = await request(adminApp)
        .post("/api/admin/grades")
        .send({
          studentId: "student-123",
          courseId: "course-1",
          grade: "Z", // Invalid grade
          year: 1,
        });
      
      expect(res.status).toBe(400);
    });
  });
});