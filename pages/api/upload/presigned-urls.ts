import type { NextApiRequest, NextApiResponse } from 'next';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const { generatePresignedUrls, isS3Enabled } = require('../../../server/services/storageService.cjs');

// Vercel Blob Storage 지원 (선택적)
let vercelBlob: any = null;
try {
  vercelBlob = require('@vercel/blob');
} catch (e) {
  // @vercel/blob이 설치되지 않은 경우 무시
}

const isVercelBlobEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

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

    // 우선순위 설정: 1. Vercel Blob, 2. 로컬 파일 시스템, 3. AWS S3
    
    // 우선순위 1: Vercel Blob Storage (무료 플랜: 1GB 스토리지, 100GB 대역폭/월)
    // 용량 초과 시 자동으로 로컬 또는 S3로 폴백
    if (isVercelBlobEnabled && vercelBlob) {
      console.log('📤 Vercel Blob Storage 사용 (무료 플랜: 1GB)');
      try {
        const presignedUrls = await Promise.all(
          files.map(async (file: any) => {
            // Vercel Blob은 generateClientUploadUrl을 사용하여 클라이언트 업로드 URL 생성
            const fileName = `${folder}/${Date.now()}_${file.filename.replace(/\s+/g, '_')}`;
            const { url, downloadUrl } = await vercelBlob.generateClientUploadUrl({
              pathname: fileName,
              contentType: file.contentType,
              addRandomSuffix: false,
            });
            
            return {
              uploadUrl: url, // 클라이언트가 이 URL로 PUT 요청하여 업로드
              fileUrl: downloadUrl, // 업로드 완료 후 파일 접근 URL
              key: fileName,
              method: 'PUT',
            };
          })
        );
        
        return res.status(200).json({
          success: true,
          data: presignedUrls,
          storage: 'vercel-blob',
        });
      } catch (vercelError: any) {
        // Vercel Blob 용량 초과 또는 오류 시 로컬 또는 S3로 자동 폴백
        console.warn('⚠️ Vercel Blob Storage 오류, 폴백 시도:', vercelError.message);
        
        // 우선순위 2: 로컬 파일 시스템으로 폴백
        const isLocalEnvironment = !process.env.VERCEL;
        if (isLocalEnvironment) {
          console.log('📤 로컬 파일 시스템으로 폴백...');
          // 로컬 폴백 로직으로 계속 진행 (아래 코드 실행)
        } else if (isS3Enabled) {
          // 로컬이 안 되면 S3로 폴백
          console.log('📤 S3로 폴백...');
          const presignedUrls = await generatePresignedUrls(files, folder);
          return res.status(200).json({
            success: true,
            data: presignedUrls,
            storage: 's3',
            fallback: true,
            fallbackReason: vercelError.message,
          });
        } else {
          throw vercelError;
        }
      }
    }

    // 우선순위 2: 로컬 파일 시스템 (완전 무료, 로컬 개발 환경)
    // Vercel 같은 서버리스 환경에서는 작동하지 않으므로, 로컬 환경에서만 사용
    const isLocalEnvironment = !process.env.VERCEL;
    
    if (isLocalEnvironment) {
      console.log('📤 로컬 파일 시스템 사용 (완전 무료)');
      
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
        // 폴더 경로를 포함한 파일명 생성 (예: projects/pdfs/timestamp_filename.pdf)
        const fileNameWithFolder = `${folder}/${timestamp}_${safeName}`;
        // URL 인코딩된 파일명 (슬래시는 %2F로 인코딩)
        const encodedFileName = encodeURIComponent(fileNameWithFolder);
        
        // 업로드 URL: 상대 경로 사용 (브라우저가 자동으로 base URL 추가)
        const uploadUrl = `/api/upload-local/${encodedFileName}`;
        // 파일 URL: 상대 경로 사용 (일관성 유지)
        const fileUrl = `/${folder}/${timestamp}_${safeName}`;
        
        console.log(`📝 파일 URL 생성: ${file.filename}`);
        console.log(`📝 폴더 경로 포함 파일명: ${fileNameWithFolder}`);
        console.log(`📝 인코딩된 파일명: ${encodedFileName}`);
        console.log(`📝 업로드 URL: ${uploadUrl}`);
        console.log(`📝 파일 URL: ${fileUrl}`);
        
        return {
          uploadUrl: uploadUrl,
          fileUrl: fileUrl,
          key: fileNameWithFolder,
          method: 'PUT',
        };
      });

      console.log(`✅ 로컬 URL 생성 완료: ${localUrls.length}개 파일`);
      return res.status(200).json({
        success: true,
        data: localUrls,
        storage: 'local',
        localMode: true,
      });
    }

    // 우선순위 3: AWS S3 (유료, 사용량에 따라 비용 발생)
    if (isS3Enabled) {
      console.log('📤 AWS S3 사용 (유료)');
      const presignedUrls = await generatePresignedUrls(files, folder);
      return res.status(200).json({
        success: true,
        data: presignedUrls,
        storage: 's3',
      });
    }

    // 모든 스토리지가 없을 경우: 에러 반환
    console.error('❌ 사용 가능한 스토리지가 없습니다.');
    return res.status(500).json({
      success: false,
      error: '사용 가능한 스토리지가 없습니다. Vercel Blob Storage, 로컬 파일 시스템, 또는 AWS S3를 설정해주세요.',
    });
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
