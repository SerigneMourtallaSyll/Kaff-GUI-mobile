/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Keep paths aligned with our Feature-Sliced architecture.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: '#030213',
          foreground: '#FFFFFF',
          50: '#F5F5F8',
          100: '#E8E8EE',
          200: '#C5C5D2',
          300: '#9C9CB1',
          400: '#5F5F7A',
          500: '#3D3D5C',
          600: '#2A2A45',
          700: '#1C1C30',
          800: '#0F0F1F',
          900: '#030213',
        },
        // Semantics
        background: '#FFFFFF',
        foreground: '#0A0A0F',
        card: '#FFFFFF',
        'card-foreground': '#0A0A0F',
        muted: '#ECECF0',
        'muted-foreground': '#717182',
        accent: '#E9EBEF',
        'accent-foreground': '#030213',
        border: '#E5E7EB',
        input: '#F3F3F5',

        // Business — Volière cage states (cahier des charges)
        cage: {
          free: '#4CAF50',
          pigeon: '#F44336',
          couple: '#FF9800',
        },

        // Status colors
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
        info: '#0EA5E9',
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      spacing: {
        4.5: '18px',
        13: '52px',
      },
    },
  },
  plugins: [],
};
