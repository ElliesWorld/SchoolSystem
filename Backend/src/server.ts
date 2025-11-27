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
    origin: "http://localhost:5173",
    credentials: false,
  })
);

app.use(express.json());

// Simple debug endpoint so we know this exact server is running
app.get("/debug-courses", (_req, res) => {
  res.json({ msg: "Hello from THIS server.ts" });
});

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api", gradeRoutes); // 👈 /api/me/grades, /api/admin/grades, /api/admin/courses
app.use("/api", adminStudentRoutes); // 👈 /api/admin/students, CSV import etc.

// Error handler
app.use(errorHandler);

const port = Number(env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
