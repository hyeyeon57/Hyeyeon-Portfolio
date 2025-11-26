import { NextRequest, NextResponse } from 'next/server';

// 이 라우트는 동적이므로 정적 생성하지 않음
export const dynamic = 'force-dynamic';

// 백오피스 서버 URL 설정
// 별도 백엔드 서버로 분리하여 배포
const getBackofficeUrl = () => {
  // 환경 변수가 설정되어 있으면 우선 사용 (별도 배포 시 필수)
  // NEXT_PUBLIC_ 접두사가 있으면 클라이언트/서버 모두 접근 가능
  // BACKOFFICE_API_URL은 서버 사이드에서만 접근 가능
  const backofficeUrl = process.env.NEXT_PUBLIC_BACKOFFICE_URL 
    || process.env.BACKOFFICE_API_URL;
  
  if (backofficeUrl) {
    console.log('🔗 백엔드 URL (환경 변수):', backofficeUrl);
    return backofficeUrl;
  }
  
  // 프로덕션: 별도 백엔드 서버 URL (기본값)
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    const defaultUrl = 'https://hyeyeon-portfolio-admin.vercel.app';
    console.log('🔗 백엔드 URL (기본값):', defaultUrl);
    return defaultUrl;
  }
  
  // 개발 환경: 로컬 서버
  console.log('🔗 백엔드 URL (로컬):', 'http://localhost:3005');
  return 'http://localhost:3005';
};

export async function GET(request: NextRequest) {
  try {
    const backofficeUrl = getBackofficeUrl();
    // 별도 백엔드 서버로 절대 URL로 호출
    // 타임스탬프를 쿼리 파라미터로 추가하여 캐시 무효화
    const timestamp = Date.now();
    const fetchUrl = `${backofficeUrl}/bo-api/projects?_t=${timestamp}`;
    
    console.log('📡 백오피스 API 호출 (별도 서버):', { 
      backofficeUrl, 
      fetchUrl, 
      timestamp,
      hasEnvVar: !!(process.env.NEXT_PUBLIC_BACKOFFICE_URL || process.env.BACKOFFICE_API_URL)
    });
    
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      // Next.js 서버에서 실행되므로 timeout 설정
      next: { revalidate: 0 }, // 항상 최신 데이터 가져오기
      cache: 'no-store', // 캐시 사용 안 함
    });

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
    
    console.log('📦 백엔드 프로젝트 응답:', {
      success: result.success,
      dataLength: result.data?.length || 0,
      featuredCount: result.data?.filter((p: any) => p.featured).length || 0
    });
    
    if (result.success && Array.isArray(result.data)) {
      // MongoDB에서 가져온 데이터를 Project 타입에 맞게 변환
      const projects = result.data.map((project: any) => ({
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

