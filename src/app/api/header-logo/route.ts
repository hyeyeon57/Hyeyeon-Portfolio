import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const timestamp = Date.now();

    // 로컬 환경에서는 백엔드 서버(3005)를 직접 호출, 프로덕션에서는 같은 서버 내부 호출
    const isLocal = !process.env.VERCEL && process.env.NODE_ENV !== 'production';
    const baseUrl = isLocal
      ? (process.env.BACKOFFICE_API_URL || 'http://localhost:3005')
      : (process.env.BACKOFFICE_INTERNAL_URL || 
         (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));
    const fetchUrl = `${baseUrl}/bo-api/header-logo?_t=${timestamp}`;
    
    // 타임아웃 설정 (5초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏱️ 헤더 로고 API 호출 타임아웃 (5초 초과):', { url: fetchUrl, baseUrl });
      controller.abort();
    }, 5000);
    
    let response;
    try {
      response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({ 
          success: false, 
          error: '헤더 로고 조회 요청이 타임아웃되었습니다.',
          data: null,
        }, { status: 504 });
      }
      
      return NextResponse.json({ 
        success: false, 
        error: `백엔드 서버에 연결할 수 없습니다: ${fetchError.message || '네트워크 오류'}`,
        data: null,
        networkError: true,
      }, { status: 503 });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 헤더 로고 조회 실패:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      
      return NextResponse.json({ 
        success: false, 
        error: `백엔드 서버 오류: ${response.status} ${response.statusText}`,
        data: null,
      }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('❌ 헤더 로고 조회 중 예외 발생:', error);
    return NextResponse.json({ 
      success: false, 
      error: `헤더 로고 조회 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
      data: null,
    }, { status: 500 });
  }
}

