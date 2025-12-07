import type { NextApiRequest, NextApiResponse } from 'next';
import { writeFile, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Next.js body parser 비활성화 (raw body 필요)
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * 로컬 환경에서 파일을 직접 업로드하는 엔드포인트
 * HTML 관리자 페이지의 PUT 요청을 처리
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed. Use PUT.' });
  }

  // Vercel 서버리스 환경에서는 로컬 파일 저장 불가
  if (process.env.VERCEL) {
    console.warn('⚠️ Vercel 환경에서는 로컬 파일 저장이 불가능합니다. Vercel Blob Storage 또는 S3를 사용해주세요.');
    return res.status(400).json({
      success: false,
      error: 'Vercel 환경에서는 로컬 파일 저장이 불가능합니다. Vercel Blob Storage 또는 S3를 사용해주세요.',
      storage: 'vercel',
    });
  }

  try {
    let { filename } = req.query;
    
    // Next.js 동적 라우트에서 배열로 올 수 있으므로 처리
    if (Array.isArray(filename)) {
      filename = filename.join('/');
    }
    
    if (!filename || typeof filename !== 'string') {
      console.error('❌ 파일명 없음:', req.query);
      return res.status(400).json({ error: '파일명이 필요합니다' });
    }
    
    // URL 디코딩 (인코딩된 슬래시 %2F를 /로 변환)
    try {
      filename = decodeURIComponent(filename);
    } catch (decodeError) {
      console.warn('⚠️ URL 디코딩 실패, 원본 사용:', decodeError);
      // 디코딩 실패 시 원본 사용
    }
    
    console.log(`📤 로컬 파일 업로드 요청 (디코딩 후): ${filename}`);
    console.log(`📋 Content-Type: ${req.headers['content-type']}`);
    console.log(`📋 Content-Length: ${req.headers['content-length']}`);
    
    // 파일명에서 폴더 경로 추출 (예: "projects/pdfs/filename.pdf" 또는 "projects/filename.pdf")
    // API 경로는 /api/upload-local/[filename]이므로 filename에 폴더가 포함될 수 있음
    let targetFolder = 'projects';
    let targetFilename = filename;
    
    // 파일명에 슬래시가 있으면 폴더 경로가 포함된 것
    if (filename.includes('/')) {
      const parts = filename.split('/');
      const originalParts = [...parts]; // 로그용 복사본
      targetFilename = parts.pop() || filename; // 마지막 부분이 파일명
      targetFolder = parts.join('/'); // 나머지가 폴더 경로
      console.log(`📂 파일명에서 폴더 경로 추출:`, { 
        원본파일명: filename,
        원본parts: originalParts,
        pop후parts: parts,
        folder: targetFolder, 
        filename: targetFilename 
      });
      
      // 폴더 경로 검증
      if (!targetFolder || targetFolder.trim() === '') {
        console.warn('⚠️ 추출된 폴더 경로가 비어있음, 기본 폴더 사용');
        targetFolder = 'projects';
      }
      
      // 중첩 폴더 생성 확인 (예: projects/pdfs)
      console.log(`📂 중첩 폴더 경로 확인: ${targetFolder}`);
    } else {
      console.log(`📂 폴더 경로 없음, 기본 폴더 사용: ${targetFolder}`);
    }
    
    // public 폴더 기준으로 업로드 디렉토리 경로 구성
    // targetFolder가 "projects/pdfs"인 경우 "public/projects/pdfs"로 생성
    const publicDir = join(process.cwd(), 'public');
    const uploadDir = join(publicDir, targetFolder);
    
    console.log(`📂 디렉토리 정보:`, {
      processCwd: process.cwd(),
      publicDir: publicDir,
      targetFolder: targetFolder,
      uploadDir: uploadDir,
      publicDirExists: existsSync(publicDir),
      uploadDirExists: existsSync(uploadDir)
    });
    
    // public 폴더 존재 확인
    if (!existsSync(publicDir)) {
      console.error(`❌ public 폴더가 존재하지 않습니다: ${publicDir}`);
      throw new Error(`public 폴더가 존재하지 않습니다: ${publicDir}`);
    }
    
    // 폴더가 없으면 재귀적으로 생성 (중첩 폴더 포함)
    if (!existsSync(uploadDir)) {
      console.log(`📁 폴더 생성 중: ${uploadDir} (recursive: true)`);
      try {
        mkdirSync(uploadDir, { recursive: true });
        console.log(`✅ 폴더 생성 완료: ${uploadDir}`);
        
        // 생성 확인
        if (existsSync(uploadDir)) {
          console.log(`✅ 폴더 존재 확인됨: ${uploadDir}`);
        } else {
          console.error(`❌ 폴더 생성 후에도 존재하지 않음: ${uploadDir}`);
          throw new Error(`폴더 생성 후에도 존재하지 않음: ${uploadDir}`);
        }
      } catch (mkdirError) {
        console.error(`❌ 폴더 생성 실패: ${uploadDir}`, mkdirError);
        throw new Error(`폴더 생성 실패: ${mkdirError instanceof Error ? mkdirError.message : String(mkdirError)}`);
      }
    } else {
      console.log(`✅ 폴더 이미 존재: ${uploadDir}`);
    }

    // 파일 데이터 읽기
    const chunks: Buffer[] = [];
    let totalSize = 0;
    let dataReceived = false;
    
    return new Promise<void>((resolve) => {
      // 타임아웃 설정 (30초)
      const timeout = setTimeout(() => {
        console.error('❌ 요청 타임아웃');
        console.error(`📊 수신된 데이터: ${totalSize} bytes, 청크 수: ${chunks.length}`);
        if (!res.headersSent) {
          res.status(408).json({
            success: false,
            error: '요청 타임아웃',
          });
        }
        resolve();
      }, 30000);

      console.log('⏳ 데이터 수신 대기 중...');
      
      req.on('data', (chunk: Buffer) => {
        dataReceived = true;
        chunks.push(chunk);
        totalSize += chunk.length;
        console.log(`📥 데이터 수신 중: ${totalSize} bytes (청크 크기: ${chunk.length} bytes)`);
      });

      req.on('end', async () => {
        clearTimeout(timeout);
        console.log(`📥 데이터 수신 완료: 총 ${totalSize} bytes, 청크 수: ${chunks.length}`);
        try {
          if (chunks.length === 0 && !dataReceived) {
            console.error('❌ 데이터 없음 - end 이벤트는 발생했지만 데이터가 수신되지 않음');
            if (!res.headersSent) {
              res.status(400).json({
                success: false,
                error: '파일 데이터가 없습니다',
              });
            }
            resolve();
            return;
          }

          const buffer = Buffer.concat(chunks);
          const filePath = join(uploadDir, targetFilename);
          
          console.log(`💾 파일 저장 시작:`, {
            filePath,
            bufferLength: buffer.length,
            targetFolder,
            targetFilename,
            uploadDir,
            folderExists: existsSync(uploadDir)
          });
          
          // 파일 저장
          try {
            await writeFile(filePath, buffer);
            console.log(`✅ writeFile 완료: ${filePath}`);
          } catch (writeError) {
            console.error('❌ writeFile 실패:', writeError);
            throw writeError;
          }
          
          // 파일이 실제로 저장되었는지 확인
          let fileStats;
          try {
            const fileExists = existsSync(filePath);
            console.log(`📋 파일 존재 확인: ${fileExists}`);
            
            if (!fileExists) {
              throw new Error(`파일이 저장되지 않았습니다: ${filePath}`);
            }
            
            fileStats = await stat(filePath);
            console.log(`📋 파일 정보:`, {
              size: fileStats.size,
              isFile: fileStats.isFile(),
              created: fileStats.birthtime,
              modified: fileStats.mtime
            });
            
            // 파일 크기 검증
            if (fileStats.size !== buffer.length) {
              console.warn(`⚠️ 파일 크기 불일치: 예상 ${buffer.length} bytes, 실제 ${fileStats.size} bytes`);
            }
            
            if (fileStats.size === 0) {
              throw new Error(`파일이 비어있습니다: ${filePath}`);
            }
          } catch (statError) {
            console.error('❌ 파일 검증 실패:', statError);
            throw new Error(`파일 저장 후 검증 실패: ${statError instanceof Error ? statError.message : String(statError)}`);
          }
          
          console.log(`✅ 파일 저장 및 검증 완료: ${targetFilename} (${fileStats.size} bytes)`);
          
          // 반환할 파일 URL: 폴더 경로 + 파일명
          const fileUrl = `/${targetFolder}/${targetFilename}`;
          console.log(`✅ 파일 URL 생성:`, {
            fileUrl,
            targetFolder,
            targetFilename,
            실제파일크기: fileStats.size,
            버퍼크기: buffer.length
          });
          
          if (!res.headersSent) {
            const responseData = {
              success: true,
              url: fileUrl,
              fileUrl: fileUrl,
              message: '파일이 업로드되었습니다.',
              size: fileStats.size,
            };
            console.log(`📤 응답 데이터:`, responseData);
            res.status(200).json(responseData);
            console.log(`📤 응답 전송 완료: ${fileUrl}`);
          } else {
            console.warn('⚠️ 응답이 이미 전송되었습니다.');
          }
          resolve();
        } catch (error: any) {
          clearTimeout(timeout);
          console.error('❌ 파일 저장 오류:', error);
          console.error('❌ 에러 상세:', error instanceof Error ? error.stack : String(error));
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              error: error.message || '파일 저장 실패',
            });
          }
          resolve();
        }
      });

      req.on('error', (error) => {
        clearTimeout(timeout);
        console.error('❌ 요청 오류:', error);
        console.error('❌ 에러 상세:', error instanceof Error ? error.stack : String(error));
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: '요청 처리 중 오류가 발생했습니다.',
          });
        }
        resolve();
      });

      // 요청이 이미 종료된 경우 처리
      if (req.readableEnded) {
        clearTimeout(timeout);
        console.log('⚠️ 요청이 이미 종료됨 - readableEnded가 true');
        // 이미 종료된 경우에도 데이터가 있을 수 있으므로 처리 시도
        if (chunks.length > 0) {
          console.log('⚠️ 종료된 요청에서 데이터 발견, 처리 시도...');
          req.emit('end');
        } else {
          resolve();
        }
      }
      
      // 요청이 pause 상태인 경우 resume
      if (req.isPaused && req.isPaused()) {
        console.log('▶️ 요청이 pause 상태, resume 시도...');
        req.resume();
      }
    });
  } catch (error: any) {
    console.error('❌ 업로드 오류:', error);
    console.error('❌ 에러 상세:', error instanceof Error ? error.stack : String(error));
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: error.message || '업로드 실패',
      });
    }
  }
}

