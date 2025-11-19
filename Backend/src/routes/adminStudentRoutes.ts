// src/routes/adminStudentRoutes.ts
import { Router } from "express";
import multer from "multer"; // Config for Excel files
import { parse } from "csv-parse/sync";
import { z } from "zod";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { prisma } from "../utils/prisma";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

//GET /api/admin/students?year=1

const studentsQuerySchema = z.object({
  year: z
    .string()
    .transform((v) => (v ? Number(v) : undefined))
    .optional(),
});

router.get(
  "/admin/students",
  validate({ query: studentsQuerySchema }),
  async (req, res, next) => {
    try {
      const { year } = (req as any).validatedQuery ?? {};

      const students = await prisma.student.findMany({
        where: year ? { year } : {},
        include: {
          user: {
            select: { email: true },
          },
        },
        orderBy: {
          user: { email: "asc" },
        },
      });

      res.json({ students });
    } catch (err) {
      next(err);
    }
  }
);

//CSV import: POST /api/admin/students/import-csv -

router.post(
  "/admin/students/import-csv",
  requireAuth,
  requireAdmin,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: "CSV file (field 'file') is required" });
      }

      const content = req.file.buffer.toString("utf-8");

      // Example CSV headers: fullName,email,personNr,phoneNr,address,year
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }) as Array<{
        fullName: string;
        email: string;
        personNr: string;
        phoneNr: string;
        address: string;
        year: string;
      }>;

      for (const row of records) {
        const year = Number(row.year || "1");

        const user = await prisma.user.upsert({
          where: { email: row.email },
          update: {},
          create: {
            email: row.email,
            role: "STUDENT",
            firebaseUid: null,
          },
        });

        await prisma.student.upsert({
          where: { userId: user.id },
          update: {
            year,
            personNr: row.personNr,
            phoneNr: row.phoneNr,
            address: row.address,
          },
          create: {
            userId: user.id,
            year,
            personNr: row.personNr,
            phoneNr: row.phoneNr,
            address: row.address,
          },
        });
      }

      res.status(201).json({ imported: records.length });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
