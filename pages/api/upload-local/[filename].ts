import type { NextApiRequest, NextApiResponse } from 'next';
import { writeFile } from 'fs/promises';
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

  try {
    const { filename } = req.query;
    
    if (!filename || typeof filename !== 'string') {
      console.error('❌ 파일명 없음');
      return res.status(400).json({ error: '파일명이 필요합니다' });
    }

    console.log(`📤 로컬 파일 업로드 요청: ${filename}`);
    console.log(`📋 Content-Type: ${req.headers['content-type']}`);
    console.log(`📋 Content-Length: ${req.headers['content-length']}`);
    console.log(`📋 요청 읽기 가능: ${req.readable}`);
    console.log(`📋 요청 종료됨: ${req.readableEnded}`);
    
    // public/projects 폴더 경로
    const uploadDir = join(process.cwd(), 'public', 'projects');
    console.log(`📂 업로드 디렉토리: ${uploadDir}`);
    
    // 폴더가 없으면 생성
    if (!existsSync(uploadDir)) {
      console.log('📁 폴더 생성 중...');
      mkdirSync(uploadDir, { recursive: true });
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
          const filePath = join(uploadDir, filename);
          
          console.log(`💾 파일 저장 중: ${filePath} (${buffer.length} bytes)`);
          await writeFile(filePath, buffer);
          console.log(`✅ 파일 저장 완료: ${filename}`);
          
          const fileUrl = `/projects/${filename}`;
          
          if (!res.headersSent) {
            res.status(200).json({
              success: true,
              url: fileUrl,
              fileUrl: fileUrl,
              message: '파일이 업로드되었습니다.',
            });
            console.log(`📤 응답 전송 완료: ${fileUrl}`);
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

