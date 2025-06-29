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
  // NOVO: Adiciona a opção de CSS para garantir o processamento correto
  css: {
    postcss: './postcss.config.js', // Garante que o PostCSS (com Tailwind) seja usado
  },
  // build: {
  //   sourcemap: true, 
  // },
});
