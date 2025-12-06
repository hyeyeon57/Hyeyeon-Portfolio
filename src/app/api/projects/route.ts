import { NextRequest, NextResponse } from 'next/server';
import type { Project } from '@/types/portfolio';

// 빌드 시 정적 생성하지 않고 항상 서버에서 렌더링 (Deployment Protection 우회)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const timestamp = Date.now();

    // 로컬 환경에서는 백엔드 서버(3005)를 직접 호출, 프로덕션에서는 같은 서버 내부 호출
    const isLocal = !process.env.VERCEL && process.env.NODE_ENV !== 'production';
    const baseUrl = isLocal
      ? (process.env.BACKOFFICE_API_URL || 'http://localhost:3005')
      : (process.env.BACKOFFICE_INTERNAL_URL || 
         (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));
    const fetchUrl = `${baseUrl}/bo-api/projects?_t=${timestamp}`;
    
    console.log('🔍 API 라우트 시작:', {
      isLocal,
      baseUrl,
      fetchUrl,
      nodeEnv: process.env.NODE_ENV,
      backofficeUrl: process.env.BACKOFFICE_API_URL
    });
    
    // 타임아웃 설정 (8초 - Vercel 서버리스 함수 제한 고려)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏱️ 백엔드 API 호출 타임아웃 (8초 초과):', { url: fetchUrl, baseUrl });
      controller.abort();
    }, 8000);
    
    let response;
    try {
      console.log('📡 백엔드 API 호출 시작:', { fetchUrl, baseUrl, isLocal });
      
      response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
        signal: controller.signal, // 타임아웃 신호
        // Next.js 서버에서 실행되므로 timeout 설정
        next: { revalidate: 0 }, // 캐시 비활성화
      });
      
      clearTimeout(timeoutId); // 성공 시 타임아웃 제거
      
      console.log('📡 백엔드 API 응답 받음:', { 
        status: response.status, 
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId); // 에러 시 타임아웃 제거
      
      // 네트워크 에러나 타임아웃 에러 처리
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('aborted')) {
        console.error('❌ 백엔드 API 호출 타임아웃:', {
          url: fetchUrl,
          baseUrl,
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
            baseUrl,
            message: '백엔드 서버가 8초 내에 응답하지 않았습니다. Vercel 로그를 확인하세요.'
          }
        }, { status: 504 });
      }
      
      // 네트워크 에러
      console.error('❌ 백엔드 API 호출 네트워크 에러:', {
        error: fetchError.message,
        name: fetchError.name,
        url: fetchUrl,
        baseUrl,
        stack: fetchError.stack
      });
      
      return NextResponse.json({ 
        success: false, 
        error: `백엔드 서버에 연결할 수 없습니다: ${fetchError.message || '네트워크 오류'}`,
        data: [],
        networkError: true,
        details: {
          url: fetchUrl,
          baseUrl,
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
        baseUrl,
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

    let result;
    try {
      const responseText = await response.text();
      console.log('📦 백엔드 응답 본문 (처음 500자):', responseText.substring(0, 500));
      
      try {
        result = JSON.parse(responseText);
      } catch (parseError: any) {
        console.error('❌ JSON 파싱 실패:', {
          status: response.status,
          statusText: response.statusText,
          url: fetchUrl,
          responsePreview: responseText.substring(0, 200),
          error: parseError.message
        });
        return NextResponse.json({ 
          success: false, 
          error: `백엔드 응답이 유효한 JSON이 아닙니다: ${parseError.message || '알 수 없는 오류'}`,
          data: [],
          details: {
            status: response.status,
            responsePreview: responseText.substring(0, 200)
          }
        }, { status: 500 });
      }
    } catch (readError: any) {
      console.error('❌ 응답 본문 읽기 실패:', {
        status: response.status,
        statusText: response.statusText,
        url: fetchUrl,
        error: readError.message
      });
      return NextResponse.json({ 
        success: false, 
        error: `백엔드 응답을 읽을 수 없습니다: ${readError.message || '알 수 없는 오류'}`,
        data: [],
      }, { status: 500 });
    }
    
    const rawProjects = Array.isArray(result.data) ? result.data : [];

    console.log('📦 백엔드 프로젝트 응답:', {
      success: result.success,
      dataLength: rawProjects.length,
      featuredCount: rawProjects.filter((p: { featured?: boolean }) => !!p?.featured).length
    });
    
    if (result.success && Array.isArray(result.data)) {
      // MongoDB에서 가져온 데이터를 Project 타입에 맞게 변환
      let projects: Project[];
      try {
        projects = result.data.map((project: any): Project => {
          try {
            return {
              id: project.id || project._id?.toString() || '',
              title: project.title || '',
              subtitle: project.subtitle || '',
              description: project.description || '',
              fullDescription: project.fullDescription || '',
              image: project.image || project.images?.[0] || '',
              tags: Array.isArray(project.tags) ? project.tags : [],
              category: project.category || 'new',
              date: project.date || '',
              role: project.role || '',
              duration: project.duration || '',
              team: project.team || '',
              achievements: Array.isArray(project.achievements) ? project.achievements : [],
              link: project.link || '#',
              designLink: project.designLink || project.figmaLink || project.designFile || '',
              designPdf: project.designPdf || '',
              detailPdf: project.detailPdf || '',
              previewPdf: project.previewPdf || '',
              retrospective: project.retrospective || '',
              gallery: Array.isArray(project.gallery) ? project.gallery : (Array.isArray(project.images) ? project.images : []),
              featured: project.featured === true || project.featured === 'true', // boolean 강제 변환
            };
          } catch (itemError: any) {
            console.error('❌ 개별 프로젝트 변환 실패:', {
              projectId: project.id || project._id,
              error: itemError.message,
              project: JSON.stringify(project).substring(0, 200)
            });
            throw itemError;
          }
        });
      } catch (mapError: any) {
        console.error('❌ 프로젝트 데이터 변환 실패:', {
          error: mapError.message,
          stack: mapError.stack,
          dataLength: result.data?.length,
          firstItem: result.data?.[0]
        });
        return NextResponse.json({ 
          success: false, 
          error: `프로젝트 데이터 변환 실패: ${mapError.message || '알 수 없는 오류'}`,
          data: [],
        }, { status: 500 });
      }

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
    console.error('❌ 프로젝트 API 오류:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      cause: error.cause,
      fullError: error,
      timestamp: new Date().toISOString()
    });
    
    // 타임아웃 에러인 경우
    if (error.name === 'AbortError' || error.message?.includes('aborted')) {
      console.error('⏱️ 타임아웃 에러 발생');
      return NextResponse.json({ 
        success: false, 
        error: '백엔드 서버 응답 시간 초과 (8초). 백엔드 서버가 실행 중인지 확인하세요.',
        data: [],
        timeout: true,
        details: {
          message: '백엔드 서버가 8초 내에 응답하지 않았습니다. 서버 상태를 확인하세요.',
          checkUrl: 'http://localhost:3005/bo-api/health'
        }
      }, { status: 504 });
    }
    
    // 네트워크 에러인 경우
    if (error.message?.includes('fetch failed') || error.message?.includes('ECONNREFUSED') || error.message?.includes('ENOTFOUND')) {
      console.error('🌐 네트워크 에러 발생');
      return NextResponse.json({ 
        success: false, 
        error: '백엔드 서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.',
        data: [],
        networkError: true,
        details: {
          message: '백엔드 서버(포트 3005)에 연결할 수 없습니다.',
          checkCommand: 'npm run dev:server',
          checkUrl: 'http://localhost:3005/bo-api/health'
        }
      }, { status: 503 });
    }
    
    // 오류 발생 시 에러 반환 (정적 데이터 사용 방지)
    console.error('❌ 알 수 없는 에러 발생');
    return NextResponse.json({ 
      success: false, 
      error: `프로젝트를 불러오는데 실패했습니다: ${error.message || '알 수 없는 오류'}`,
      data: [],
      details: {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}

