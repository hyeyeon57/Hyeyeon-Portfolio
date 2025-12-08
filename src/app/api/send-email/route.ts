import { NextRequest, NextResponse } from 'next/server';

// 이 라우트는 동적이므로 정적 생성하지 않음
export const dynamic = 'force-dynamic';

// 백오피스 서버 URL 설정 (통합 배포 지원)
const getBackofficeUrl = () => {
  // 환경 변수가 설정되어 있으면 우선 사용 (별도 배포 시)
  if (process.env.NEXT_PUBLIC_BACKOFFICE_URL) {
    return process.env.NEXT_PUBLIC_BACKOFFICE_URL;
  }
  if (process.env.BACKOFFICE_API_URL) {
    return process.env.BACKOFFICE_API_URL;
  }
  
  // 같은 프로젝트 내에서 실행 중인 경우
  if (process.env.VERCEL) {
    const vercelUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'https://hyeyeon-portfolio.vercel.app';
    return vercelUrl;
  }
  
  // 개발 환경: 로컬 서버
  return 'http://localhost:3005';
};

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // 입력값 검증
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 백오피스 서버에 연락 정보 저장
    let contactSaved = false;
    try {
      const backofficeUrl = getBackofficeUrl();
      
      // 같은 프로젝트 내에서 실행 중인지 확인
      const isSameProject = !process.env.NEXT_PUBLIC_BACKOFFICE_URL 
        && !process.env.BACKOFFICE_API_URL
        && process.env.VERCEL;
      
      let fetchUrl;
      if (isSameProject) {
        // 같은 프로젝트: 상대 경로 사용
        fetchUrl = `/bo-api/contacts`;
      } else {
        // 별도 프로젝트: 절대 URL 사용
        fetchUrl = `${backofficeUrl}/bo-api/contacts`;
      }
      
      console.log('📧 백오피스 연락 정보 저장 시도:', { fetchUrl, backofficeUrl, isSameProject });
      
      const contactResponse = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
      
      if (contactResponse.ok) {
        const contactResult = await contactResponse.json();
        if (contactResult.success) {
          contactSaved = true;
          console.log('✅ 백오피스 연락 정보 저장 성공');
        } else {
          console.warn('⚠️ 백오피스 연락 정보 저장 실패:', contactResult.error);
          return NextResponse.json(
            { error: '메시지 저장에 실패했습니다. 다시 시도해주세요.' },
            { status: 500 }
          );
        }
      } else {
        const errorText = await contactResponse.text();
        console.error('❌ 백오피스 연락 정보 저장 실패:', {
          status: contactResponse.status,
          statusText: contactResponse.statusText,
          error: errorText
        });
        return NextResponse.json(
          { error: '메시지 저장에 실패했습니다. 다시 시도해주세요.' },
          { status: 500 }
        );
      }
    } catch (error: any) {
      console.error('❌ 백오피스 연락 정보 저장 오류:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return NextResponse.json(
        { error: '메시지 저장 중 오류가 발생했습니다. 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    // 이메일 전송을 건너뛰고, 저장 성공 시 바로 성공 응답
    return NextResponse.json(
      { 
        message: '메시지가 저장되었습니다.',
        saved: contactSaved,
        emailSent: false,
        error: null
      },
      { status: 200 }
    );
    return NextResponse.json(
      { 
        message: '메시지가 성공적으로 전송되었습니다.',
        saved: contactSaved,
        emailSent: true,
        error: null // 명시적으로 error 필드를 null로 설정
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('이메일 전송 오류:', error);
    return NextResponse.json(
      { error: '메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
