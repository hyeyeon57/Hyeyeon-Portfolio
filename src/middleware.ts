import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin 경로는 Next.js가 처리하지 않고 서버리스 함수로 전달
  if (pathname.startsWith('/admin')) {
    // Vercel 서버리스 함수로 리다이렉트
    const url = request.nextUrl.clone();
    url.pathname = '/api/index';
    return NextResponse.rewrite(url);
  }

  // /bo-api 경로도 서버리스 함수로 전달
  if (pathname.startsWith('/bo-api')) {
    const url = request.nextUrl.clone();
    url.pathname = '/api/index';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/bo-api/:path*',
  ],
};

