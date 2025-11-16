// src/server.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import { env } from "./config/env";
import gradeRoutes from "./routes/gradeRoutes";
import adminStudentRoutes from "./routes/adminStudentRoutes";
import { errorHandler } from "./middleware/errorHandler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend dev URL
    credentials: false,
  })
);

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/debug-me-grades", (_req, res) => {
  res.json({ from: "server.ts debug route" });
});

// API routes
app.use("/api", gradeRoutes); // /api/me/grades, /api/admin/grades
app.use("/api", adminStudentRoutes); // /api/admin/students, /import-csv, etc.

// Error handler
app.use(errorHandler);

const port = Number(env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
