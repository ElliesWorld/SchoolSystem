// src/routes/gradeRoutes.ts
import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import {
  getStudentGrades,
  getRegisterGradesView,
  setGrade,
} from "../services/gradeService";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware";
import { prisma } from "../utils/prisma";

const router = Router();

/**
 * STUDENT: GET /api/me/grades
 */

const gradesQuerySchema = z.object({
  year: z
    .string()
    .transform((v) => (v ? Number(v) : undefined))
    .optional(),
  subject: z.string().optional(),
});

router.get(
  "/me/grades",
  requireAuth,
  validate({ query: gradesQuerySchema }),
  async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const firebaseUid = user.firebaseUid ?? "demo-firebase-uid";

      const { year, subject } = (req as any).validatedQuery ?? {};

      const grades = await getStudentGrades({
        firebaseUid,
        year,
        subject,
      });

      return res.json({ grades });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * ADMIN: GET /api/admin/grades
 * (used by Register Grades page)
 */

const adminGradesQuerySchema = z.object({
  year: z
    .string()
    .regex(/^[1-3]$/, "Year must be 1, 2, or 3")
    .transform((v) => Number(v)),
  // IMPORTANT: courseId is just a string like "course-1", not a UUID
  courseId: z.string(),
});

router.get(
  "/admin/grades",
  requireAuth,
  requireAdmin,
  validate({ query: adminGradesQuerySchema }),
  async (req, res, next) => {
    try {
      const { year, courseId } = (req as any).validatedQuery ?? {};
      const rows = await getRegisterGradesView(year, courseId);
      res.json({ rows });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * ADMIN: POST /api/admin/grades
 * (save a grade)
 */

const adminGradesBodySchema = z.object({
  // studentId comes from Prisma, so it *is* a UUID
  studentId: z.string().uuid(),
  // courseId is like "course-1" from your seed, so no UUID check
  courseId: z.string(),
  grade: z.enum(["A", "B", "C", "D", "E", "F"]),
  year: z.number().int().min(1).max(3),
});

router.post(
  "/admin/grades",
  requireAuth,
  requireAdmin,
  validate({ body: adminGradesBodySchema }),
  async (req, res, next) => {
    try {
      const { studentId, courseId, grade, year } = req.body;
      const result = await setGrade({ studentId, courseId, grade, year });
      res.status(201).json({ grade: result });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * ADMIN: GET /api/admin/courses
 * (used by Register Grades to populate the course dropdown)
 */

router.get(
  "/admin/courses",
  requireAuth,
  requireAdmin,
  async (_req, res, next) => {
    try {
      const courses = await prisma.course.findMany({
        orderBy: [{ yearOffered: "asc" }, { subject: "asc" }, { name: "asc" }],
      });

      res.json({ courses });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
