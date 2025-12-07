const Document = require('../models/Document.cjs');
const { connectDB } = require('../config/database.cjs');
const { ok, fail } = require('../utils/httpResponse.cjs');
const { PUBLIC_DIR } = require('../utils/pathHelpers.cjs');
const path = require('path');
const fs = require('fs').promises;

/**
 * 문서 정보 조회 (이력서/자기소개서)
 */
const getDocuments = async (req, res) => {
  try {
    await connectDB();
    
    const documents = await Document.find({}).sort({ type: 1 });
    
    // 기본값 설정
    const result = {
      resume: null,
      coverLetter: null,
    };
    
    // MongoDB에서 조회
    documents.forEach(doc => {
      if (doc.type === 'resume') {
        result.resume = {
          url: doc.url,
          fileName: doc.fileName,
          updatedAt: doc.updatedAt,
        };
      } else if (doc.type === 'coverLetter') {
        result.coverLetter = {
          url: doc.url,
          fileName: doc.fileName,
          updatedAt: doc.updatedAt,
        };
      }
    });
    
    return ok(res, { data: result, message: '문서 정보를 조회했습니다.' });
  } catch (error) {
    console.error('[documentController] 문서 조회 실패:', error);
    return fail(res, 500, `문서 정보를 조회하는데 실패했습니다: ${error.message || '알 수 없는 오류'}`);
  }
};

/**
 * 문서 업로드/업데이트
 */
const updateDocument = async (req, res) => {
  try {
    await connectDB();
    
    const { type } = req.params; // URL 파라미터에서 가져오기
    
    if (!type || !['resume', 'coverLetter'].includes(type)) {
      return fail(res, 400, '문서 타입이 올바르지 않습니다. (resume 또는 coverLetter)');
    }
    
    let url, fileName;
    
    // JSON으로 URL을 받는 경우 (클라이언트에서 uploadFilesToS3로 업로드한 후)
    if (req.headers['content-type']?.includes('application/json')) {
      const body = req.body;
      url = body.url;
      fileName = body.fileName || `document_${Date.now()}.pdf`;
      
      if (!url || typeof url !== 'string') {
        return fail(res, 400, 'URL이 제공되지 않았습니다.');
      }
      
      console.log('[documentController] JSON으로 URL 받음:', { type, url, fileName });
    } else {
      // 기존 방식: multer로 파일을 받는 경우
      const file = req.file;
      
      if (!file) {
        return fail(res, 400, '파일이 업로드되지 않았습니다.');
      }
      
      // PDF 파일만 허용
      if (file.mimetype !== 'application/pdf') {
        return fail(res, 400, 'PDF 파일만 업로드 가능합니다.');
      }
      
      // documents 폴더에 저장 (로컬 환경에서만)
      // Vercel 환경에서는 파일 시스템 접근 불가
      if (process.env.VERCEL) {
        return fail(res, 400, 'Vercel 환경에서는 파일 업로드가 지원되지 않습니다. Vercel Blob Storage 또는 S3를 사용해주세요.');
      }
      
      const documentsDir = path.join(PUBLIC_DIR, 'documents');
      try {
        await fs.mkdir(documentsDir, { recursive: true });
      } catch (mkdirError) {
        console.warn('[documentController] 폴더 생성 실패 (무시):', mkdirError?.message);
        // 폴더가 이미 존재할 수 있으므로 계속 진행
      }
      
      // 원본 파일명 사용 (확장자 포함)
      const originalFileName = file.originalname || `document_${Date.now()}.pdf`;
      const fileExt = path.extname(originalFileName) || '.pdf';
      const baseFileName = path.basename(originalFileName, fileExt);
      
      // 파일명 생성: 타입별 접두사 + 원본 파일명
      fileName = `${type === 'resume' ? 'resume_' : 'coverletter_'}${baseFileName}${fileExt}`;
      const filePath = path.join(documentsDir, fileName);
      
      // 기존 파일이 있으면 삭제 (같은 타입의 모든 파일 삭제)
      // Vercel 환경에서는 파일 시스템 접근 불가
      if (!process.env.VERCEL) {
        try {
          const existingDocs = await Document.find({ type });
          for (const doc of existingDocs) {
            const oldFilePath = path.join(PUBLIC_DIR, doc.url);
            try {
              await fs.access(oldFilePath);
              await fs.unlink(oldFilePath);
            } catch (err) {
              // 파일이 없으면 무시
            }
          }
        } catch (err) {
          // 기존 파일 삭제 실패는 무시
        }
        
        // 새 파일 저장
        if (file.path) {
          await fs.rename(file.path, filePath);
        } else if (file.buffer) {
          // 메모리 스토리지인 경우 (Vercel)
          await fs.writeFile(filePath, file.buffer);
        } else {
          throw new Error('파일 데이터를 찾을 수 없습니다.');
        }
      } else {
        // Vercel 환경에서는 파일 시스템 저장 불가
        throw new Error('Vercel 환경에서는 파일 업로드가 지원되지 않습니다. Vercel Blob Storage 또는 S3를 사용해주세요.');
      }
      
      // URL 생성 (public 경로 기준)
      url = `/documents/${fileName}`;
      fileName = originalFileName;
      
      console.log('[documentController] 파일로 업로드:', { type, url, fileName });
    }
    
    // MongoDB에 저장 또는 업데이트
    const document = await Document.findOneAndUpdate(
      { type },
      {
        type,
        url,
        fileName: fileName, // 원본 파일명 저장
        updatedAt: new Date(),
      },
      {
        upsert: true, // 없으면 생성, 있으면 업데이트
        new: true,
      }
    );
    
    console.log('[documentController] 문서 저장 완료:', {
      type: document.type,
      url: document.url,
      fileName: document.fileName
    });
    
    return ok(res, {
      data: {
        type: document.type,
        url: document.url,
        fileName: document.fileName,
        updatedAt: document.updatedAt,
      },
      message: '문서가 업로드되었습니다.',
    });
  } catch (error) {
    console.error('[documentController] 문서 업로드 실패:', error);
    return fail(res, 500, `문서 업로드에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
  }
};

/**
 * 문서 삭제
 */
const deleteDocument = async (req, res) => {
  try {
    await connectDB();
    
    const { type } = req.params;
    
    if (!type || !['resume', 'coverLetter'].includes(type)) {
      return fail(res, 400, '문서 타입이 올바르지 않습니다.');
    }
    
    const document = await Document.findOne({ type });
    
    if (!document) {
      return fail(res, 404, '문서를 찾을 수 없습니다.');
    }
    
    // 파일 삭제 (로컬 환경에서만)
    if (!process.env.VERCEL) {
      const filePath = path.join(PUBLIC_DIR, document.url);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn('파일 삭제 실패 (무시):', err?.message);
        // 파일이 없거나 이미 삭제된 경우 무시
      }
    } else {
      // Vercel 환경에서는 파일 시스템 접근 불가
      console.log('[documentController] Vercel 환경: 파일 시스템 삭제 건너뜀');
    }
    
    // MongoDB에서 삭제
    await Document.deleteOne({ type });
    
    return ok(res, { message: '문서가 삭제되었습니다.' });
  } catch (error) {
    console.error('[documentController] 문서 삭제 실패:', error);
    return fail(res, 500, `문서 삭제에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
  }
};

module.exports = {
  getDocuments,
  updateDocument,
  deleteDocument,
};

