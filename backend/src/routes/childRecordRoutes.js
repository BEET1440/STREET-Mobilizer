const express = require('express');
const router = express.Router();
const {
  registerChild,
  getRecords,
  verifyRecord,
  addIntervention,
  addTimelineEvent,
  recordAidDistribution,
} = require('../controllers/childRecordController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('write'), registerChild);
router.get('/', protect, authorize('read'), getRecords);
router.get('/verify/:biometricHash', protect, authorize('read'), verifyRecord);
router.post('/:id/intervention', protect, authorize('add_intervention'), addIntervention);
router.post('/:id/timeline', protect, authorize('update'), addTimelineEvent);
router.post('/:id/aid', protect, authorize('add_intervention'), recordAidDistribution);

module.exports = router;
