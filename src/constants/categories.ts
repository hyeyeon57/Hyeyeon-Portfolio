/**
 * 프로젝트 카테고리 정의
 * - 프론트엔드와 백엔드(MongoDB enum)에서 공통으로 사용
 * - 단일 소스(Single Source of Truth)
 */

export const PROJECT_CATEGORIES = [
  { id: 'new', label: '신규' },
  { id: 'renewal', label: '리뉴얼' },
  { id: 'app', label: '앱' },
  { id: 'web', label: '웹' },
  { id: 'design', label: '화면설계서' },
] as const;

// 카테고리 ID만 추출한 배열 (MongoDB enum 용)
export const CATEGORY_IDS = PROJECT_CATEGORIES.map(cat => cat.id);

// 타입 정의
export type CategoryId = typeof PROJECT_CATEGORIES[number]['id'];
