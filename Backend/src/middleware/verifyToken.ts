// src/middleware/verifyToken.ts
import { Request, Response, NextFunction } from "express";

export function verifyToken(_req: Request, _res: Response, next: NextFunction) {
  // Do nothing, just continue
  next();
}
