import { NextRequest, NextResponse } from 'next/server';

// 이 라우트는 동적이므로 정적 생성하지 않음
export const dynamic = 'force-dynamic';

// 백오피스 서버 URL 설정
// 프로덕션: 같은 프로젝트 내 서버리스 함수 사용 (/bo-api/*)
// 개발: 로컬 BO 서버
const getBackofficeUrl = () => {
  // 환경 변수가 설정되어 있으면 우선 사용
  if (process.env.NEXT_PUBLIC_BACKOFFICE_URL || process.env.BACKOFFICE_API_URL) {
    return process.env.NEXT_PUBLIC_BACKOFFICE_URL || process.env.BACKOFFICE_API_URL || '';
  }
  
  // 프로덕션에서는 환경 변수 사용 (request.url 사용하지 않음)
  if (process.env.NODE_ENV === 'production') {
    return process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_SITE_URL || '';
  }
  
  // 개발 환경: 로컬 서버
  return 'http://localhost:3005';
};

export async function GET(request: NextRequest) {
  try {
    const backofficeUrl = getBackofficeUrl();
    const fetchUrl = `${backofficeUrl}/bo-api/projects`;
    
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Next.js 서버에서 실행되므로 timeout 설정
      next: { revalidate: 0 }, // 항상 최신 데이터 가져오기
    });

    if (!response.ok) {
      // BO 서버가 응답하지 않으면 빈 배열 반환 (정적 데이터 사용)
      console.warn('백오피스 서버 연결 실패, 정적 데이터 사용');
      return NextResponse.json({ success: true, data: [] });
    }

    const result = await response.json();
    
    if (result.success && Array.isArray(result.data)) {
      // MongoDB에서 가져온 데이터를 Project 타입에 맞게 변환
      const projects = result.data.map((project: any) => ({
        id: project.id || project._id?.toString() || '',
        title: project.title || '',
        subtitle: project.subtitle || '',
        description: project.description || '',
        fullDescription: project.fullDescription || '',
        image: project.image || project.images?.[0] || '',
        tags: project.tags || [],
        category: project.category || 'new',
        date: project.date || '',
        role: project.role || '',
        duration: project.duration || '',
        team: project.team || '',
        achievements: project.achievements || [],
        link: project.link || '#',
        featured: project.featured || false,
      }));

      return NextResponse.json({ success: true, data: projects });
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    console.error('프로젝트 API 오류:', error);
    // 오류 발생 시 빈 배열 반환 (정적 데이터 사용)
    return NextResponse.json({ success: true, data: [] });
  }
}

