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
    const fetchUrl = `${baseUrl}/bo-api/documents?_t=${timestamp}`;
    
    // 타임아웃 설정 (5초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏱️ 문서 API 호출 타임아웃 (5초 초과):', { url: fetchUrl, baseUrl });
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
          error: '문서 조회 요청이 타임아웃되었습니다.',
          data: { resume: null, coverLetter: null },
        }, { status: 504 });
      }
      
      return NextResponse.json({ 
        success: false, 
        error: `백엔드 서버에 연결할 수 없습니다: ${fetchError.message || '네트워크 오류'}`,
        data: { resume: null, coverLetter: null },
        networkError: true,
      }, { status: 503 });
    }

    if (!response.ok) {
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
      
      console.error(`❌ 문서 API 호출 실패:`, {
        status: response.status,
        statusText: response.statusText,
        url: fetchUrl,
        baseUrl,
        error: errorDetails,
      });
      
      return NextResponse.json({ 
        success: false, 
        error: `문서 조회 실패 (${response.status}: ${response.statusText})${errorDetails ? ` - ${errorDetails}` : ''}`,
        data: { resume: null, coverLetter: null },
      }, { status: response.status });
    }

    const result = await response.json();
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('❌ 문서 API 라우트 오류:', error);
    return NextResponse.json({ 
      success: false, 
      error: `문서 조회 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
      data: { resume: null, coverLetter: null },
    }, { status: 500 });
  }
}

