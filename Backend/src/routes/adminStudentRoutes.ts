// src/routes/adminStudentRoutes.ts 
import { Router } from "express";
import multer from "multer";
import { parse } from "csv-parse/sync";
import { z } from "zod";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { prisma } from "../utils/prisma";

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * @swagger
 * /api/admin/students:
 *   get:
 *     summary: Retrieve all students
 *     description: Retrieve a list of all students, optionally filtered by year
 *     tags: [Admin - Students]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 3
 *         required: false
 *         description: Filter students by year (1, 2, or 3)
 *     responses:
 *       200:
 *         description: A list of students
 */

// GET /api/admin/students?year=1
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

/**
 * @swagger
 * /api/admin/students/import-csv:
 *   post:
 *     summary: Import students from CSV
 *     description: Bulk import or update students from a CSV file (admin only)
 *     tags: [Admin - Students]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file containing student data
 *     responses:
 *       201:
 *         description: Students imported successfully
 *       400:
 *         description: Invalid CSV file or format
 */

// CSV import: POST /api/admin/students/import-csv
router.post(
  "/admin/students/import-csv",
  requireAuth,
  requireAdmin,
  upload.single("file"),
  async (req, res, next) => {
    try {
      console.log("CSV import endpoint hit");

      if (!req.file) {
        console.error("No file in request");
        return res.status(400).json({ 
          error: "No file uploaded. Please select a CSV file." 
        });
      }

      // Get file content and clean it
      let content = req.file.buffer.toString("utf-8");
      
      // Remove BOM if present
      content = content.replace(/^\uFEFF/, '');
      
      // Normalize line endings
      content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      
      console.log("📄 File content preview:", content.substring(0, 200));

      // Parse CSV with more lenient options
      let records;
      try {
        records = parse(content, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
          relax_column_count: true, // ✅ Allow varying column counts
          skip_records_with_error: true, // ✅ Skip bad rows instead of failing
        }) as Array<{
          fullName?: string;
          email?: string;
          personNr?: string;
          phoneNr?: string;
          address?: string;
          year?: string;
        }>;
      } catch (parseError: any) {
        console.error("❌ CSV parse error:", parseError.message);
        return res.status(400).json({ 
          error: `CSV parsing failed: ${parseError.message}`,
          hint: "Check that your CSV has these columns: fullName,email,personNr,phoneNr,address,year"
        });
      }

      console.log(`📊 Parsed ${records.length} records`);

      // Validate required columns
      if (records.length === 0) {
        return res.status(400).json({ 
          error: "CSV file is empty or has no valid rows" 
        });
      }

      const firstRecord = records[0];
      if (!firstRecord.email || !firstRecord.year) {
        return res.status(400).json({ 
          error: "CSV must have at least 'email' and 'year' columns",
          received: Object.keys(firstRecord)
        });
      }

      // Process each record
      let imported = 0;
      let skipped = 0;
      const errors: string[] = [];

      for (let i = 0; i < records.length; i++) {
        const row = records[i];
        
        try {
          // Validate required fields
          if (!row.email || !row.year) {
            skipped++;
            errors.push(`Row ${i + 2}: Missing email or year`);
            continue;
          }

          const year = Number(row.year);
          if (isNaN(year) || year < 1 || year > 3) {
            skipped++;
            errors.push(`Row ${i + 2}: Invalid year "${row.year}"`);
            continue;
          }

          // Create or update user
          const user = await prisma.user.upsert({
            where: { email: row.email.trim().toLowerCase() },
            update: {},
            create: {
              email: row.email.trim().toLowerCase(),
              role: "STUDENT",
              firebaseUid: null,
            },
          });

          // Create or update student
          await prisma.student.upsert({
            where: { userId: user.id },
            update: {
              year,
              personNr: row.personNr?.trim() || null,
              phoneNr: row.phoneNr?.trim() || null,
              address: row.address?.trim() || null,
            },
            create: {
              userId: user.id,
              year,
              personNr: row.personNr?.trim() || null,
              phoneNr: row.phoneNr?.trim() || null,
              address: row.address?.trim() || null,
            },
          });

          imported++;
          console.log(`✅ Row ${i + 2}: Imported ${row.email}`);
        } catch (rowError: any) {
          skipped++;
          const errorMsg = `Row ${i + 2} (${row.email}): ${rowError.message}`;
          console.error(`❌ ${errorMsg}`);
          errors.push(errorMsg);
        }
      }

      console.log(`✅ Import complete: ${imported} imported, ${skipped} skipped`);
      
      res.status(imported > 0 ? 201 : 400).json({ 
        imported, 
        skipped,
        total: records.length,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (err: any) {
      console.error("❌ CSV import error:", err);
      res.status(500).json({ 
        error: err.message || "Failed to import CSV",
        details: process.env.NODE_ENV !== "production" ? err.stack : undefined
      });
    }
  }
);

export default router;