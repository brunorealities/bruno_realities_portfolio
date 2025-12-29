import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    base: '/', // Mantém a raiz para a Vercel
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      // Removemos o manualChunks complexo para que o React e o Three fiquem juntos
      chunkSizeWarningLimit: 2000,
    }
  };
});