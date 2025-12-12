import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  // 초기 로드 완료 여부 추적 (무한 루프 방지)
  const hasInitialLoad = useRef(false);
  
  // fetchProjects 함수를 ref로 저장하여 재귀 호출 시 최신 버전 사용
  const fetchProjectsRef = useRef<typeof fetchProjects>();

  const fetchProjects = useCallback(async (forceRefresh = false, retryCount = 0) => {
    try {
      const timestamp = forceRefresh ? Date.now() + Math.random() : Date.now();
      const controller = new AbortController();
      // 대표 프로젝트는 너무 오래 기다리지 않도록 타임아웃을 4초로 단축
      const timeoutId = setTimeout(() => controller.abort(), Math.min(API_CONFIG.TIMEOUT_MS, 4000));

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
          return fetchProjectsRef.current?.(forceRefresh, retryCount + 1);
        }

        if ((fetchError.message?.includes('fetch failed') || fetchError.message?.includes('network')) && retryCount < API_CONFIG.MAX_RETRIES) {
          console.warn(`⚠️ 네트워크 에러, 재시도 중... (${retryCount + 1}/${API_CONFIG.MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return fetchProjectsRef.current?.(forceRefresh, retryCount + 1);
        }

        // 백그라운드 업데이트 실패 시 조용히 무시
        if (forceRefresh) {
          console.warn('⚠️ 백그라운드 프로젝트 업데이트 실패 (캐시 데이터 유지):', fetchError.message);
          return;
        }
        throw fetchError;
      }

      if (!response.ok) {
        // 503 또는 504 에러인 경우 재시도
        if ((response.status === 503 || response.status === 504) && retryCount < API_CONFIG.MAX_RETRIES) {
          console.warn(`⚠️ 백엔드 서버 오류 (${response.status}), 재시도 중... (${retryCount + 1}/${API_CONFIG.MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
          return fetchProjectsRef.current?.(forceRefresh, retryCount + 1);
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

        // 백그라운드 업데이트 실패 시 조용히 무시
        if (forceRefresh) {
          console.warn('⚠️ 백그라운드 프로젝트 업데이트 실패 (캐시 데이터 유지):', errorDetails);
          return;
        }

        const errorMsg = `백엔드 API 호출 실패 (${response.status}: ${response.statusText})${errorDetails ? ` - ${errorDetails}` : ''}`;
        throw new Error(errorMsg);
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        // featured 값을 boolean으로 변환
        const normalizedProjects = result.data.map((p: any) => ({
          ...p,
          featured: p.featured === true || p.featured === 'true',
        }));
        
        // order 필드로 정렬 (order가 없으면 0으로 처리), 같은 order면 featured 우선, 그 다음 createdAt 역순
        const sortedProjects = [...normalizedProjects].sort((a: any, b: any) => {
          const aOrder = a.order || 0;
          const bOrder = b.order || 0;
          if (aOrder !== bOrder) return aOrder - bOrder;
          
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          
          // createdAt 역순 (최신순)
          const aDate = new Date(a.createdAt || 0);
          const bDate = new Date(b.createdAt || 0);
          return bDate.getTime() - aDate.getTime();
        });
        setProjects(sortedProjects);
        setError(null);

        // 최신 데이터를 localStorage와 sessionStorage에 캐시
        if (typeof window !== 'undefined') {
          try {
            const CACHE_KEY = 'featured-projects-cache';
            const CACHE_TIMESTAMP_KEY = 'featured-projects-cache-timestamp';
            
            // localStorage에 저장 (더 오래 유지)
            window.localStorage.setItem(CACHE_KEY, JSON.stringify(result.data));
            window.localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
            
            // sessionStorage에도 저장 (호환성)
            window.sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ data: result.data, updatedAt: Date.now() }),
            );
          } catch {
            // 스토리지 제한 등은 조용히 무시
          }
        }
      } else {
        // 데이터 형식 오류
        if (forceRefresh) {
          console.warn('⚠️ 백그라운드 프로젝트 업데이트 실패 - 데이터 형식 오류 (캐시 데이터 유지)');
          return;
        }
        throw new Error('프로젝트 데이터 형식이 올바르지 않습니다.');
      }
    } catch (err: any) {
      console.error('❌ 프로젝트 로드 실패:', err);
      
      // 백그라운드 업데이트 실패 시 조용히 무시 (초기 로드가 아니면)
      if (forceRefresh) {
        console.warn('⚠️ 백그라운드 프로젝트 업데이트 실패 (캐시 데이터 유지):', err.message);
        return; // 에러 상태로 변경하지 않음
      }
      
      // 초기 로드 시에만 에러 표시
      setError(err.message || '프로젝트를 불러오는데 실패했습니다.');
    } finally {
      // 초기 로드가 아니면 loading 상태를 변경하지 않음
      if (!forceRefresh) {
        setLoading(false);
      }
    }
  }, []); // 의존성 배열 비움 - setState 함수들은 안정적

  // fetchProjects 함수를 ref에 저장 (재귀 호출용)
  fetchProjectsRef.current = fetchProjects;

  useEffect(() => {
    // 클라이언트에서만 실행 (Hydration 에러 방지)
    if (typeof window === 'undefined') return;
    
    // 초기 로드는 한 번만 실행
    if (hasInitialLoad.current) return;
    hasInitialLoad.current = true;

    // 캐시 확인 (클라이언트에서만)
    if (typeof window !== 'undefined') {
      const CACHE_KEY = 'featured-projects-cache';
      const CACHE_TIMESTAMP_KEY = 'featured-projects-cache-timestamp';

      try {
        const cached = window.localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // featured 값을 boolean으로 변환
            const normalized = parsed.map((p: any) => ({
              ...p,
              featured: p.featured === true || p.featured === 'true',
            }));
            
            const sorted = [...normalized].sort((a: any, b: any) => {
              const aOrder = a.order || 0;
              const bOrder = b.order || 0;
              if (aOrder !== bOrder) return aOrder - bOrder;
              
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              
              // createdAt 역순 (최신순)
              const aDate = new Date(a.createdAt || 0);
              const bDate = new Date(b.createdAt || 0);
              return bDate.getTime() - aDate.getTime();
            });
            setProjects(sorted as Project[]);
            setLoading(false);
            setError(null);
          }
        }
      } catch {
        // ignore
      }

      // sessionStorage 백업
      if (projects.length === 0) {
        try {
          const cachedSession = window.sessionStorage.getItem(CACHE_KEY);
          if (cachedSession) {
            const parsed = JSON.parse(cachedSession);
            if (Array.isArray(parsed?.data) && parsed.data.length > 0) {
              // featured 값을 boolean으로 변환
              const normalized = parsed.data.map((p: any) => ({
                ...p,
                featured: p.featured === true || p.featured === 'true',
              }));
              
              const sorted = [...normalized].sort((a: any, b: any) => {
                const aOrder = a.order || 0;
                const bOrder = b.order || 0;
                if (aOrder !== bOrder) return aOrder - bOrder;
                
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                
                // createdAt 역순 (최신순)
                const aDate = new Date(a.createdAt || 0);
                const bDate = new Date(b.createdAt || 0);
                return bDate.getTime() - aDate.getTime();
              });
              setProjects(sorted as Project[]);
              setLoading(false);
              setError(null);
            }
          }
        } catch {
          // ignore
        }
      }
    }

    // 초기 페치 (백그라운드 최신화)
    fetchProjects(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 의존성 배열 - 초기 마운트 시 한 번만 실행 (fetchProjects는 useCallback으로 안정적)

  return {
    projects,
    loading,
    error,
    refetch: () => fetchProjects(true),
  };
}
