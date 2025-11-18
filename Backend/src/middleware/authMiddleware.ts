// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";

export type UserRole = "STUDENT" | "ADMIN";

export interface AuthUser {
  id: string;
  firebaseUid: string | null;
  email: string;
  role: UserRole;
}

/**
 * requireAuth – demo implementation
 * Always attaches a demo STUDENT user and never returns 401.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const demoUser: AuthUser = {
    id: "demo-student-id",
    firebaseUid: "demo-firebase-uid",
    email: "student@example.com",
    role: "STUDENT",
  };

  (req as any).user = demoUser;
  next();
}

/**
 * requireAdmin – demo implementation
 * Always attaches a demo ADMIN user and never returns 401/403.
 */
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const demoAdmin: AuthUser = {
    id: "demo-admin-id",
    firebaseUid: null,
    email: "admin@example.com",
    role: "ADMIN",
  };

  (req as any).user = demoAdmin;
  next();
}
