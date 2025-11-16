// src/middleware/verifyToken.ts
import { Request, Response, NextFunction } from "express";

/**
 * DEMO verifyToken
 * For the school project we do NOT reject requests because of tokens.
 * This middleware just lets the request pass through.
 */
export function verifyToken(_req: Request, _res: Response, next: NextFunction) {
  // Do nothing, just continue
  next();
}
