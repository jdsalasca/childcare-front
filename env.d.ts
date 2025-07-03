/// <reference types="vite/client" />

interface ImportMeta {
    readonly env: {
      readonly VITE_ENV: string; // Add other environment variables as needed
      readonly VITE_BASE_URL: string; // Base URL for the API
    };
  }
  