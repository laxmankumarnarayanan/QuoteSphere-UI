import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@template": path.resolve(dirname(fileURLToPath(import.meta.url)), "./src/template components/components"),
      "@sections": path.resolve(dirname(fileURLToPath(import.meta.url)), "./src/screens/DealCreationLayer/sections"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
});
