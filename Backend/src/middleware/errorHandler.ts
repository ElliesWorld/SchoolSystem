// src/middleware/errorHandler.ts
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("🔥 Global error handler caught:", err);

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation error",
      details: err.flatten(),
    });
  }

  // If it's already an HTTP-style error we manually created somewhere
  if (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "message" in err
  ) {
    const httpErr = err as { status: number; message: string };
    return res.status(httpErr.status).json({ error: httpErr.message });
  }

  // Prisma or other unknown errors
  const anyErr = err as any;
  const message = anyErr?.message ?? "Internal Server Error";

  // In dev, send the message so you can see what's wrong
  if (process.env.NODE_ENV !== "production") {
    return res.status(500).json({
      error: message,
      stack: anyErr?.stack,
    });
  }

  // In production, hide details
  return res.status(500).json({ error: "Internal Server Error" });
}
