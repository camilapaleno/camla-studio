/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'avatar-fade': {
          '0%': { opacity: '0', transform: 'scale(0.85) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'bubble-fade': {
          '0%': { opacity: '0', transform: 'translateY(15px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'text-fade': {
          '0%': { opacity: '0' },
          '50%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'soft-bounce': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%': { transform: 'translateY(-4px)', opacity: '1' },
        },
      },
      animation: {
        'avatar-fade': 'avatar-fade 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'bubble-fade': 'bubble-fade 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s forwards',
        'text-fade': 'text-fade 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards',
        'fade-in': 'fade-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'soft-bounce': 'soft-bounce 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
