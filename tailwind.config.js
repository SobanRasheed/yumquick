/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Pulled straight from the Zaiqa / Yum Fast app design tokens.
        brand: {
          orange: '#E85221',
          orangeDark: '#C63F14',
          orangeSoft: '#FBE3D9',
          amber: '#F4CA57',
          amberDeep: '#F0BE3C',
          amberSoft: '#FBEBBE',
        },
        ink: '#3A1F14',
        muted: '#8A7A70',
        cream: '#F4F4F4',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 40px -12px rgba(232, 82, 33, 0.28)',
        card: '0 20px 60px -20px rgba(58, 31, 20, 0.18)',
        phone: '0 40px 90px -30px rgba(58, 31, 20, 0.45)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s ease-out both',
        'pulse-ring': 'pulseRing 2.4s ease-out infinite',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
}
