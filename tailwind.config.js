/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        purple:         '#7C5DFA',
        'purple-light': '#9277FF',

      
        'bg-body':    'var(--color-bg-body)',
        'bg-card':    'var(--color-bg-card)',
        'bg-sidebar': 'var(--color-bg-sidebar)',

        'heading':    'var(--color-text-heading)',
        'body-text':  'var(--color-text-body)',
        'muted':      'var(--color-text-muted)',
        'line':       'var(--color-border)',

        'paid':       '#33D69F',
        'pending':    '#FF8F00',
        'draft':      '#373B53',
      },
      fontFamily: {
        sans: ['League Spartan', 'sans-serif'],
      },
    },
  },
  plugins: [],
}