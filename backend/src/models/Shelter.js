const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  geolocation: {
    lat: Number,
    lng: Number,
  },
  capacity: {
    type: Number,
    required: true,
  },
  occupied: {
    type: Number,
    default: 0,
  },
  contactPerson: String,
  phoneNumber: String,
  organization: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual for available beds
shelterSchema.virtual('available').get(function() {
  return this.capacity - this.occupied;
});

// Ensure virtuals are included in JSON
shelterSchema.set('toJSON', { virtuals: true });
shelterSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Shelter', shelterSchema);
