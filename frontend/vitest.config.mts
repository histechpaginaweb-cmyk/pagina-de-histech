import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Lets tests import modules that contain JSX (e.g. lib/seo.tsx) without React in scope.
  oxc: { jsx: { runtime: "automatic" } },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
