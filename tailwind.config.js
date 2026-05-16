/** @type {import('tailwindcss').Config} */
module.exports = {
  // Keep paths aligned with our Feature-Sliced architecture.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand - Vert du prototype
        primary: {
          DEFAULT: '#4CAF50',
          foreground: '#FFFFFF',
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        // Semantics
        background: '#FFFFFF',
        foreground: '#1A1A1A',
        card: '#FFFFFF',
        'card-foreground': '#1A1A1A',
        muted: '#F5F5F5',
        'muted-foreground': '#6B7280',
        accent: '#E8F5E9',
        'accent-foreground': '#1A1A1A',
        border: 'rgba(0, 0, 0, 0.1)',
        input: '#F5F5F5',

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
        success: '#4CAF50',
        warning: '#FF9800',
        danger: '#F44336',
        info: '#2196F3',

        // Chart accents
        'chart-1': '#4CAF50',
        'chart-2': '#81C784',
        'chart-3': '#F44336',
        'chart-4': '#FF9800',
        'chart-5': '#2196F3',
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
