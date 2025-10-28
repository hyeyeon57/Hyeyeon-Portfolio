import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build');

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
      console.error('Resend 오류:', error);
      return NextResponse.json(
        { error: '이메일 전송에 실패했습니다.' },
        { status: 500 }
      );
    }

    console.log('이메일 전송 성공:', data);

    return NextResponse.json(
      { message: '메시지가 성공적으로 전송되었습니다.' },
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
