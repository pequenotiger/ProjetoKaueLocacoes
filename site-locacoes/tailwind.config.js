// 1. A sintaxe 'import' é usada para carregar o plugin, que é a forma moderna.
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
// 2. A configuração é definida em uma constante para ser exportada.
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#67e8f9',
          DEFAULT: '#06b6d4',
          dark: '#0e7490',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      }
    },
  },
  plugins: [
    // 3. A variável importada é usada aqui.
    forms,
  ],
};

// 4. A configuração é exportada usando 'export default'.
export default config;