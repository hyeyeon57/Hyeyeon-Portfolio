import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files: File[] = [];
    
    // FormData에서 모든 파일 수집
    for (const [key, value] of data.entries()) {
      if (value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: '업로드할 파일이 없습니다.' },
        { status: 400 }
      );
    }

    if (files.length > 9) {
      return NextResponse.json(
        { error: '최대 9개의 파일만 업로드할 수 있습니다.' },
        { status: 400 }
      );
    }

    // public/projects 폴더 경로
    const uploadDir = join(process.cwd(), 'public', 'projects');
    
    // 폴더가 없으면 생성
    if (!existsSync(uploadDir)) {
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
      await writeFile(filePath, buffer);
      
      // 웹 경로 저장
      uploadedPaths.push(`/projects/${fileName}`);
    }

    return NextResponse.json({
      success: true,
      paths: uploadedPaths,
      message: `${files.length}개의 파일이 업로드되었습니다.`
    });

  } catch (error) {
    console.error('파일 업로드 오류:', error);
    return NextResponse.json(
      { error: '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

