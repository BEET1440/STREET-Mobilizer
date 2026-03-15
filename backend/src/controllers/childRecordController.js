const ChildRecord = require('../models/ChildRecord');
const mockBlockchain = require('../../../blockchain/mock');
const missingChildService = require('../services/missingChildService');

// @desc    Register a new child record
// @route   POST /api/records
// @access  Private
exports.registerChild = async (req, res) => {
  try {
    const { name, age, gender, location, biometricHash, faceImage } = req.body;

    // Check if child record with biometricHash already exists
    const recordExists = await ChildRecord.findOne({ biometricHash });
    if (recordExists) {
      return res.status(400).json({ message: 'Child record with this biometric data already exists.' });
    }

    // 1. AI: Extract Face Biometrics
    const faceBiometricTemplate = await missingChildService.extractFaceBiometrics(faceImage || name);

    // 2. AI: Check for matches in Missing Persons Databases
    const allInternalRecords = await ChildRecord.find();
    const matchResult = await missingChildService.checkForMatch(faceBiometricTemplate, allInternalRecords);

    // Create a transaction on the mock blockchain
    const blockchainHash = mockBlockchain.createTransaction({
      name,
      age,
      gender,
      location,
      biometricHash,
      faceBiometricTemplate,
      isMissing: matchResult.isMatch
    }, req.user.email);

    const childRecord = await ChildRecord.create({
      name,
      age,
      gender,
      location,
      biometricHash,
      blockchainHash,
      faceBiometricTemplate,
      isMissing: matchResult.isMatch,
      missingMatchDetails: matchResult.isMatch ? {
        matchSource: matchResult.source,
        matchConfidence: matchResult.confidence,
        originalName: matchResult.originalName,
        parentContact: matchResult.parentContact
      } : undefined,
      registeredBy: req.user._id,
      auditLogs: [{
        action: 'REGISTERED',
        performedBy: req.user._id,
        organization: req.user.organization?.name || 'Unknown',
        details: 'Initial registration'
      }]
    });

    res.status(201).json({
      success: true,
      data: childRecord,
      matchAlert: matchResult.isMatch ? {
        message: `MATCH FOUND: This child potentially matches a missing person record from ${matchResult.source}!`,
        details: matchResult
      } : null
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

// @desc    Add intervention to a record
// @route   POST /api/records/:id/intervention
// @access  Private (Social Worker, Hospital, Shelter, NGO Admin)
exports.addIntervention = async (req, res) => {
  try {
    const { type, details } = req.body;
    const record = await ChildRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Child record not found' });
    }

    // Log to blockchain
    const blockchainRef = mockBlockchain.logIntervention(
      record._id,
      { type, details },
      req.user.email,
      req.user.organization?.name || 'Unknown'
    );

    const intervention = {
      organization: req.user.organization?.name || 'Unknown',
      type,
      details,
      performedBy: req.user._id,
      blockchainRef
    };

    record.interventions.push(intervention);
    
    // Add to audit log
    record.auditLogs.push({
      action: 'INTERVENTION_ADDED',
      performedBy: req.user._id,
      organization: req.user.organization?.name || 'Unknown',
      details: `Added ${type} intervention`
    });

    await record.save();

    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
