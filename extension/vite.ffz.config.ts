import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        ffzContent: "src/ffzContent.ts",
        ffzIntegration: "src/ffzIntegration.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
    emptyOutDir: false,
  },
});