import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        content: "src/ffz-content.ts",
      },
      output: {
        inlineDynamicImports: true,
        entryFileNames: "ffz-content.js", // Forces simple names: background.js, content.js
      },
    },
    emptyOutDir: false,
  },
});