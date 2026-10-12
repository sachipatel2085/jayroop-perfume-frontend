import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Rolldown chunk groups (higher priority wins). The admin-only rich editor never loads on the storefront.
        advancedChunks: {
          groups: [
            { name: 'vendor-react', test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/, priority: 30 },
            { name: 'vendor-editor', test: /[\\/]node_modules[\\/](@tiptap|prosemirror-[^\\/]+|linkifyjs|@floating-ui|orderedmap|rope-sequence|w3c-keyname)[\\/]/, priority: 20 },
            { name: 'vendor-icons', test: /[\\/]node_modules[\\/]lucide-react[\\/]/, priority: 10 },
            { name: 'vendor-libs', test: /[\\/]node_modules[\\/](axios|@tanstack)[\\/]/, priority: 5 },
          ],
        },
      },
    },
  },
});
