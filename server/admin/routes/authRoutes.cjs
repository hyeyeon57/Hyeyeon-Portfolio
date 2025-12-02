const express = require('express');
const { login, logout, check } = require('../controllers/authController.cjs');
const { asyncHandler } = require('../../utils/asyncHandler.cjs');

const router = express.Router();

router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/check', asyncHandler(check));

module.exports = router;
