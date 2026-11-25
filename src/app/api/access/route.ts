import { NextRequest, NextResponse } from 'next/server';

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
    const token =
      request.nextUrl.searchParams.get('token') ||
      request.cookies.get('portfolio_access_token')?.value ||
      '';
    // FO 프록시는 접근 토큰 쿠키만 백엔드로 전달합니다.
    // (BO 관리자 세션 쿠키가 FO 열람 권한으로 오인되지 않도록 분리)
    const qs = token ? `?token=${encodeURIComponent(token)}` : '';
    const res = await fetch(`${baseUrl}/bo-api/access/status${qs}`, {
      cache: 'no-store',
      headers: token
        ? { cookie: `portfolio_access_token=${encodeURIComponent(token)}` }
        : {},
    });
    const json = await res.json();
    return NextResponse.json(json, {
      status: res.status,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.warn('[api/access] GET fallback to public:', error);
    return NextResponse.json({ success: true, mode: 'public', hasAccess: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const baseUrl = getBackendBaseUrl(request);
    const body = await request.json();
    const res = await fetch(`${baseUrl}/bo-api/access/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    const response = NextResponse.json(json, { status: res.status });

    if (res.ok && json?.success && json?.token) {
      response.cookies.set('portfolio_access_token', json.token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
    }
    return response;
  } catch (error) {
    console.error('[api/access] POST error:', error);
    return NextResponse.json(
      { success: false, message: '인증 서버와 통신할 수 없습니다.' },
      { status: 500 }
    );
  }
}
