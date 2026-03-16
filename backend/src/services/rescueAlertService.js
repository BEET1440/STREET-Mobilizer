/**
 * Rescue Alert Service (Mock)
 * Handles detection of high-risk zones and triggering alerts to the NGO coordination network.
 */

const HIGH_RISK_ZONES = [
  { name: 'Border Crossing A', type: 'trafficking_hotspot', radius: 5000 },
  { name: 'Industrial Area D', type: 'crime_zone', radius: 3000 },
  { name: 'Transit Hub C', type: 'trafficking_hotspot', radius: 2000 },
];

class RescueAlertService {
  /**
   * Check if a location/geolocation is within a high-risk zone
   * @param {Object} geolocation {lat, lng}
   * @param {String} locationDescription 
   */
  async checkRiskZone(geolocation, locationDescription) {
    // In a real app, this would use a spatial database (PostGIS/MongoDB 2dsphere)
    // For the mock, we check if the location description matches any known hotspot names
    const matchedZone = HIGH_RISK_ZONES.find(zone => 
      locationDescription?.toLowerCase().includes(zone.name.toLowerCase()) ||
      (geolocation && this._calculateDistance(geolocation, zone.mockCoord) < zone.radius)
    );

    return matchedZone || null;
  }

  /**
   * Trigger rescue alerts to relevant organizations
   * @param {Object} childRecord 
   * @param {Object} zone 
   * @param {Object} encounterDetails 
   */
  async triggerRescueAlert(childRecord, zone, encounterDetails) {
    const alert = {
      alertId: `ALRT-${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
      childId: childRecord._id,
      smId: childRecord.smId,
      childName: childRecord.name,
      riskLevel: 'CRITICAL',
      zoneName: zone.name,
      zoneType: zone.type,
      location: encounterDetails.location,
      timestamp: new Date(),
      notifiedOrgs: ['Red Cross', 'Save the Children', 'Local Police Protection Unit', 'Safe Haven Shelter'],
      instructions: 'IMMEDIATE DISPATCH: Deploy social worker to location for child extraction and protective custody.'
    };

    console.log(`[RESCUE ALERT] ${alert.alertId}: Child ${alert.childName} (${alert.smId}) found in ${alert.zoneName}!`);
    
    // In production, this would send Push Notifications, SMS, and Socket.io events
    return alert;
  }

  _calculateDistance(coord1, coord2) {
    // Mock distance calculation
    return Math.random() * 10000; 
  }
}

module.exports = new RescueAlertService();
