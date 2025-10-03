import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F14',
        surface: '#111824',
        primary: {
          DEFAULT: '#22D3EE',
          foreground: '#0B0F14'
        },
        accent: {
          DEFAULT: '#A78BFA',
          foreground: '#0B0F14'
        },
        success: '#34D399',
        warning: '#F59E0B',
        error: '#F43F5E',
        text: '#E6EDF6',
        'text-muted': '#9FB0C5',
        border: '#1F2A37',
        
        // Neutrals
        neutral: {
          900: '#0B0F14',
          800: '#111824',
          700: '#17202B',
          600: '#1F2A37',
          500: '#2A3A4B',
          400: '#3D4D5E',
          300: '#647489',
          200: '#9FB0C5',
          100: '#D6DFEA',
          50: '#F2F6FA',
        },
        
        // Shadcn compatibility
        background: '#0B0F14',
        foreground: '#E6EDF6',
        card: {
          DEFAULT: '#111824',
          foreground: '#E6EDF6',
          border: '#1F2A37',
        },
        popover: {
          DEFAULT: '#111824',
          foreground: '#E6EDF6',
          border: '#1F2A37',
        },
        secondary: {
          DEFAULT: '#2A3A4B',
          foreground: '#E6EDF6',
          border: '#3D4D5E',
        },
        muted: {
          DEFAULT: '#1F2A37',
          foreground: '#9FB0C5',
          border: '#2A3A4B',
        },
        destructive: {
          DEFAULT: '#F43F5E',
          foreground: '#0B0F14',
          border: '#F43F5E',
        },
        input: '#1F2A37',
        ring: '#22D3EE',
        
        // Chart colors
        chart: {
          "1": '#34D399',
          "2": '#22D3EE',
          "3": '#F59E0B',
          "4": '#A78BFA',
          "5": '#F43F5E'
        },
        
        // Sidebar
        sidebar: {
          ring: '#22D3EE',
          DEFAULT: '#111824',
          foreground: '#E6EDF6',
          border: '#1F2A37',
        },
        "sidebar-primary": {
          DEFAULT: '#22D3EE',
          foreground: '#0B0F14',
          border: '#22D3EE',
        },
        "sidebar-accent": {
          DEFAULT: '#2A3A4B',
          foreground: '#E6EDF6',
          border: '#3D4D5E'
        },
        status: {
          online: '#34D399',
          away: '#F59E0B',
          busy: '#F43F5E',
          offline: '#647489',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        pill: '999px',
      },
      boxShadow: {
        sm: '0 1px 0 #0D141D, 0 1px 2px rgba(0,0,0,0.3)',
        md: '0 0 0 1px #1F2A37, 0 8px 24px rgba(0,0,0,0.35)',
        lg: '0 0 0 1px #2A3A4B, 0 16px 40px rgba(0,0,0,0.45)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      fontSize: {
        'display-1': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.005em', fontWeight: '700' }],
        'display-2': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.005em', fontWeight: '700' }],
        h1: ['1.75rem', { lineHeight: '2.125rem', fontWeight: '700' }],
        h2: ['1.375rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        h3: ['1.125rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.04em' }],
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
