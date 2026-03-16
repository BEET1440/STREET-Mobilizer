const ChildRecord = require('../models/ChildRecord');
const mockBlockchain = require('../../../blockchain/mock');
const missingChildService = require('../services/missingChildService');
const riskAssessmentService = require('../services/riskAssessmentService');

// Helper to generate SM-ID (Temporary Digital ID)
// Format: SM-KE-2026-004321
const generateSmId = async () => {
  const year = new Date().getFullYear();
  const countryCode = 'KE'; // Default for now
  const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random
  const smId = `SM-${countryCode}-${year}-${randomNum}`;
  
  // Basic check for uniqueness (for production, use a more robust sequence/counter)
  const existing = await ChildRecord.findOne({ smId });
  if (existing) return generateSmId(); 
  
  return smId;
};

// @desc    Register a new child record
// @route   POST /api/records
// @access  Private
exports.registerChild = async (req, res) => {
  try {
    const { 
      name, age, gender, location, biometricHash, faceImage, 
      geolocation, timeOnStreets, groupAssociations, healthCondition 
    } = req.body;

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

    // 3. AI: Assess Risk Level
    const riskAssessment = await riskAssessmentService.assessRisk({
      age, geolocation, timeOnStreets, groupAssociations, healthCondition
    });

    // 4. Generate Temporary Digital ID (SM-ID)
    const smId = await generateSmId();

    // Create a transaction on the mock blockchain
    const blockchainHash = mockBlockchain.createTransaction({
      smId,
      name,
      age,
      gender,
      location,
      biometricHash,
      faceBiometricTemplate,
      isMissing: matchResult.isMatch,
      riskLevel: riskAssessment.level
    }, req.user.email);

    // Initial Timeline Event
    const initialEvent = {
      eventType: 'IDENTIFIED',
      description: `Child identified and registered at ${location} with Temporary ID: ${smId}`,
      organization: req.user.organization?.name || 'Unknown',
      blockchainHash
    };

    const childRecord = await ChildRecord.create({
      smId,
      name,
      age,
      gender,
      location,
      geolocation,
      timeOnStreets,
      groupAssociations,
      healthCondition,
      biometricHash,
      blockchainHash,
      faceBiometricTemplate,
      isMissing: matchResult.isMatch,
      riskAssessment,
      timeline: [initialEvent],
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
        details: `Initial registration and risk assessment. Assigned SM-ID: ${smId}`
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

// @desc    Record aid distribution for a child
// @route   POST /api/records/:id/aid
// @access  Private
exports.recordAidDistribution = async (req, res) => {
  try {
    const { itemType, quantity, description } = req.body;
    const record = await ChildRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Child record not found' });
    }

    // Create a transaction on the mock blockchain for aid distribution
    const blockchainHash = mockBlockchain.createTransaction({
      recordId: record._id,
      itemType,
      quantity,
      description,
      type: 'AID_DISTRIBUTION',
      timestamp: Date.now()
    }, req.user.email);

    const aidEntry = {
      itemType,
      quantity,
      description,
      organization: req.user.organization?.name || 'Unknown',
      performedBy: req.user._id,
      blockchainHash
    };

    record.aidDistributions.push(aidEntry);
    
    // Add to audit log
    record.auditLogs.push({
      action: 'AID_DISTRIBUTED',
      performedBy: req.user._id,
      organization: req.user.organization?.name || 'Unknown',
      details: `Distributed ${quantity} of ${itemType}: ${description}`
    });

    // Also add to timeline for visibility
    record.timeline.push({
      eventType: 'FOLLOW_UP',
      description: `Received ${itemType} aid: ${description}`,
      organization: req.user.organization?.name || 'Unknown',
      blockchainHash
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

// @desc    Add event to child life timeline
// @route   POST /api/records/:id/timeline
// @access  Private
exports.addTimelineEvent = async (req, res) => {
  try {
    const { eventType, description } = req.body;
    const record = await ChildRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Child record not found' });
    }

    // Log to blockchain
    const blockchainHash = mockBlockchain.createTransaction({
      recordId: record._id,
      eventType,
      description,
      timestamp: Date.now()
    }, req.user.email);

    const timelineEvent = {
      eventType,
      description,
      organization: req.user.organization?.name || 'Unknown',
      blockchainHash
    };

    record.timeline.push(timelineEvent);
    
    // Add to audit log
    record.auditLogs.push({
      action: 'UPDATED',
      performedBy: req.user._id,
      organization: req.user.organization?.name || 'Unknown',
      details: `Timeline event added: ${eventType}`
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
