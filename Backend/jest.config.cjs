module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
  moduleFileExtensions: ["ts", "js", "json"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/server.ts",
    "!src/config/**",
    "!src/utils/prisma.ts",
    "!src/middleware/verifyToken.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
   silent: true, 
};