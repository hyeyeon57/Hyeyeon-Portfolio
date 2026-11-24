import { NextResponse } from 'next/server';
import { MAGAZINE_POSTS } from '@/data/magazine';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3005';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/magazines`, { cache: 'no-store' });
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
