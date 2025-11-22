import { NextRequest, NextResponse } from 'next/server';
import { projects } from '@/data/portfolio';

// 백엔드 없이 하드코딩된 정적 데이터 사용
export async function GET(request: NextRequest) {
  try {
    // 정적 프로젝트 데이터 직접 반환
    return NextResponse.json({ 
      success: true, 
      data: projects 
    });
  } catch (error) {
    console.error('프로젝트 API 오류:', error);
    // 오류 발생 시 빈 배열 반환
    return NextResponse.json({ success: true, data: [] });
  }
}

