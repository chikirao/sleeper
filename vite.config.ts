import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/sleeper/",
  build: {
    rollupOptions: {
      input: {
        index: "vite.index.html",
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.some((name) => name.endsWith(".css"))) {
            return "assets/index.css";
          }

          return "assets/[name][extname]";
        },
        chunkFileNames: "assets/[name].js",
        entryFileNames: "assets/index.js",
      },
    },
  },
  plugins: [react()],
});
