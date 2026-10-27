import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          icons: ['lucide-react'],
          gifting: ['qrcode', 'canvas-confetti']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
