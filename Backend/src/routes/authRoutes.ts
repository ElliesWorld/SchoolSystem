// src/routes/authRoutes.ts
import { Router } from "express";
import { prisma } from "../utils/prisma";

const router = Router();

/**
 * POST /api/auth/verify-student
 * Body: { email: string }
 * Checks if the email belongs to a USER with role STUDENT
 * and that there is a linked Student record.
 */
router.post("/auth/verify-student", async (req, res) => {
  try {
    const { email } = req.body as { email?: string };

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Look up user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || user.role !== "STUDENT") {
      return res
        .status(403)
        .json({ error: "Not authorized as student (role mismatch)" });
    }

    // Optional: ensure there is an associated Student row
    const student = await prisma.student.findUnique({
      where: { userId: user.id },
    });

    if (!student) {
      return res
        .status(403)
        .json({ error: "Not authorized as student (no student record)" });
    }

    // All good
    return res.json({ ok: true });
  } catch (err) {
    console.error("verify-student error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error during verify-student" });
  }
});

export default router;
