'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 스크롤 동작 제어 컴포넌트
 * - 브라우저 뒤로가기/앞으로가기(popstate) 시에는 기존 스크롤 위치를 그대로 복원
 * - 새로고침 시에만 홈 상단으로 이동
 * - 해시(#contact, #all-portfolio 등)가 있으면 해당 섹션으로 스크롤
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const isFirstMount = useRef(true);
  const isPopState = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 브라우저 기본 스크롤 복원 활성화 (뒤로가기 시 이전 스크롤 위치 유지)
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto';
    }

    const handlePopState = () => {
      isPopState.current = true;
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const navigationEntry = window.performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming | undefined;
    const isReload = isFirstMount.current && navigationEntry?.type === 'reload';
    isFirstMount.current = false;

    // 뒤로가기/앞으로가기로 돌아온 경우 브라우저가 이전 스크롤 위치를 복원하도록 건드리지 않음
    if (isPopState.current) {
      isPopState.current = false;
      return;
    }

    const hash = window.location.hash;

    // 홈페이지에서 해시가 있는 상태로 새로고침한 경우에만 홈 상단으로
    if (isReload && pathname === '/' && hash) {
      window.history.replaceState(null, '', '/');
      window.scrollTo(0, 0);
      return;
    }

    // 해시가 있으면 해당 섹션으로 스크롤
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    // 새 페이지로 진입 시 상단으로 스크롤
    if (pathname.startsWith('/projects') || pathname.startsWith('/magazine')) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
