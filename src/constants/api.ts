/**
 * API 관련 상수
 */

// API 재시도 설정
export const API_CONFIG = {
  MAX_RETRIES: 3,
  TIMEOUT_MS: 10000, // 10초
  RETRY_DELAY_MS: 1000,
} as const;

// API 엔드포인트
export const API_ENDPOINTS = {
  // 프로젝트
  PROJECTS: '/api/projects',
  PROJECT_BY_ID: (id: string) => `/api/projects/${id}`,
  PROJECT_FEATURED: '/api/projects/featured',

  // 인증
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_CHECK: '/api/auth/check',

  // 방문자
  VISITORS: '/api/visitors',
  VISITOR_STATS: '/api/visitors/stats',

  // 연락
  CONTACTS: '/api/contacts',
  SEND_EMAIL: '/api/send-email',

  // 파일 업로드
  UPLOAD: '/api/upload',
} as const;
