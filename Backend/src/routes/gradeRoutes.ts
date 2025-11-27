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

console.log("✅ gradeRoutes.ts loaded");

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
<<<<<<< Updated upstream
 * @swagger
 * /api/admin/grades:
 *   get:
 *     summary: Retrieve grades for a course
 *     description: Retrieve all student grades for a specific course and year (admin only)
 *     tags: [Admin - Grades]
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3]
 *         description: Academic year (1, 2, or 3)
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID (e.g., "course-1")
 *     responses:
 *       200:
 *         description: A list of student grades
=======
 * ADMIN: GET /api/admin/grades
>>>>>>> Stashed changes
 */

const adminGradesQuerySchema = z.object({
  year: z
    .string()
    .regex(/^[1-3]$/, "Year must be 1, 2, or 3")
    .transform((v) => Number(v)),
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
<<<<<<< Updated upstream
 * @swagger
 * /api/admin/grades:
 *   post:
 *     summary: Set or update a student grade
 *     description: Create or update a grade for a student in a specific course (admin only)
 *     tags: [Admin - Grades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - courseId
 *               - grade
 *               - year
 *             properties:
 *               studentId:
 *                 type: string
 *                 description: Student ID
 *               courseId:
 *                 type: string
 *                 description: Course ID
 *               grade:
 *                 type: string
 *                 enum: [A, B, C, D, E, F]
 *                 description: Letter grade to assign
 *               year:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 3
 *                 description: Academic year
 *           example:
 *             studentId: "student-123"
 *             courseId: "course-1"
 *             grade: "A"
 *             year: 1
 *     responses:
 *       201:
 *         description: Grade created or updated successfully
=======
 * ADMIN: POST /api/admin/grades
>>>>>>> Stashed changes
 */

const adminGradesBodySchema = z.object({
  studentId: z.string(),
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

<<<<<<< Updated upstream
export default router;
=======
/**
 * ADMIN: GET /api/admin/courses
 * ✅ THIS IS THE ROUTE YOUR FRONTEND IS CALLING
 */

router.get(
  "/admin/courses",
  requireAuth,
  requireAdmin,
  async (_req, res, next) => {
    console.log("✅ /api/admin/courses handler reached");
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
>>>>>>> Stashed changes
