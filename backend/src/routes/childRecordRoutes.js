const express = require('express');
const router = express.Router();
const {
  registerChild,
  getRecords,
  verifyRecord,
} = require('../controllers/childRecordController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, registerChild);
router.get('/', protect, getRecords);
router.get('/verify/:biometricHash', protect, verifyRecord);

module.exports = router;
