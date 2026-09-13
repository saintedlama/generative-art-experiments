import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        hexagons: resolve(import.meta.dirname, "hexagons.html"),
        robots: resolve(import.meta.dirname, "robots.html"),
        areas: resolve(import.meta.dirname, "areas.html"),
        pixelCharacters: resolve(import.meta.dirname, "pixel-characters.html"),
      },
    },
  },
});
