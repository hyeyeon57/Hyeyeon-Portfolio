const express = require('express');
const {
  getHeaderLogo,
  updateHeaderLogo,
  deleteHeaderLogo,
} = require('../controllers/headerLogoController.cjs');
const { requireAuth } = require('../middleware/auth.cjs');
const { asyncHandler } = require('../utils/asyncHandler.cjs');
const multer = require('multer');
const path = require('path');
const { PUBLIC_DIR } = require('../utils/pathHelpers.cjs');
const fs = require('fs');

const router = express.Router();

// logo 폴더 생성 (로컬 환경에서만)
if (!process.env.VERCEL) {
  const logoDir = path.join(PUBLIC_DIR, 'logo');
  if (!fs.existsSync(logoDir)) {
    try {
      fs.mkdirSync(logoDir, { recursive: true });
    } catch (error) {
      console.warn('[headerLogoRoutes] 폴더 생성 실패 (무시):', error?.message);
    }
  }
}

// multer 설정
const storage = process.env.VERCEL
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: function (req, file, cb) {
        const tempDir = path.join(PUBLIC_DIR, 'temp');
        if (!fs.existsSync(tempDir)) {
          try {
            fs.mkdirSync(tempDir, { recursive: true });
          } catch (error) {
            console.warn('[headerLogoRoutes] temp 폴더 생성 실패 (무시):', error?.message);
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
    fileSize: 5 * 1024 * 1024, // 5MB 제한
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
    }
  },
});

// GET /api/header-logo - 헤더 로고 정보 조회
router.get('/', asyncHandler(getHeaderLogo));

// PUT /api/header-logo - 헤더 로고 업로드/업데이트
router.put(
  '/',
  requireAuth,
  (req, res, next) => {
    if (req.headers['content-type']?.includes('application/json')) {
      return next();
    } else {
      return upload.single('file')(req, res, next);
    }
  },
  asyncHandler(updateHeaderLogo)
);

// DELETE /api/header-logo - 헤더 로고 삭제
router.delete('/', requireAuth, asyncHandler(deleteHeaderLogo));

module.exports = router;

