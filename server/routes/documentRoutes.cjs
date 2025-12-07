const express = require('express');
const {
  getDocuments,
  updateDocument,
  deleteDocument,
} = require('../controllers/documentController.cjs');
const { requireAuth } = require('../middleware/auth.cjs');
const { asyncHandler } = require('../utils/asyncHandler.cjs');
const multer = require('multer');
const path = require('path');
const { PUBLIC_DIR } = require('../utils/pathHelpers.cjs');
const fs = require('fs');

const router = express.Router();

// documents 폴더 생성 (로컬 환경에서만)
if (!process.env.VERCEL) {
  const documentsDir = path.join(PUBLIC_DIR, 'documents');
  if (!fs.existsSync(documentsDir)) {
    try {
      fs.mkdirSync(documentsDir, { recursive: true });
    } catch (error) {
      console.warn('[documentRoutes] 폴더 생성 실패 (무시):', error?.message);
    }
  }
}

// multer 설정 (임시 저장 후 컨트롤러에서 이동)
// Vercel 환경에서는 메모리 스토리지 사용 (파일 시스템 접근 불가)
const storage = process.env.VERCEL
  ? multer.memoryStorage() // Vercel: 메모리 스토리지
  : multer.diskStorage({
      destination: function (req, file, cb) {
        const tempDir = path.join(PUBLIC_DIR, 'temp');
        if (!fs.existsSync(tempDir)) {
          try {
            fs.mkdirSync(tempDir, { recursive: true });
          } catch (error) {
            console.warn('[documentRoutes] temp 폴더 생성 실패 (무시):', error?.message);
          }
        }
        cb(null, tempDir);
      },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB 제한 (이력서/자기소개서 PDF용)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('PDF 파일만 업로드 가능합니다.'), false);
    }
  },
});

// GET /api/documents - 문서 정보 조회
router.get('/', asyncHandler(getDocuments));

// PUT /api/documents/:type - 문서 업로드/업데이트
// JSON으로 URL을 받거나, FormData로 파일을 받을 수 있음
router.put(
  '/:type',
  requireAuth,
  // Content-Type이 application/json이면 multer 미들웨어를 건너뛰고, 그렇지 않으면 파일 업로드
  (req, res, next) => {
    if (req.headers['content-type']?.includes('application/json')) {
      // JSON 요청이면 multer 없이 다음 미들웨어로
      return next();
    } else {
      // FormData 요청이면 multer 사용
      return upload.single('file')(req, res, next);
    }
  },
  asyncHandler(updateDocument)
);

// DELETE /api/documents/:type - 문서 삭제
router.delete('/:type', requireAuth, asyncHandler(deleteDocument));

module.exports = router;

