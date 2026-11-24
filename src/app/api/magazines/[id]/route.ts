import { NextResponse } from 'next/server';
import { getMagazinePost } from '@/data/magazine';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3005';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const res = await fetch(`${BACKEND_URL}/api/magazines/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success && json.data) {
        return NextResponse.json({ success: true, data: json.data });
      }
    }
  } catch (error) {
    console.warn('[api/magazines/:id] 백엔드 조회 실패, 기본 데이터 사용:', error);
  }

  const fallback = getMagazinePost(id);
  if (!fallback) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: fallback });
}
