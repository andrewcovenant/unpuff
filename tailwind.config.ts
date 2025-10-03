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
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        border: 'hsl(var(--border) / <alpha-value>)',
        
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
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
          border: 'hsl(var(--card-border) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
          border: 'hsl(var(--popover-border) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
          border: 'var(--secondary-border)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
          border: 'var(--muted-border)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
          border: 'var(--destructive-border)',
        },
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        
        // Chart colors
        chart: {
          "1": 'hsl(var(--chart-1) / <alpha-value>)',
          "2": 'hsl(var(--chart-2) / <alpha-value>)',
          "3": 'hsl(var(--chart-3) / <alpha-value>)',
          "4": 'hsl(var(--chart-4) / <alpha-value>)',
          "5": 'hsl(var(--chart-5) / <alpha-value>)'
        },
        
        // Sidebar
        sidebar: {
          ring: 'hsl(var(--sidebar-ring) / <alpha-value>)',
          DEFAULT: 'hsl(var(--sidebar) / <alpha-value>)',
          foreground: 'hsl(var(--sidebar-foreground) / <alpha-value>)',
          border: 'hsl(var(--sidebar-border) / <alpha-value>)',
        },
        "sidebar-primary": {
          DEFAULT: 'hsl(var(--sidebar-primary) / <alpha-value>)',
          foreground: 'hsl(var(--sidebar-primary-foreground) / <alpha-value>)',
          border: 'var(--sidebar-primary-border)',
        },
        "sidebar-accent": {
          DEFAULT: 'hsl(var(--sidebar-accent) / <alpha-value>)',
          foreground: 'hsl(var(--sidebar-accent-foreground) / <alpha-value>)',
          border: 'var(--sidebar-accent-border)'
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
