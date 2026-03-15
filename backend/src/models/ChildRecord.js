const mongoose = require('mongoose');

const childRecordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  geolocation: {
    lat: Number,
    lng: Number,
    accuracy: Number,
  },
  biometricHash: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  blockchainHash: {
    type: String,
  },
  isMissing: {
    type: Boolean,
    default: false,
  },
  missingMatchDetails: {
    matchSource: String, // e.g., 'Gov_DB', 'Internal_AI'
    matchConfidence: Number, // 0.0 to 1.0
    originalName: String,
    parentContact: String,
  },
  faceBiometricTemplate: {
    type: String, // Store extracted feature vector (simulated as hash)
  },
  interventions: [
    {
      organization: { type: String, required: true },
      type: { 
        type: String, 
        enum: ['Medical', 'Legal', 'Education', 'Shelter', 'Counseling', 'Reunification'],
        required: true 
      },
      details: String,
      performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date, default: Date.now },
      blockchainRef: String // Hash of this intervention record on the chain
    }
  ],
  auditLogs: [
    {
      action: { type: String, enum: ['REGISTERED', 'VIEWED', 'UPDATED', 'INTERVENTION_ADDED'], required: true },
      performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      organization: String,
      timestamp: { type: Date, default: Date.now },
      details: String
    }
  ],
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChildRecord', childRecordSchema);
