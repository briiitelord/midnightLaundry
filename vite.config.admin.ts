import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Admin dashboard dev server configuration
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5174,
    strictPort: false,
    // automatically open the admin page when running the admin dev server
    open: '/admin.html',
  },
  build: {
    rollupOptions: {
      input: 'admin.html',
    },
  },
});
