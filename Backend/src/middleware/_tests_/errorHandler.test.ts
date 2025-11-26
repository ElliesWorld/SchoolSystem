// src/middleware/__tests__/errorHandler.test.ts

import { Request, Response } from "express";
import { errorHandler } from "../errorHandler";
import { z } from "zod";

describe("errorHandler", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    // Suppress console.error during tests
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("handles Zod validation errors with 400", () => {
    const zodError = new z.ZodError([
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["email"],
        message: "Expected string, received number",
      },
    ]);

    errorHandler(
      zodError,
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Validation error",
      })
    );
  });

  it("handles generic errors with 500 in production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const error = new Error("Something went wrong");

    errorHandler(
      error,
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockRes.status).toHaveBeenCalledWith(500);
    // FIXED: In production, it returns generic "Internal Server Error"
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Internal Server Error", // Changed from "Something went wrong"
      })
    );

    process.env.NODE_ENV = originalEnv;
  });

  it("includes error message in non-production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const error = new Error("Test error");

    errorHandler(
      error,
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Test error",
      })
    );

    process.env.NODE_ENV = originalEnv;
  });

  it("includes stack trace in development", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const error = new Error("Test error");

    errorHandler(
      error,
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stack: expect.any(String),
      })
    );

    process.env.NODE_ENV = originalEnv;
  });
});