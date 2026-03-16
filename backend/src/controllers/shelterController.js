const Shelter = require('../models/Shelter');

// @desc    Get all shelters with real-time availability
// @route   GET /api/shelters
// @access  Private
exports.getShelters = async (req, res) => {
  try {
    const shelters = await Shelter.find().sort({ occupied: 1 }); // Prefer less occupied ones
    res.status(200).json({
      success: true,
      count: shelters.length,
      data: shelters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update shelter occupancy
// @route   PUT /api/shelters/:id/occupancy
// @access  Private (Shelter Admin)
exports.updateOccupancy = async (req, res) => {
  try {
    const { occupied } = req.body;
    const shelter = await Shelter.findById(req.params.id);

    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    if (occupied > shelter.capacity) {
      return res.status(400).json({ message: 'Occupancy cannot exceed capacity' });
    }

    shelter.occupied = occupied;
    shelter.updatedAt = Date.now();
    await shelter.save();

    res.status(200).json({
      success: true,
      data: shelter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create a new shelter
// @route   POST /api/shelters
// @access  Private (Admin)
exports.createShelter = async (req, res) => {
  try {
    const shelter = await Shelter.create(req.body);
    res.status(201).json({
      success: true,
      data: shelter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
