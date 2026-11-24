const express = require('express');
const {
  getHeroSliders,
  getAllSliders,
  getHeroSliderDetail,
  postHeroSlider,
  putHeroSlider,
  deleteHeroSliderById,
} = require('../controllers/heroSliderController.cjs');
const { uploadImages } = require('../middleware/uploads.cjs');
const { asyncHandler } = require('../utils/asyncHandler.cjs');
const { requireAuth } = require('../middleware/auth.cjs');

const router = express.Router();

// 공개 API: 활성화된 슬라이더만 조회
router.get('/', asyncHandler(getHeroSliders));

// 관리자용: 전체 슬라이더 조회
router.get('/all', requireAuth, asyncHandler(getAllSliders));

// 상세 조회
router.get('/:id', asyncHandler(getHeroSliderDetail));

// 생성 (인증 필요)
router.post(
  '/',
  requireAuth,
  (req, res, next) => {
    uploadImages.single('image')(req, res, (err) => {
      if (err) {
        console.error('[heroSliderRoutes] 파일 업로드 에러:', err);
        return res.status(400).json({ success: false, error: err.message || '파일 업로드 실패' });
      }
      next();
    });
  },
  asyncHandler(postHeroSlider)
);

// 수정 (인증 필요)
router.put(
  '/:id',
  requireAuth,
  (req, res, next) => {
    uploadImages.single('image')(req, res, (err) => {
      if (err) {
        console.error('[heroSliderRoutes] 파일 업로드 에러:', err);
        return res.status(400).json({ success: false, error: err.message || '파일 업로드 실패' });
      }
      next();
    });
  },
  asyncHandler(putHeroSlider)
);

// 삭제 (인증 필요)
router.delete('/:id', requireAuth, asyncHandler(deleteHeroSliderById));

module.exports = router;

