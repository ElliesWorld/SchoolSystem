// jest.config.cjs
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],

  // Look for ANY *.test.ts or *.spec.ts under src/
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",

  moduleFileExtensions: ["ts", "js", "json"],
};
