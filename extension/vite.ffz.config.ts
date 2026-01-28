import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        ffzIntegration: "src/ffzIntegration.ts",
        ffzAddon: "src/ffzAddon.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
    emptyOutDir: false,
  },
});