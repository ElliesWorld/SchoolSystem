// src/@types/express/index.d.ts

import "express";

declare module "express-serve-static-core" {
  interface AuthUser {
    id: string;
    firebaseUid: string | null;
    email: string;
    role: "STUDENT" | "ADMIN";
  }

  interface Request {
    user?: AuthUser;
  }
}
