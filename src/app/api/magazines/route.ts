import { NextRequest, NextResponse } from 'next/server';
import { MAGAZINE_POSTS } from '@/data/magazine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getBackendBaseUrl(request: NextRequest): string {
  const isLocal = !process.env.VERCEL && process.env.NODE_ENV !== 'production';
  if (isLocal) {
    return process.env.BACKOFFICE_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3005';
  }
  return (
    process.env.BACKOFFICE_INTERNAL_URL ||
    request.nextUrl.origin ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://www.janghyeyeon.com')
  );
}

export async function GET(request: NextRequest) {
  try {
    const baseUrl = getBackendBaseUrl(request);
    const res = await fetch(`${baseUrl}/bo-api/magazines`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && Array.isArray(json.data)) {
        return NextResponse.json({ success: true, data: json.data });
      }
    }
  } catch (error) {
    console.warn('[api/magazines] 백엔드 조회 실패, 기본 데이터 사용:', error);
  }
  return NextResponse.json({ success: true, data: MAGAZINE_POSTS });
}

export async function POST(request: NextRequest) {
  try {
    const baseUrl = getBackendBaseUrl(request);
    const body = await request.json();
    const res = await fetch(`${baseUrl}/bo-api/magazines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    console.error('[api/magazines] POST 오류:', error);
    return NextResponse.json(
      { success: false, message: '매거진 글 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}
