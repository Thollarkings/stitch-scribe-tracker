import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true, // Prevent automatic port switching
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate", // Automatically update service worker
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "StitchScribe Tracker",
        short_name: "StitchScribe",
        description: "An app for tailors to track measurements and invoices",
        theme_color: "#317EFB",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/stitch-scribe-tracker/",
        scope: "/stitch-scribe-tracker/",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenshots/screenshot1-wide.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "/screenshots/screenshot2.png",
            sizes: "640x1136",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      devOptions: {
        enabled: mode === "development", // Enable PWA in dev mode for testing
      },
    }),
  ].filter(Boolean),
  base: "/stitch-scribe-tracker/", // Critical for GitHub Pages deployment
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: mode === "development",
    chunkSizeWarningLimit: 1600,
  },
  preview: {
    port: 8080,
    strictPort: true,
  },
}));
