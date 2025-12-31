import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        content: "src/ffz-integration.ts",
      },
      output: {
        inlineDynamicImports: true,
        entryFileNames: "ffz-integration.js", // Forces simple names: background.js, content.js
      },
    },
    emptyOutDir: false,
  },
});
