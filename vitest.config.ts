/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vite';
import { defineConfig as defineVitestConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Simulate __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        process: 'process/browser',
        stream: 'stream-browserify',
        util: 'util',
        types: path.resolve(__dirname, './src/types'),
        configs: path.resolve(__dirname, './src/configs'),
        components: path.resolve(__dirname, './src/components'),
        models: path.resolve(__dirname, './src/models'),
        '@models': path.resolve(__dirname, './src/models'),
        '@components': path.resolve(__dirname, './src/components'),
        '@utils': path.resolve(__dirname, './src/utils'),
        utils: path.resolve(__dirname, './src/utils'),
      },
    },
    define: {
      'process.env': {},
    },
  }),
  defineVitestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true,
      reporters: ['verbose'],
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.js',
          '**/*.config.ts',
          'dist/',
          'build/',
          'coverage/',
          'public/',
          'src/reportWebVitals.js',
          'src/index.jsx',
          'src/setupTests.js',
        ],
        thresholds: {
          global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
          },
        },
      },
    },
  })
);
