import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Specify the port you want to use
  },
});