const express = require('express');
const { healthCheck } = require('../controllers/healthController.cjs');
const { asyncHandler } = require('../utils/asyncHandler.cjs');

const router = express.Router();

router.get('/health', asyncHandler(healthCheck));

module.exports = router;
