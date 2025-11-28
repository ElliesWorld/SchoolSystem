// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import "../config/firebase"; // <- initialize firebase
import { prisma } from "../utils/prisma";

export type UserRole = "STUDENT" | "ADMIN";

export interface AuthUser {
  id: string;
  firebaseUid: string;
  email: string;
  role: UserRole;
}

/**
 * requireAuth
 * - reads Firebase ID token from Authorization: Bearer <token>
 * - verifies it with Firebase Admin
 * - looks up the matching user in Prisma by firebaseUid
 * - attaches the full user (including student relation) to req.user
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Missing auth token" });
    }

    // Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(token);

    // Find user in our DB by firebaseUid
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      include: { student: true }, // 👈 so routes can check student profile if needed
    });

    if (!user) {
      return res
        .status(403)
        .json({ error: "User not found in database for this Firebase UID" });
    }

    // Attach to req so routes can use it
    (req as any).user = user;

    next();
  } catch (err) {
    console.error("requireAuth error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * requireAdmin
 * - uses requireAuth logic AND enforces role === ADMIN
 */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // First ensure the user is authenticated
    await requireAuth(req, res, async (authErr?: any) => {
      if (authErr) return next(authErr);

      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      if (user.role !== "ADMIN") {
        return res.status(403).json({ error: "Admin access required" });
      }

      next();
    });
  } catch (err) {
    console.error("requireAdmin error:", err);
    return res.status(500).json({ error: "Internal auth error" });
  }
}
