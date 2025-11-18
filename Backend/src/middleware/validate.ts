// src/middleware/validate.ts
import { ZodObject, ZodError, ZodRawShape } from "zod";
import { Request, Response, NextFunction } from "express";

export function validate(schema: {
  body?: ZodObject<ZodRawShape>;
  query?: ZodObject<ZodRawShape>;
  params?: ZodObject<ZodRawShape>;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Body can still be replaced
      if (schema.body) {
        (req as any).validatedBody = schema.body.parse(req.body);
      }

      // ❗️IMPORTANT: don't assign to req.query (read-only in Express 5)
      if (schema.query) {
        const parsed = schema.query.parse(req.query);
        (req as any).validatedQuery = parsed;
      }

      // Params we also stash separately
      if (schema.params) {
        (req as any).validatedParams = schema.params.parse(req.params);
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: "Validation error",
          details: err.flatten(),
        });
      }
      next(err);
    }
  };
}
