import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Se houver aliases, eles iriam aqui. Por enquanto, não é necessário.
    },
  },
  server: {
    host: '0.0.0.0', 
    port: 5173,      
  },
  optimizeDeps: {
    force: true, 
  },
  css: {
    postcss: './postcss.config.js', 
  },
  // build: {
  //   sourcemap: true, 
  // },
});
