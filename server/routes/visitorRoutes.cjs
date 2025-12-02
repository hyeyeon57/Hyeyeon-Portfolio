const express = require('express');
const {
  postVisitor,
  getVisitorStats,
  getMonthlyVisitorStats,
  getVisitors,
  deleteVisitors,
} = require('../controllers/visitorController.cjs');
const { asyncHandler } = require('../utils/asyncHandler.cjs');

const router = express.Router();

router.post('/', asyncHandler(postVisitor));
router.get('/stats', asyncHandler(getVisitorStats));
router.get('/monthly', asyncHandler(getMonthlyVisitorStats));
router.get('/', asyncHandler(getVisitors));
router.delete('/', asyncHandler(deleteVisitors));

module.exports = router;
