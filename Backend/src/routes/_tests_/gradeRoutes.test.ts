// src/routes/gradeRoutes.test.ts

jest.mock("../../utils/prisma", () => {
  return {
    prisma: {
      grade: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: "grade-1",
            grade: "A",
            year: 1,
            date: new Date().toISOString(),
            course: {
              id: "course-1",
              name: "Engelska 5",
              subject: "English",
              yearOffered: 1,
            },
          },
        ]),
      },
    },
  };
});

import express from "express";
import request from "supertest";
import gradeRoutes from "../gradeRoutes";

const app = express();
app.use(express.json());

// Fake auth for tests so we don't depend on Firebase
app.use((req, _res, next) => {
  (req as any).user = {
    id: "test-user",
    firebaseUid: "firebase-123",
    email: "test@example.com",
    role: "STUDENT",
  };
  next();
});

// Mount your real routes under /api
app.use("/api", gradeRoutes);

describe("GET /api/me/grades", () => {
  it("returns 200 and an array of grades", async () => {
    const res = await request(app).get("/api/me/grades");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("grades");
    expect(Array.isArray(res.body.grades)).toBe(true);
    expect(res.body.grades[0].course.name).toBe("Engelska 5");
  });

  it("accepts a year filter", async () => {
    const res = await request(app).get("/api/me/grades?year=1");
    expect(res.status).toBe(200);
  });
});
