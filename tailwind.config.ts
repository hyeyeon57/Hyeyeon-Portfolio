import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        'container': '1540px',
      },
      spacing: {
        'container-x': '190px',
      },
      colors: {
        // 배경 컬러 (새 컬러 팔레트)
        'bg-darkest': '#18181C',     // 아주 진한 블랙에 가까운 차콜 블랙
        'bg-light-cool': '#F4F5F7',  // 아주 연한 쿨톤 라이트 그레이
        'bg-light-soft': '#F5F6FA',  // 거의 흰색에 가까운 블루 기운의 라이트 그레이
        'bg-white': '#FFFFFF',       // 순수 화이트
        
        // 배경 컬러 (기존)
        'bg-light': '#F7F7FB',
        'bg-dark': '#F1F1F5',
        
        // 텍스트 컬러 (접근성 4.5:1 이상)
        'text-main': '#111111',      // Main Text Color
        'text-sub': '#505050',       // Sub Text Color
        'text-secondary': '#767676', // Sub Text Color
        'text-disabled': '#999999',  // Disabled Color
        
        // 브랜드 컬러
        'brand-main': '#7A68F6',     // 은은한 보랏빛의 라일락 퍼플 / 바이올렛
        'brand-sub-1': '#39C3B6',    // Brand Sub Color 1
        'brand-sub-2': '#F59917',    // Brand Sub Color 2
        
        // 라인 컬러
        'line-light': '#F1F1F5',     // 연한 Line 컬러
        'line-medium': '#E5E5EC',    // 중간 Line 컬러 (버튼, 인풋박스 등)
        'line-dark': '#111111',      // 진한 Line 컬러
        
        // 상태 컬러
        'status-danger': '#DC0000',  // 위험/실패
        'status-success': '#04B014', // 성공/안전
        'status-warning': '#FFAA00', // 주의/경고
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'gradient-purple-soft': 'linear-gradient(135deg, #7A68F6 0%, #9B88FF 100%)',
        'gradient-purple-pastel': 'linear-gradient(135deg, #E8E4FF 0%, #F0EDFF 100%)',
        'gradient-purple-blue': 'linear-gradient(135deg, #7A68F6 0%, #A8A0FF 100%)',
      },
      boxShadow: {
        'minimal': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'minimal-lg': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
export default config;
