// src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "School System API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.ts"], // We'll use JSDoc comments in route files
});
