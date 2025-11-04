import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // --- ADICIONE ESTE BLOCO ---
  server: {
    proxy: {
      // Qualquer requisição que comece com '/api'
      '/api': {
        target: 'http://localhost:4000', // O endereço do seu backend
        changeOrigin: true, // Necessário para o proxy funcionar
        secure: false,      // Se o seu backend roda em http
      }
    }
  }
  // --- FIM DO BLOCO ---
})
