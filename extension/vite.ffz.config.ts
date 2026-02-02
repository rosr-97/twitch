import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        ffzIntegration: "src/ffzIntegration.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
    emptyOutDir: false,
  },
});