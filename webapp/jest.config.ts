/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest",

  // e2e/ holds Playwright browser tests (run via `npm run test:e2e`), not Jest tests
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/e2e/"],
};

export default config;
