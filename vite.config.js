import react from '@vitejs/plugin-react';
import path from 'path'; // Import path module
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
// Simulate __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    logLevel: 'warn',
    resolve: {
      alias: {
        process: 'process/browser',
        stream: 'stream-browserify',
        util: 'util',
        // Correct alias setup for "types"
        types: path.resolve(__dirname, './src/types'), // This resolves "types" to "src/types"
        configs: path.resolve(__dirname, './src/configs'), // This resolves "config" to "src/configs"
        components: path.resolve(__dirname, './src/components'),
        models: path.resolve(__dirname, './src/models'),
        '@models': path.resolve(__dirname, './src/models'),
        '@components': path.resolve(__dirname, './src/components'),
        '@utils': path.resolve(__dirname, './src/utils'),
        utils: path.resolve(__dirname, './src/utils'),
      },
    },
    define: {
      'process.env': process.env,
    },
    build: {
      chunkSizeWarningLimit: 1000, // Increase the warning limit to 1000 kB
    },
    server: {
      port: 3000,
    },
    base: '/childadmin/admin/', // Base path for the application
  };
});
