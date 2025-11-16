// src/types/express.d.ts
import "express";

declare global {
  namespace Express {
    type UserRole = "STUDENT" | "ADMIN";

    interface UserPayload {
      id: string;
      firebaseUid: string | null;
      email: string;
      role: UserRole;
    }

    // This merges into Express.Request
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
