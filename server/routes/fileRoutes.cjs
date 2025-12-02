const express = require('express');
const { uploadPdf } = require('../middleware/uploads.cjs');
const { uploadPdfHandler } = require('../controllers/fileController.cjs');
const { asyncHandler } = require('../utils/asyncHandler.cjs');

const router = express.Router();

router.post(
  '/upload-pdf',
  (req, res, next) => {
    uploadPdf.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err.message || 'PDF 파일 업로드에 실패했습니다.',
        });
      }
      return next();
    });
  },
  asyncHandler(uploadPdfHandler)
);

module.exports = router;
