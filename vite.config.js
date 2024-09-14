import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
  ],
  logLevel: 'warn',
  resolve: {
    alias: {
      process: 'process/browser',
      stream: 'stream-browserify',
      util: 'util',
      // Add other aliases as needed
    },
  },
  define: {
    'process.env': {},
  },
  server: {
    port: 3000,
  },
});
