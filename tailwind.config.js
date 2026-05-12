/** @type {import('tailwindcss').Config} */
module.exports = {
  // Keep paths aligned with our Feature-Sliced architecture.
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

        // Business — Volière cage states (cahier des charges §3.8)
        cage: {
          free: '#4CAF50',
          'free-bg': '#E8F5E9',
          'free-fg': '#2E7D32',
          pigeon: '#F44336',
          'pigeon-bg': '#FFEBEE',
          'pigeon-fg': '#C62828',
          couple: '#FF9800',
          'couple-bg': '#FFF3E0',
          'couple-fg': '#E65100',
        },

        // Pigeon sex tints
        male: { DEFAULT: '#2563EB', bg: '#DBEAFE' },
        female: { DEFAULT: '#DB2777', bg: '#FCE7F3' },

        // Status colors
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
        info: '#0EA5E9',

        // Chart accents
        'chart-1': '#DE6B33',
        'chart-2': '#2EB6A8',
        'chart-3': '#2D4E68',
        'chart-4': '#E5B854',
        'chart-5': '#F4A261',
      },
      fontFamily: {
        sans: ['Konnect-Regular'],
        konnect: ['Konnect-Regular'],
        'konnect-medium': ['Konnect-Medium'],
        'konnect-semibold': ['Konnect-SemiBold'],
        'konnect-bold': ['Konnect-Bold'],
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
