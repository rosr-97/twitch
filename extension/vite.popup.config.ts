import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        content: "popup.js",
      },
      output: {
        inlineDynamicImports: true,
        entryFileNames: "popup.js",
      },
    },
    emptyOutDir: false,
  },
});
