module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: process.cwd(),
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/tests/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)" ],
  testPathIgnorePatterns: [
    "<rootDir>/tests/unit/models/TestUser.ts",
    "<rootDir>/dist/"
  ]

};