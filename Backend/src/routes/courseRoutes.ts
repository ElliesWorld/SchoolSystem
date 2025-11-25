// src/routes/courseRoutes.ts
import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware";
import { prisma } from "../utils/prisma";

const router = Router();

/**
 * @swagger
 * /api/admin/courses:
 *   get:
 *     summary: Retrieve all courses
 *     description: Retrieve a list of all courses in the system
 *     tags: [Admin - Courses]
 *     responses:
 *       200:
 *         description: A list of courses
 */

// GET /api/admin/courses - Get all courses
/*router.get(
  "/admin/courses",
  requireAuth,
  requireAdmin,
  async (req, res, next) => {
    try {
      const courses = await prisma.course.findMany({
        orderBy: [{ yearOffered: "asc" }, { subject: "asc" }, { name: "asc" }],
      });

      res.json({ courses });
    } catch (err) {
      next(err);
    }
  }
);*/

router.get(
  "/admin/courses",
  requireAuth,
  requireAdmin,
  (req, res, next) => {
    console.log("🎯 /api/admin/courses hit by:", (req as any).user);
    next();
  },
  async (req, res, next) => {
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
