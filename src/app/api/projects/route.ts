import { NextRequest, NextResponse } from 'next/server';
import type { Project } from '@/types/portfolio';

// 이 라우트는 동적이므로 정적 생성하지 않음
export const dynamic = 'force-dynamic';

// 백오피스 서버 URL 설정
// 같은 프로젝트 내에서 /bo-api 경로 사용 (통합 배포)
const getBackofficeUrl = () => {
  // 환경 변수가 설정되어 있으면 우선 사용 (별도 배포 시)
  const backofficeUrl = process.env.NEXT_PUBLIC_BACKOFFICE_URL 
    || process.env.BACKOFFICE_API_URL;
  
  if (backofficeUrl) {
    console.log('🔗 백엔드 URL (환경 변수):', backofficeUrl);
    return backofficeUrl;
  }
  
  // 같은 프로젝트 내에서 실행 중인 경우 (통합 배포)
  // 서버 사이드에서는 상대 경로를 사용할 수 없으므로
  // Vercel 환경에서는 현재 호스트를 사용하거나 빈 문자열 반환
  if (process.env.VERCEL) {
    // Vercel 환경: 같은 프로젝트 내에서 실행
    // request 객체에서 호스트 정보를 가져와야 하지만, 여기서는 빈 문자열 반환
    // 실제로는 상대 경로를 사용하거나 현재 호스트를 사용
    const vercelUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : '';
    
    // 같은 프로젝트 내에서 실행 중이면 빈 문자열 반환 (상대 경로 사용)
    // 또는 현재 호스트 사용
    if (vercelUrl) {
      console.log('🔗 백엔드 URL (같은 프로젝트):', vercelUrl);
      return vercelUrl;
    }
    
    // 프로덕션 도메인이 있으면 사용
    const productionUrl = 'https://hyeyeon-portfolio.vercel.app';
    console.log('🔗 백엔드 URL (프로덕션):', productionUrl);
    return productionUrl;
  }
  
  // 개발 환경: 로컬 서버
  console.log('🔗 백엔드 URL (로컬):', 'http://localhost:3005');
  return 'http://localhost:3005';
};

export async function GET(request: NextRequest) {
  try {
    const backofficeUrl = getBackofficeUrl();
    // 같은 프로젝트 내에서 실행 중이면 상대 경로 사용
    // 별도 프로젝트로 배포된 경우에만 절대 URL 사용
    const timestamp = Date.now();
    
    // 같은 프로젝트 내에서 실행 중인지 확인
    // 환경 변수가 없고 Vercel 환경이면 같은 프로젝트로 간주
    const isSameProject = !process.env.NEXT_PUBLIC_BACKOFFICE_URL 
      && !process.env.BACKOFFICE_API_URL
      && process.env.VERCEL;
    
    let fetchUrl;
    if (isSameProject && backofficeUrl) {
      // 같은 프로젝트: 절대 URL 사용 (같은 도메인)
      fetchUrl = `${backofficeUrl}/bo-api/projects?_t=${timestamp}`;
    } else if (isSameProject) {
      // 같은 프로젝트: 상대 경로 사용 (서버 사이드에서는 작동하지 않을 수 있음)
      fetchUrl = `/bo-api/projects?_t=${timestamp}`;
    } else {
      // 별도 프로젝트: 절대 URL 사용
      fetchUrl = `${backofficeUrl}/bo-api/projects?_t=${timestamp}`;
    }
    
    console.log('📡 백오피스 API 호출 (별도 서버):', { 
      backofficeUrl, 
      fetchUrl, 
      timestamp,
      hasEnvVar: !!(process.env.NEXT_PUBLIC_BACKOFFICE_URL || process.env.BACKOFFICE_API_URL),
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL === '1'
    });
    
    // 타임아웃 설정 (8초 - Vercel 서버리스 함수 제한 고려)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏱️ 백엔드 API 호출 타임아웃 (8초 초과):', { url: fetchUrl, backofficeUrl });
      controller.abort();
    }, 8000);
    
    let response;
    try {
      response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
        signal: controller.signal, // 타임아웃 신호
        // Next.js 서버에서 실행되므로 timeout 설정
        next: { revalidate: 0 }, // 항상 최신 데이터 가져오기
        cache: 'no-store', // 캐시 사용 안 함
      });
      
      clearTimeout(timeoutId); // 성공 시 타임아웃 제거
    } catch (fetchError: any) {
      clearTimeout(timeoutId); // 에러 시 타임아웃 제거
      
      // 네트워크 에러나 타임아웃 에러 처리
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('aborted')) {
        console.error('❌ 백엔드 API 호출 타임아웃:', {
          url: fetchUrl,
          backofficeUrl,
          timeout: '8초',
          error: fetchError.message
        });
        return NextResponse.json({ 
          success: false, 
          error: '백엔드 서버 응답 시간 초과 (8초). MongoDB 연결이 너무 오래 걸리고 있습니다.',
          data: [],
          timeout: true,
          details: {
            url: fetchUrl,
            backofficeUrl,
            message: '백엔드 서버가 8초 내에 응답하지 않았습니다. Vercel 로그를 확인하세요.'
          }
        }, { status: 504 });
      }
      
      // 네트워크 에러
      console.error('❌ 백엔드 API 호출 네트워크 에러:', {
        error: fetchError.message,
        name: fetchError.name,
        url: fetchUrl,
        backofficeUrl,
        stack: fetchError.stack
      });
      
      return NextResponse.json({ 
        success: false, 
        error: `백엔드 서버에 연결할 수 없습니다: ${fetchError.message || '네트워크 오류'}`,
        data: [],
        networkError: true,
        details: {
          url: fetchUrl,
          backofficeUrl,
          errorName: fetchError.name,
          errorMessage: fetchError.message
        }
      }, { status: 503 });
    }

    if (!response.ok) {
      // 응답 본문 읽기 시도
      let errorDetails = '';
      try {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          errorDetails = errorJson.error || errorJson.message || errorText;
        } catch {
          errorDetails = errorText || '응답 본문을 읽을 수 없습니다.';
        }
      } catch (e) {
        errorDetails = '응답 본문을 읽을 수 없습니다.';
      }
      
      // BO 서버가 응답하지 않으면 에러 반환 (정적 데이터 사용 방지)
      console.error(`❌ 백오피스 서버 연결 실패:`, {
        status: response.status,
        statusText: response.statusText,
        url: fetchUrl,
        backofficeUrl,
        error: errorDetails,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // 빈 배열 대신 에러 반환하여 프론트엔드가 정적 데이터 사용하지 않도록
      return NextResponse.json({ 
        success: false, 
        error: `백엔드 서버 연결 실패 (${response.status}: ${response.statusText})${errorDetails ? ` - ${errorDetails}` : ''}`,
        data: [],
        details: {
          status: response.status,
          statusText: response.statusText,
          url: fetchUrl
        }
      }, { status: response.status });
    }

    const result = await response.json();
    const rawProjects = Array.isArray(result.data) ? result.data : [];

    console.log('📦 백엔드 프로젝트 응답:', {
      success: result.success,
      dataLength: rawProjects.length,
      featuredCount: rawProjects.filter((p: { featured?: boolean }) => !!p?.featured).length
    });
    
    if (result.success && Array.isArray(result.data)) {
      // MongoDB에서 가져온 데이터를 Project 타입에 맞게 변환
      const projects: Project[] = result.data.map((project: any): Project => ({
        id: project.id || project._id?.toString() || '',
        title: project.title || '',
        subtitle: project.subtitle || '',
        description: project.description || '',
        fullDescription: project.fullDescription || '',
        image: project.image || project.images?.[0] || '',
        tags: project.tags || [],
        category: project.category || 'new',
        date: project.date || '',
        role: project.role || '',
        duration: project.duration || '',
        team: project.team || '',
        achievements: project.achievements || [],
        link: project.link || '#',
        featured: project.featured === true || project.featured === 'true', // boolean 강제 변환
      }));

      const featuredCount = projects.filter(p => p.featured).length;
      console.log('✅ 변환된 프로젝트:', {
        total: projects.length,
        featured: featuredCount,
        featuredTitles: projects.filter(p => p.featured).map(p => p.title)
      });

      return NextResponse.json({ success: true, data: projects });
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (error: any) {
    console.error('프로젝트 API 오류:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      cause: error.cause,
      fullError: error
    });
    
    // 타임아웃 에러인 경우
    if (error.name === 'AbortError' || error.message.includes('aborted')) {
      return NextResponse.json({ 
        success: false, 
        error: '백엔드 서버 응답 시간 초과 (10초). MongoDB 연결을 확인하세요.',
        data: [],
        timeout: true
      }, { status: 504 });
    }
    
    // 네트워크 에러인 경우
    if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
      return NextResponse.json({ 
        success: false, 
        error: '백엔드 서버에 연결할 수 없습니다. 서버 상태를 확인하세요.',
        data: [],
        networkError: true
      }, { status: 503 });
    }
    
    // 오류 발생 시 에러 반환 (정적 데이터 사용 방지)
    return NextResponse.json({ 
      success: false, 
      error: `프로젝트를 불러오는데 실패했습니다: ${error.message || '알 수 없는 오류'}`,
      data: [],
      details: {
        name: error.name,
        message: error.message
      }
    }, { status: 500 });
  }
}

