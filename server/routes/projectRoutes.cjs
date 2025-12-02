const express = require('express');
const {
  getProjects,
  getProjectDetail,
  postProject,
  putProject,
  deleteProjectById,
  getProjectFilesHandler,
  downloadProjectFile,
} = require('../controllers/projectController.cjs');
const { uploadImages } = require('../middleware/uploads.cjs');
const { asyncHandler } = require('../utils/asyncHandler.cjs');

const router = express.Router();

router.get('/', asyncHandler(getProjects));
router.get('/:id', asyncHandler(getProjectDetail));
router.post(
  '/',
  uploadImages.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 9 }
  ]),
  asyncHandler(postProject)
);
router.put(
  '/:id',
  uploadImages.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 9 }
  ]),
  asyncHandler(putProject)
);
router.delete('/:id', asyncHandler(deleteProjectById));
router.get('/:id/files', asyncHandler(getProjectFilesHandler));
router.get('/:id/files/:filename', asyncHandler(downloadProjectFile));

module.exports = router;
