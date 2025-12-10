import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    console.log('📤 업로드 요청 받음');
    const data = await request.formData();
    const files: File[] = [];
    
    // FormData에서 모든 파일 수집 (downlevel iteration 회피)
    data.forEach((value) => {
      if (value instanceof File) {
        files.push(value);
      }
    });
    
    console.log(`📁 파일 개수: ${files.length}`);

    if (files.length === 0) {
      return NextResponse.json(
        { error: '업로드할 파일이 없습니다.' },
        { status: 400 }
      );
    }

    if (files.length > 30) {
      return NextResponse.json(
        { error: '최대 30개의 파일만 업로드할 수 있습니다.' },
        { status: 400 }
      );
    }

    // public/projects 폴더 경로
    const uploadDir = join(process.cwd(), 'public', 'projects');
    console.log(`📂 업로드 디렉토리: ${uploadDir}`);
    
    // 폴더가 없으면 생성
    if (!existsSync(uploadDir)) {
      console.log('📁 폴더 생성 중...');
      mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedPaths: string[] = [];

    // 각 파일 저장
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 파일명 생성 (타임스탬프 추가하여 중복 방지)
      const timestamp = Date.now();
      const originalName = file.name.replace(/\s+/g, '_'); // 공백을 언더스코어로 변경
      const fileName = `${timestamp}_${originalName}`;
      const filePath = join(uploadDir, fileName);

      // 파일 저장
      console.log(`💾 파일 저장 중: ${filePath}`);
      await writeFile(filePath, buffer);
      console.log(`✅ 파일 저장 완료: ${fileName}`);
      
      // 웹 경로 저장
      uploadedPaths.push(`/projects/${fileName}`);
    }

    console.log(`🎉 업로드 완료: ${uploadedPaths.length}개 파일`);
    return NextResponse.json({
      success: true,
      paths: uploadedPaths,
      message: `${files.length}개의 파일이 업로드되었습니다.`
    });

  } catch (error) {
    console.error('❌ 파일 업로드 오류:', error);
    console.error('❌ 에러 상세:', error instanceof Error ? error.message : String(error));
    console.error('❌ 스택:', error instanceof Error ? error.stack : '');
    return NextResponse.json(
      { 
        error: '파일 업로드 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

