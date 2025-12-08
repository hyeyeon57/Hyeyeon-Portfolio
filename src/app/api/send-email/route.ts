import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// 이 라우트는 동적이므로 정적 생성하지 않음
export const dynamic = 'force-dynamic';

// 이메일 전송 비활성화 플래그 (기본: false)
// SEND_EMAIL_DISABLED=true 로 설정하면 이메일 전송을 건너뛰고 저장만 수행
const EMAIL_DISABLED = process.env.SEND_EMAIL_DISABLED === 'true';

// Resend API 키 확인
const resendApiKey = process.env.RESEND_API_KEY;
if (!EMAIL_DISABLED && (!resendApiKey || resendApiKey === 'dummy-key-for-build')) {
  console.warn('⚠️ RESEND_API_KEY가 설정되지 않았습니다. 이메일 전송이 실패할 수 있습니다.');
}

const resend = new Resend(resendApiKey || 'dummy-key-for-build');

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
        }
      } else {
        const errorText = await contactResponse.text();
        console.error('❌ 백오피스 연락 정보 저장 실패:', {
          status: contactResponse.status,
          statusText: contactResponse.statusText,
          error: errorText
        });
      }
    } catch (error: any) {
      // 백오피스 저장 실패는 로그만 남기고 계속 진행 (이메일 전송은 시도)
      console.error('❌ 백오피스 연락 정보 저장 오류:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }

    // 이메일 전송 비활성화 시: 백오피스 저장만 진행하고 바로 성공 응답
    if (EMAIL_DISABLED) {
      console.log('✉️ 이메일 전송 비활성화 상태로 응답:', { contactSaved, emailSent: false });
      return NextResponse.json(
        {
          message: '메시지가 저장되었습니다. (이메일 전송은 비활성화됨)',
          saved: contactSaved,
          emailSent: false,
          error: null,
        },
        { status: 200 }
      );
    }

    // Resend를 사용한 실제 이메일 전송
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['janghaeyo0507@gmail.com'],
      subject: `포트폴리오 문의: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">
            새로운 포트폴리오 문의가 도착했습니다
          </h2>
          
          <div style="background-color: #1E1E1E; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #FFD700; margin-top: 0;">문의자 정보</h3>
            <p style="color: #FFFFFF; margin: 5px 0;"><strong>이름:</strong> ${name}</p>
            <p style="color: #FFFFFF; margin: 5px 0;"><strong>이메일:</strong> ${email}</p>
          </div>
          
          <div style="background-color: #1E1E1E; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #FFD700; margin-top: 0;">메시지 내용</h3>
            <p style="color: #FFFFFF; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #121212; border-radius: 10px;">
            <p style="color: #B0B0B0; margin: 0;">이 메일은 포트폴리오 사이트의 연락처 폼을 통해 전송되었습니다.</p>
            <p style="color: #B0B0B0; margin: 5px 0 0 0;">전송 시간: ${new Date().toLocaleString('ko-KR')}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend 이메일 전송 오류:', error);
      console.error('❌ Resend 에러 상세:', JSON.stringify(error, null, 2));
      
      // 백오피스에는 저장되었지만 이메일 전송이 실패한 경우
      if (contactSaved) {
        console.log('✅ 백오피스에는 저장되었지만 이메일 전송 실패');
        return NextResponse.json(
          { 
            message: '메시지가 저장되었습니다. 이메일 전송에 실패했지만 나중에 확인하겠습니다.',
            saved: true,
            emailError: true,
            error: null // error 필드를 null로 명시적으로 설정
          },
          { status: 200 }
        );
      }
      
      // 둘 다 실패한 경우
      const errorMessage = error?.message || '이메일 전송에 실패했습니다. 다시 시도해주세요.';
      return NextResponse.json(
        { 
          error: errorMessage,
          details: error
        },
        { status: 500 }
      );
    }

    console.log('✅ 이메일 전송 성공:', data);
    console.log('📊 연락 정보 저장 상태:', { contactSaved, emailSent: true });

    return NextResponse.json(
      { 
        message: '메시지가 성공적으로 전송되었습니다.',
        saved: contactSaved,
        emailSent: true,
        error: null // 명시적으로 error 필드를 null로 설정
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
