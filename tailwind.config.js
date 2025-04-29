/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'tilt': 'tilt 10s infinite linear',
        'slide-up': 'slide-up 0.3s ease-out'
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'tilt': {
          '0%, 50%, 100%': {
            transform: 'rotate(0deg)',
          },
          '25%': {
            transform: 'rotate(2deg)',
          },
          '75%': {
            transform: 'rotate(-2deg)',
          },
        },
        'slide-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(1rem)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        }
      },
      backdropBlur: {
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      blur: {
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
        '100px': '100px',
      },
      transitionDelay: {
        '2000': '2000ms',
        '4000': '4000ms',
        '6000': '6000ms',
        '8000': '8000ms',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  safelist: [
    'backdrop-blur-md',
    'backdrop-blur-xl',
    'backdrop-blur-2xl',
    'blur-xl',
    'blur-2xl',
    'blur-3xl',
    'blur-[100px]',
    'opacity-10',
    'opacity-20',
    'opacity-30',
    'opacity-40',
    'opacity-75',
    'from-purple-600',
    'to-blue-600',
    'bg-gray-800/50',
    'bg-gray-800/70',
    'bg-gray-900/60',
    'animate-tilt',
    'animate-slide-up',
  ],
  plugins: [],
}