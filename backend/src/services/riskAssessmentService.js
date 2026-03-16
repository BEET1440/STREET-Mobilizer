/**
 * Risk Assessment AI Service
 * Predicts vulnerability levels based on child data and environmental factors.
 */

class RiskAssessmentService {
  /**
   * Calculates a risk score and level for a child record
   * @param {Object} data - Child record data
   * @returns {Object} Risk assessment results
   */
  async assessRisk(data) {
    let score = 0;
    const reasons = [];

    // 1. Age Factor (Younger children are at higher risk)
    if (data.age < 10) {
      score += 35;
      reasons.push("Under 10 years old (High vulnerability)");
    } else if (data.age < 14) {
      score += 15;
      reasons.push("Early adolescent (Moderate vulnerability)");
    }

    // 2. Health Condition
    if (data.healthCondition === 'critical') {
      score += 40;
      reasons.push("Critical health condition requiring immediate intervention");
    } else if (data.healthCondition === 'malnourished') {
      score += 25;
      reasons.push("Signs of severe malnutrition");
    } else if (data.healthCondition === 'chronic_illness') {
      score += 20;
      reasons.push("Chronic illness requiring management");
    }

    // 3. Time on Streets
    if (data.timeOnStreets > 24) { // More than 2 years
      score += 20;
      reasons.push("Long-term street exposure (> 24 months)");
    } else if (data.timeOnStreets > 6) {
      score += 10;
      reasons.push("Developing street dependency (> 6 months)");
    }

    // 4. Group Associations
    if (data.groupAssociations === 'gang') {
      score += 30;
      reasons.push("Association with known street gangs");
    } else if (data.groupAssociations === 'organized_group') {
      score += 15;
      reasons.push("Part of organized street group");
    }

    // 5. Location Factor (Mock Trafficking Hotspots)
    const traffickingHotspots = [
      { lat: -1.2833, lng: 36.8167, radius: 0.01 }, // Central Sector
      { lat: -1.2750, lng: 36.8500, radius: 0.015 } // Eastleigh Border
    ];

    if (data.geolocation) {
      const isNearHotspot = traffickingHotspots.some(hotspot => {
        const dist = Math.sqrt(
          Math.pow(data.geolocation.lat - hotspot.lat, 2) + 
          Math.pow(data.geolocation.lng - hotspot.lng, 2)
        );
        return dist < hotspot.radius;
      });

      if (isNearHotspot) {
        score += 25;
        reasons.push("Identified near a known human trafficking hotspot");
      }
    }

    // Normalize score to 100
    score = Math.min(score, 100);

    // Determine Level
    let level = 'LOW';
    if (score >= 80) level = 'CRITICAL';
    else if (score >= 60) level = 'HIGH';
    else if (score >= 35) level = 'MEDIUM';

    return {
      score,
      level,
      reasons,
      lastAssessed: new Date()
    };
  }
}

module.exports = new RiskAssessmentService();
