/**
 * API URL 설정 유틸리티
 * - 클라이언트/서버 사이드 모두 지원
 * - Vercel 통합 배포 및 별도 배포 모두 지원
 */

/**
 * 백오피스 API의 기본 URL을 반환
 *
 * 우선순위:
 * 1. 환경 변수 (NEXT_PUBLIC_BACKOFFICE_URL 또는 BACKOFFICE_API_URL)
 * 2. Vercel 환경: VERCEL_URL 또는 프로덕션 도메인
 * 3. 로컬 환경: localhost:3005
 */
export function getBackofficeBaseUrl(): string {
  // 클라이언트 사이드
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
      return 'http://localhost:3005';
    }

    // 같은 프로젝트 내에서 실행 중이면 현재 origin 사용
    return window.location.origin;
  }

  // 서버 사이드
  // 환경 변수 우선 (별도 배포 시)
  const envUrl = process.env.NEXT_PUBLIC_BACKOFFICE_URL || process.env.BACKOFFICE_API_URL;
  if (envUrl) {
    return envUrl;
  }

  // Vercel 환경 (통합 배포)
  if (process.env.VERCEL) {
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    // 프로덕션 도메인 폴백
    return 'https://hyeyeon-portfolio.vercel.app';
  }

  // 로컬 환경
  return 'http://localhost:3005';
}

/**
 * 백오피스 API 엔드포인트의 전체 URL을 반환
 *
 * @param endpoint - API 엔드포인트 경로 (예: '/visitors', '/projects')
 * @param useBoApi - /bo-api 경로 사용 여부 (기본: true)
 * @returns 전체 URL
 *
 * @example
 * getBackofficeApiUrl('/visitors') // http://localhost:3005/bo-api/visitors
 * getBackofficeApiUrl('/projects', false) // http://localhost:3005/projects
 */
export function getBackofficeApiUrl(endpoint: string, useBoApi = true): string {
  const baseUrl = getBackofficeBaseUrl();
  const prefix = useBoApi ? '/bo-api' : '';

  // endpoint가 /로 시작하지 않으면 추가
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return `${baseUrl}${prefix}${normalizedEndpoint}`;
}

/**
 * 같은 프로젝트 내에서 실행 중인지 확인
 * (통합 배포 vs 별도 배포 구분)
 */
export function isSameProjectDeployment(): boolean {
  if (typeof window !== 'undefined') {
    // 클라이언트: 항상 같은 프로젝트
    return true;
  }

  // 서버: 환경 변수가 없으면 같은 프로젝트로 간주
  return !process.env.NEXT_PUBLIC_BACKOFFICE_URL &&
         !process.env.BACKOFFICE_API_URL;
}
