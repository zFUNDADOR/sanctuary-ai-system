import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Garante que o Vite use 0.0.0.0 para ser acessível externamente no Replit
    port: 5173, // Ou a porta que você deseja que o Vite use
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Aponta para o seu backend Flask
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
    // *** ADICIONE ESTA LINHA ABAIXO ***
    allowedHosts: [
      '75a285a0-6dd9-4925-be34-14cafe76d053-00-6dzwfqrdfad7.janeway.replit.dev',
      '.replit.dev' // Adiciona o domínio curinga do Replit para cobrir futuras mudanças
    ],
  },
})