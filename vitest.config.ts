// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: [],
    coverage: { reporter: ["text", "lcov"], enabled: false },
    include: ["src/**/*.{test,spec}.ts?(x)"], // only look in src for unit tests
    exclude: [
      "node_modules",
      "dist",
      "tests/e2e/**",   // <-- ignore Playwright E2E
      "**/*.e2e.*"      // <-- if you later rename specs as *.e2e.spec.ts
    ]
  }
});
