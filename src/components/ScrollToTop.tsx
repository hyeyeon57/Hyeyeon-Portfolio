'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * 새로고침 시 페이지 상단으로 스크롤하는 컴포넌트
 * FO(프론트엔드)에서만 작동
 * 전체 프로젝트 페이지(/projects)는 제외 - 상단으로만 스크롤
 * 다른 페이지는 새로고침 시 홈(/)으로 이동
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // 브라우저의 스크롤 복원 비활성화
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 새로고침 감지
    const navigationEntry = typeof window !== 'undefined' 
      ? (window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)
      : null;
    const isReload = navigationEntry?.type === 'reload';
    const hash = window.location.hash;

    // 전체 프로젝트 페이지는 상단으로만 스크롤 (홈으로 이동하지 않음)
    if (pathname === '/projects') {
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo(0, 0);
          }
        }, 100);
      } else {
        window.scrollTo(0, 0);
      }
      return;
    }

    // 홈페이지에서 해시가 있는 상태로 새로고침한 경우 → 홈 상단으로 이동
    if (isReload && pathname === '/' && hash) {
      // 해시 제거하고 홈 상단으로 이동
      window.history.replaceState(null, '', '/');
      window.scrollTo(0, 0);
      return;
    }

    // 다른 페이지는 새로고침 시 홈으로 이동
    if (isReload && pathname !== '/') {
      router.push('/');
      return;
    }

    // 일반적인 경우: 해시가 있으면 해당 섹션으로, 없으면 상단으로
    if (hash && !isReload) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, 0);
        }
      }, 100);
    } else if (pathname === '/' && !hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, router]);

  return null;
}

