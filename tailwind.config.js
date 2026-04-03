export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-sea': '#0a0f14',
        'ink-blue': '#111820',
        'teal-accent': '#2dd4bf',
        coral: '#f97066',
        'amber-accent': '#fbbf24',
        'rose-accent': '#fb7185',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
        display: ['Space Grotesk', 'Noto Sans SC', 'sans-serif'],
        pixel: ['Press Start 2P', 'Noto Sans SC', 'cursive'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 0 1px rgba(45, 212, 191, 0.2), 0 0 0 rgba(45, 212, 191, 0)' },
          '100%': { boxShadow: '0 0 0 1px rgba(45, 212, 191, 0.35), 0 0 32px rgba(45, 212, 191, 0.2)' },
        },
        pixelBlink: {
          '0%, 48%, 100%': { opacity: '1' },
          '50%, 98%': { opacity: '0.35' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2.8s ease-in-out infinite alternate',
        pixelBlink: 'pixelBlink 1.1s steps(2, end) infinite',
      },
      boxShadow: {
        'pixel-border': '0 0 0 2px rgba(251, 191, 36, 0.34), 8px 8px 0 rgba(10, 15, 20, 0.72)',
      },
    },
  },
  plugins: [],
}
