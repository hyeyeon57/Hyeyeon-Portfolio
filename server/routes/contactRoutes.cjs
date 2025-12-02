const express = require('express');
const {
  postContact,
  getContacts,
  putReadContact,
  deleteContactById,
} = require('../controllers/contactController.cjs');
const { asyncHandler } = require('../utils/asyncHandler.cjs');

const router = express.Router();

router.post('/', asyncHandler(postContact));
router.get('/', asyncHandler(getContacts));
router.put('/:id/read', asyncHandler(putReadContact));
router.delete('/:id', asyncHandler(deleteContactById));

module.exports = router;
