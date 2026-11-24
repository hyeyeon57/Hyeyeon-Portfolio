import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface HeroSlider {
  _id?: string;
  id?: string;
  image: string;
  title?: string;
  subtitle?: string;
  link?: string;
  order?: number;
  active?: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const timestamp = Date.now();

    const isLocal = !process.env.VERCEL && process.env.NODE_ENV !== 'production';
    const baseUrl = isLocal
      ? (process.env.BACKOFFICE_API_URL || 'http://localhost:3005')
      : (process.env.BACKOFFICE_INTERNAL_URL || 
         (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));
    const fetchUrl = `${baseUrl}/api/hero-sliders?_t=${timestamp}`;
    
    console.log('🔍 Hero Slider API 라우트 시작:', { isLocal, baseUrl, fetchUrl });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 8000);
    
    let response;
    try {
      response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        signal: controller.signal,
        next: { revalidate: 0 },
      });
      
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({ 
          success: false, 
          error: '백엔드 서버 응답 시간 초과',
          data: [],
        }, { status: 504 });
      }
      
      return NextResponse.json({ 
        success: false, 
        error: `백엔드 서버에 연결할 수 없습니다: ${fetchError.message}`,
        data: [],
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
      
      return NextResponse.json({ 
        success: false, 
        error: `백엔드 서버 연결 실패 (${response.status}): ${errorDetails}`,
        data: [],
      }, { status: response.status });
    }

    let result;
    try {
      const responseText = await response.text();
      result = JSON.parse(responseText);
    } catch (parseError: any) {
      return NextResponse.json({ 
        success: false, 
        error: `백엔드 응답이 유효한 JSON이 아닙니다: ${parseError.message}`,
        data: [],
      }, { status: 500 });
    }
    
    const sliders: HeroSlider[] = Array.isArray(result.data) ? result.data : [];

    if (result.success && Array.isArray(result.data)) {
      // order로 정렬
      const sortedSliders = [...sliders].sort((a, b) => {
        const aOrder = a.order || 0;
        const bOrder = b.order || 0;
        return aOrder - bOrder;
      });

      return NextResponse.json({ success: true, data: sortedSliders });
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (error: any) {
    console.error('❌ Hero Slider API 오류:', error);
    return NextResponse.json({ 
      success: false, 
      error: `슬라이더를 불러오는데 실패했습니다: ${error.message || '알 수 없는 오류'}`,
      data: [],
    }, { status: 500 });
  }
}

