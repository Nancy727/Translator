module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
        'fade-in': 'fade-in 0.5s ease-out',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
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
  ],
  plugins: [],
} 