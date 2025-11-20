import { NextRequest, NextResponse } from 'next/server';

// 백오피스 서버 URL 설정
// 프로덕션: 별도 Vercel 프로젝트의 BO 서버
// 개발: 로컬 BO 서버
const BACKOFFICE_API_URL = process.env.NEXT_PUBLIC_BACKOFFICE_URL || 
  process.env.BACKOFFICE_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://hyeyeon-portfolio-admin.vercel.app' 
    : 'http://localhost:3005');

export async function GET(request: NextRequest) {
  try {
    // 백오피스 서버 API 호출
    const fetchUrl = `${BACKOFFICE_API_URL}/api/bo/projects`;
    
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

