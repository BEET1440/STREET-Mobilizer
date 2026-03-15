const ChildRecord = require('../models/ChildRecord');
const mockBlockchain = require('../../../blockchain/mock');

// @desc    Register a new child record
// @route   POST /api/records
// @access  Private
exports.registerChild = async (req, res) => {
  try {
    const { name, age, gender, location, biometricHash } = req.body;

    // Check if child record with biometricHash already exists
    const recordExists = await ChildRecord.findOne({ biometricHash });
    if (recordExists) {
      return res.status(400).json({ message: 'Child record with this biometric data already exists.' });
    }

    // Create a transaction on the mock blockchain
    const blockchainHash = mockBlockchain.createTransaction({
      name,
      age,
      gender,
      location,
      biometricHash,
    });

    const childRecord = await ChildRecord.create({
      name,
      age,
      gender,
      location,
      biometricHash,
      blockchainHash,
      registeredBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: childRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all child records
// @route   GET /api/records
// @access  Private
exports.getRecords = async (req, res) => {
  try {
    const records = await ChildRecord.find().populate('registeredBy', 'name email');
    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get record by biometric hash (verification)
// @route   GET /api/records/verify/:biometricHash
// @access  Private
exports.verifyRecord = async (req, res) => {
  try {
    const { biometricHash } = req.params;

    // Find in database
    const dbRecord = await ChildRecord.findOne({ biometricHash });
    if (!dbRecord) {
      return res.status(404).json({ message: 'No record found with this biometric data.' });
    }

    // Verify against blockchain
    const blockchainRecord = mockBlockchain.getRecord(biometricHash);
    if (!blockchainRecord) {
      return res.status(404).json({ message: 'Record not found in the blockchain!' });
    }

    // Compare data to ensure integrity
    const isIntact = dbRecord.name === blockchainRecord.name &&
                     dbRecord.age === blockchainRecord.age &&
                     dbRecord.gender === blockchainRecord.gender;

    if (!isIntact) {
      return res.status(400).json({
        message: 'Data integrity compromised! Blockchain record does not match database record.',
        dbRecord,
        blockchainRecord
      });
    }

    res.status(200).json({
      success: true,
      message: 'Record verified successfully on the blockchain.',
      data: dbRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
