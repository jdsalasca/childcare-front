/** @type {import('tailwindcss').Config} */

import { nextui } from '@nextui-org/react';
export default {
  
  content: [
    ".public/index.html",
    // Or if using `src` directory:
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx,mdx}",
    ".src/**/*.{js,ts,jsx,tsx,mdx}",
    './node_modules/@nextui-org/react/**/*.{js,ts,jsx,tsx}' // Include NextUI components
 
  ],
  safelist: [
    'gap-3',
    'gap-y-3',
    {
      pattern: /^max-w-/,
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [
    nextui() // Use the NextUI plugin
  ],
}