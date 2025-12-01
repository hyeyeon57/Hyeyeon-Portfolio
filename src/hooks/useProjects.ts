import { useState, useEffect } from 'react';
import type { Project } from '@/types/portfolio';
import { API_CONFIG } from '@/constants/api';

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * 프로젝트 데이터 페칭 훅
 * - 자동 재시도 로직 포함
 * - 타임아웃 처리
 * - 에러 핸들링
 */
export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async (forceRefresh = false, retryCount = 0) => {
    try {
      const timestamp = forceRefresh ? Date.now() + Math.random() : Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

      let response;
      try {
        response = await fetch(`/api/projects?t=${timestamp}&_=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);

        // 타임아웃 또는 네트워크 에러인 경우 재시도
        if ((fetchError.name === 'AbortError' || fetchError.message?.includes('aborted')) && retryCount < API_CONFIG.MAX_RETRIES) {
          console.warn(`⚠️ 요청 타임아웃, 재시도 중... (${retryCount + 1}/${API_CONFIG.MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return fetchProjects(forceRefresh, retryCount + 1);
        }

        if ((fetchError.message?.includes('fetch failed') || fetchError.message?.includes('network')) && retryCount < API_CONFIG.MAX_RETRIES) {
          console.warn(`⚠️ 네트워크 에러, 재시도 중... (${retryCount + 1}/${API_CONFIG.MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return fetchProjects(forceRefresh, retryCount + 1);
        }

        throw fetchError;
      }

      if (!response.ok) {
        // 503 또는 504 에러인 경우 재시도
        if ((response.status === 503 || response.status === 504) && retryCount < API_CONFIG.MAX_RETRIES) {
          console.warn(`⚠️ 백엔드 서버 오류 (${response.status}), 재시도 중... (${retryCount + 1}/${API_CONFIG.MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
          return fetchProjects(forceRefresh, retryCount + 1);
        }

        // 응답 본문 읽기 시도
        let errorDetails = '';
        try {
          const errorData = await response.clone().json().catch(() => null);
          if (errorData) {
            errorDetails = errorData.error || JSON.stringify(errorData);
          }
        } catch (e) {
          errorDetails = await response.text().catch(() => '응답 본문을 읽을 수 없습니다.');
        }

        const errorMsg = `백엔드 API 호출 실패 (${response.status}: ${response.statusText})${errorDetails ? ` - ${errorDetails}` : ''}`;
        throw new Error(errorMsg);
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setProjects(result.data);
        setError(null);
      } else {
        throw new Error('프로젝트 데이터 형식이 올바르지 않습니다.');
      }
    } catch (err: any) {
      console.error('❌ 프로젝트 로드 실패:', err);
      setError(err.message || '프로젝트를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    // 폴링: 5초마다 자동 새로고침 (선택적)
    const pollInterval = setInterval(() => {
      fetchProjects(true);
    }, 5000);

    // 포커스 시 새로고침
    const handleFocus = () => fetchProjects(true);
    window.addEventListener('focus', handleFocus);

    // Visibility API: 탭이 다시 활성화되면 새로고침
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProjects(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    projects,
    loading,
    error,
    refetch: () => fetchProjects(true),
  };
}
