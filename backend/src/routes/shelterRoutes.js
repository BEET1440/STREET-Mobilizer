const express = require('express');
const router = express.Router();
const {
  getShelters,
  updateOccupancy,
  createShelter
} = require('../controllers/shelterController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, authorize('read'), getShelters);
router.post('/', protect, authorize('admin'), createShelter);
router.put('/:id/occupancy', protect, authorize('shelter_admin'), updateOccupancy);

module.exports = router;
