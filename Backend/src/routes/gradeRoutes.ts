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

const router = Router();

// ----------------- STUDENT: GET /api/me/grades -----------------

const gradesQuerySchema = z.object({
  year: z
    .string()
    .transform((v) => (v ? Number(v) : undefined))
    .optional(),
  subject: z.string().optional(),
});

// *** ONLY ONE /me/grades ROUTE, NO verifyToken, NO requireAuth ***
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

// ----------------- ADMIN: /api/admin/grades -----------------

const adminGradesQuerySchema = z.object({
  year: z
    .string()
    .transform((v) => Number(v))
    .optional(),
  courseId: z.string().uuid(),
});

router.get(
  "/admin/grades",
  requireAuth,
  requireAdmin,
  validate({ query: adminGradesQuerySchema }),
  async (req, res, next) => {
    try {
      const { year, courseId } = (req as any).validatedQuery ?? {};
      const yearNum = Number(year);
      const rows = await getRegisterGradesView(yearNum, courseId);
      res.json({ rows });
    } catch (err) {
      next(err);
    }
  }
);

const adminGradesBodySchema = z.object({
  studentId: z.string().uuid(),
  courseId: z.string().uuid(),
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

export default router;
