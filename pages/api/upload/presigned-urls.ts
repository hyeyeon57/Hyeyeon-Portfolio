import type { NextApiRequest, NextApiResponse } from 'next';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const { generatePresignedUrls, isS3Enabled } = require('../../../server/services/storageService.cjs');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📤 Presigned URL 요청 받음');
    const { files, folder = 'projects' } = req.body;
    
    console.log('📋 요청 데이터:', { files, folder, isS3Enabled });

    if (!files || !Array.isArray(files) || files.length === 0) {
      console.error('❌ 파일 정보 없음');
      return res.status(400).json({ error: '파일 정보가 필요합니다' });
    }

    // 각 파일에 대해 filename과 contentType이 있는지 확인
    for (const file of files) {
      if (!file.filename || !file.contentType) {
        console.error('❌ 파일 정보 불완전:', file);
        return res.status(400).json({
          error: '각 파일에는 filename과 contentType이 필요합니다',
        });
      }
    }

    // S3가 활성화된 경우: Presigned URL 생성
    if (isS3Enabled) {
      console.log('📤 S3 Presigned URL 생성 중...');
      const presignedUrls = await generatePresignedUrls(files, folder);
      return res.status(200).json({
        success: true,
        data: presignedUrls,
      });
    }

    // S3가 활성화되지 않은 경우: 로컬 파일 시스템 사용
    console.log('📤 로컬 환경: 파일 업로드 URL 생성 중...');
    
    const baseUrl = process.env.BACKOFFICE_URL || process.env.NEXT_PUBLIC_BACKOFFICE_URL || 
                    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const uploadDir = join(process.cwd(), 'public', folder);
    
    console.log(`📂 Base URL: ${baseUrl}`);
    console.log(`📂 Upload Dir: ${uploadDir}`);
    
    // 폴더가 없으면 생성
    if (!existsSync(uploadDir)) {
      console.log('📁 폴더 생성 중...');
      mkdirSync(uploadDir, { recursive: true });
    }

    // 로컬 환경용 URL 생성
    const localUrls = files.map((file: any) => {
      const timestamp = Date.now();
      const safeName = file.filename.replace(/\s+/g, '_');
      const fileName = `${timestamp}_${safeName}`;
      
      const uploadUrl = `${baseUrl}/api/upload-local/${fileName}`;
      const fileUrl = `/${folder}/${fileName}`;
      
      console.log(`📝 파일 URL 생성: ${file.filename} -> ${uploadUrl}`);
      
      return {
        uploadUrl: uploadUrl,
        fileUrl: fileUrl,
        key: `${folder}/${fileName}`,
      };
    });

    console.log(`✅ 로컬 URL 생성 완료: ${localUrls.length}개 파일`);
    const response = {
      success: true,
      data: localUrls,
      localMode: true,
    };
    
    console.log('📤 응답 전송:', JSON.stringify(response, null, 2));
    return res.status(200).json(response);
  } catch (error: any) {
    console.error('❌ Presigned URL 생성 오류:', error);
    console.error('❌ 에러 상세:', error instanceof Error ? error.stack : String(error));
    
    // 응답이 아직 전송되지 않았는지 확인
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Presigned URL 생성 실패',
        details: error instanceof Error ? error.stack : String(error),
      });
    } else {
      console.error('❌ 응답이 이미 전송되었습니다.');
    }
  }
}
