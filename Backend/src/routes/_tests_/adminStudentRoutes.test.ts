// src/routes/__tests__/adminStudentRoutes.test.ts

jest.mock("../../utils/prisma", () => {
  return {
    prisma: {
      student: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: "student-1",
            userId: "user-1",
            year: 1,
            personNr: "123456-7890",
            phoneNr: "0701234567",
            address: "Test Street 1",
            user: {
              email: "student@example.com",
            },
          },
        ]),
        upsert: jest.fn().mockResolvedValue({
          id: "student-1",
          userId: "user-1",
          year: 1,
          personNr: "123456-7890",
          phoneNr: "0701234567",
          address: "Test Street 1",
        }),
      },
      user: {
        findUnique: jest.fn(),
        upsert: jest.fn().mockResolvedValue({
          id: "user-1",
          email: "test@example.com",
          role: "STUDENT",
          firebaseUid: null,
        }),
      },
    },
  };
});

// Mock multer
jest.mock("multer", () => {
  const multer = () => ({
    single: () => (req: any, res: any, next: any) => {
      // Mock file upload - add a file to the request
      if (req.body && req.body.mockFile) {
        req.file = {
          buffer: Buffer.from(req.body.mockFile),
          originalname: "test.csv",
          mimetype: "text/csv",
        };
      }
      next();
    },
  });
  multer.memoryStorage = () => ({});
  return multer;
});

import express from "express";
import request from "supertest";
import adminStudentRoutes from "../adminStudentRoutes";
import { prisma } from "../../utils/prisma";

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

app.use("/api", adminStudentRoutes);

beforeEach(() => {
  jest.clearAllMocks();
  
  // Reset mocks to default behavior
  (prisma.user.upsert as jest.Mock).mockResolvedValue({
    id: "user-1",
    email: "test@example.com",
    role: "STUDENT",
    firebaseUid: null,
  });
  
  (prisma.student.upsert as jest.Mock).mockResolvedValue({
    id: "student-1",
    userId: "user-1",
    year: 1,
    personNr: "123456-7890",
    phoneNr: "0701234567",
    address: "Test Street 1",
  });
});

describe("GET /api/admin/students", () => {
  it("returns 200 and list of all students", async () => {
    const res = await request(app).get("/api/admin/students");
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("students");
    expect(Array.isArray(res.body.students)).toBe(true);
  });

  it("filters students by year 1", async () => {
    const res = await request(app).get("/api/admin/students?year=1");
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("students");
  });

  it("filters students by year 2", async () => {
    const res = await request(app).get("/api/admin/students?year=2");
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("students");
  });

  it("filters students by year 3", async () => {
    const res = await request(app).get("/api/admin/students?year=3");
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("students");
  });

  it("returns all students when no year filter is provided", async () => {
    const res = await request(app).get("/api/admin/students");
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("students");
  });

  it("handles database errors gracefully", async () => {
    (prisma.student.findMany as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    const res = await request(app).get("/api/admin/students");
    
    expect(res.status).toBe(500);
  });
});

describe("POST /api/admin/students/import-csv", () => {
  it("returns 400 when no file is uploaded", async () => {
    const res = await request(app)
      .post("/api/admin/students/import-csv");
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toContain("No file uploaded");
  });

  it("successfully imports valid CSV data", async () => {
    const csvContent = `email,year,personNr,phoneNr,address
test@example.com,1,123456-7890,0701234567,Test Street 1`;

    const res = await request(app)
      .post("/api/admin/students/import-csv")
      .send({ mockFile: csvContent });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("imported");
    expect(res.body).toHaveProperty("skipped");
    expect(res.body).toHaveProperty("total");
  });

  it("returns 400 for empty CSV", async () => {
    const csvContent = `email,year`;

    const res = await request(app)
      .post("/api/admin/students/import-csv")
      .send({ mockFile: csvContent });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("empty");
  });

  it("returns 400 when required columns are missing", async () => {
    const csvContent = `name,age
John,25`;

    const res = await request(app)
      .post("/api/admin/students/import-csv")
      .send({ mockFile: csvContent });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("email");
  });

  it("skips rows with invalid year", async () => {
    const csvContent = `email,year
test@example.com,5
valid@example.com,1`;

    const res = await request(app)
      .post("/api/admin/students/import-csv")
      .send({ mockFile: csvContent });

    expect(res.status).toBe(201);
    expect(res.body.imported).toBe(1);
    expect(res.body.skipped).toBe(1);
  });
  it("handles database errors during import", async () => {
    (prisma.user.upsert as jest.Mock)
      .mockRejectedValueOnce(new Error("Database constraint violation"));

    const csvContent = `email,year
test@example.com,1`;

    const res = await request(app)
      .post("/api/admin/students/import-csv")
      .send({ mockFile: csvContent });

    expect(res.status).toBe(400);
    expect(res.body.skipped).toBe(1);
    expect(res.body.imported).toBe(0);
  });
});