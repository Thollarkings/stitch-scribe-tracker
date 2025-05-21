import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true // Prevent automatic port switching
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger()
  ].filter(Boolean),
  base: '/', // Critical for GitHub Pages
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true, // Clear dist folder before build
    sourcemap: mode === 'development', // Only in dev
    chunkSizeWarningLimit: 1600, // Adjust based on your needs
  },
  preview: {
    port: 8080, // Match dev server port
    strictPort: true
  }
}));