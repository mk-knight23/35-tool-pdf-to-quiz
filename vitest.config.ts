import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "json-summary"],
      include: ["src/lib/**/*.ts"],
      // Browser/network-only runtime modules are exercised by the Playwright
      // smoke suite, not unit tests: pdf.js extraction, Web Audio effects,
      // and the streaming AI client. Everything else is covered here.
      exclude: [
        "src/lib/pdf.ts",
        "src/lib/audio.ts",
        "src/lib/ai/client.ts",
        "src/lib/**/*.test.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
});
