import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
        'qhd': '2200px',
      },
      maxWidth: {
        'container': '1920px',
      },
      spacing: {
        'container-x': '120px',
      },
      fontFamily: {
        serif: ['Gelasio', 'Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        // 배경 (에디토리얼 다크)
        'bg-black': '#000000',
        'bg-ink': '#050505',       // 푸터 등 가장 어두운 블랙
        'bg-ink-900': '#111111',   // 다크 섹션
        'bg-white': '#FFFFFF',
        'bg-soft': '#F1F1F5',      // 연한 그레이 카드
        'bg-light': '#FAFAFA',
        'bg-dark': '#111111',

        // 텍스트
        'text-main': '#111111',
        'text-sub': '#505050',
        'text-secondary': '#767676',
        'text-disabled': '#999999',
        'text-placeholder': '#BABABA',

        // 모노톤 (액센트는 블랙)
        'brand-main': '#111111',
        'brand-sub-1': '#333333',
        'brand-sub-2': '#000000',
        'brand-accent': '#111111',
        'ink': '#111111',

        // 라인
        'line-light': '#DBDBDB',
        'line-medium': '#E4E4E4',
        'line-strong': '#CCCCCC',
        'line-dark': '#666666',

        // 상태
        'status-danger': '#D23F3F',
        'status-success': '#2BB24C',
        'status-warning': '#E0A000',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'fade-dark': 'linear-gradient(270deg, #000000 51.87%, rgba(0,0,0,0) 100%)',
        'overlay-dark': 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 100%)',
      },
      borderRadius: {
        'pill': '9999px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both',
        'marquee': 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
