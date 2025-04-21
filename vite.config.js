import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: parseInt(process.env.VITE_PORT) || 3000, // Menggunakan VITE_PORT dari .env
  },
  plugins: [react()],
});
