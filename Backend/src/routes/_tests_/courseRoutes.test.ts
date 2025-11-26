// src/routes/__tests__/courseRoutes.test.ts

jest.mock("../../utils/prisma", () => {
  return {
    prisma: {
      course: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: "course-1",
            name: "Engelska 5",
            subject: "English",
            yearOffered: 1,
            description: "English course",
          },
        ]),
      },
    },
  };
});

import express from "express";
import request from "supertest";
import courseRoutes from "../courseRoutes";

const app = express();
app.use(express.json());

// Mock admin user
app.use((req, _res, next) => {
  (req as any).user = {
    id: "admin-user",
    email: "admin@example.com",
    role: "ADMIN",
  };
  next();
});

app.use("/api", courseRoutes);

describe("GET /api/admin/courses", () => {
  it("returns 200 and list of all courses", async () => {
    const res = await request(app).get("/api/admin/courses");
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("courses");
    expect(Array.isArray(res.body.courses)).toBe(true);
    expect(res.body.courses[0].name).toBe("Engelska 5");
  });
});