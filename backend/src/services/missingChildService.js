/**
 * Missing Child Matching Service
 * Handles face biometric extraction and comparison against 
 * internal and government databases.
 */

const crypto = require('crypto');

// Mock Government Missing Persons Database
const mockGovMissingDB = [
  {
    name: "Samuel Omondi",
    biometricTemplate: "face_sim_99823", // Pre-calculated face feature hash
    parentContact: "+254 700 123456",
    missingSince: "2024-01-10",
  },
  {
    name: "Aisha Kamau",
    biometricTemplate: "face_sim_44512",
    parentContact: "+254 711 987654",
    missingSince: "2023-11-15",
  }
];

class MissingChildService {
  /**
   * Simulates extracting face biometrics from an image
   * @param {string} imagePath 
   * @returns {string} Face biometric template (hash)
   */
  async extractFaceBiometrics(imagePath) {
    // In a real system, this would use a face recognition model like TensorFlow.js or OpenCV
    // For now, we simulate this by hashing the "image path" string
    return "face_sim_" + crypto.createHash('md5').update(imagePath).digest('hex').substring(0, 5);
  }

  /**
   * Compares the face template against known missing persons
   * @param {string} faceTemplate 
   * @param {Array} internalRecords - List of all previous records in our system
   */
  async checkForMatch(faceTemplate, internalRecords = []) {
    console.log(`[AI] Comparing face template: ${faceTemplate}`);

    // 1. Check against Government Database (Mock API call)
    const govMatch = mockGovMissingDB.find(record => record.biometricTemplate === faceTemplate);
    if (govMatch) {
      return {
        isMatch: true,
        source: 'Gov_DB',
        confidence: 0.98,
        originalName: govMatch.name,
        parentContact: govMatch.parentContact
      };
    }

    // 2. Check against Internal System Records
    const internalMatch = internalRecords.find(record => record.faceBiometricTemplate === faceTemplate);
    if (internalMatch) {
      return {
        isMatch: true,
        source: 'Internal_AI',
        confidence: 0.95,
        originalName: internalMatch.name,
        parentContact: "See previous system record ID: " + internalMatch._id
      };
    }

    return { isMatch: false };
  }
}

module.exports = new MissingChildService();
