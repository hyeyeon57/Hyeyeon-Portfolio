/**
 * 서버 설정 상수
 */

// CORS 허용 도메인
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3005',
  'https://hyeyeon-portfolio.vercel.app',
  'https://hyeyeon-portfolio-admin.vercel.app',
  process.env.FRONTEND_URL,
  process.env.BACKOFFICE_URL,
].filter(Boolean); // undefined 제거

// 세션 설정
const SESSION_CONFIG = {
  SECRET: process.env.SESSION_SECRET || 'vibe-coding-portfolio-secret-key-2025',
  COOKIE_NAME: 'admin.sid',
  MAX_AGE_MS: 7 * 24 * 60 * 60 * 1000, // 7일 (24시간에서 7일로 연장)
  CHECK_PERIOD_MS: 86400000, // 24시간
};

// JWT 설정
const JWT_CONFIG = {
  SECRET: process.env.SESSION_SECRET || 'vibe-coding-portfolio-secret-key-2025',
  COOKIE_NAME: 'admin_token',
  EXPIRES_IN: '24h',
};

// 관리자 계정
const ADMIN_CONFIG = {
  USERNAME: process.env.ADMIN_USERNAME || 'hing0915',
  PASSWORD: process.env.ADMIN_PASSWORD || 'dpffla525',
};

// 파일 업로드 설정
const UPLOAD_CONFIG = {
  // Vercel의 임시 디렉토리
  TEMP_DIR: '/tmp/projects',
  // 로컬 개발 환경
  LOCAL_DIR: 'public/projects',
};

// 데이터베이스 설정
const DB_CONFIG = {
  CONNECTION_TIMEOUT_MS: 4000,
  MAX_RETRIES: 1,
  RETRY_DELAY_MS: 200,
};

module.exports = {
  ALLOWED_ORIGINS,
  SESSION_CONFIG,
  JWT_CONFIG,
  ADMIN_CONFIG,
  UPLOAD_CONFIG,
  DB_CONFIG,
};
