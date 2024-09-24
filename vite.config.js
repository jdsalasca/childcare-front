import react from '@vitejs/plugin-react';
import path from 'path'; // Import path module
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
// Simulate __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
      // Correct alias setup for "types"
      'types': path.resolve(__dirname, './src/types'),  // This resolves "types" to "src/types"
      'configs': path.resolve(__dirname, './src/configs'),  // This resolves "config" to "src/configs"
      "components": path.resolve(__dirname, "./src/components"),
    },
  },
  define: {
    'process.env': {},
  },
  server: {
    port: 3000,
  },
  base: '/childadmin/admin/',  // Ensure this matches your deployment path
});
