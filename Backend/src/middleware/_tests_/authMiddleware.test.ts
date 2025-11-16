// src/middleware/__tests__/authMiddleware.test.ts

jest.mock("../../utils/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("../../config/firebase", () => ({
  // Force demo mode: no Firebase app configured
  getFirebaseApp: () => null,
}));

import { Request, Response } from "express";
import { requireAuth } from "../authMiddleware";

describe("requireAuth", () => {
  it("sets demo user and calls next when Firebase is not configured", async () => {
    const req = {
      header: () => undefined,
    } as unknown as Request;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as Response;

    const next = jest.fn();

    await requireAuth(req, res, next);

    // Assert it called next()
    expect(next).toHaveBeenCalled();

    // Assert it set a demo user
    const user = (req as any).user;
    expect(user).toBeDefined();
    expect(user.email).toBe("anna@example.com");
    expect(user.role).toBe("STUDENT");
  });
});
