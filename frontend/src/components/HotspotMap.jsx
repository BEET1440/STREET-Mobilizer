import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// Fix for default marker icons in React Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Heatmap Layer Component
const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

const HotspotMap = ({ records }) => {
  // Mock hotspots for Nairobi if no records have geo data
  const defaultCenter = [-1.2921, 36.8219]; // Nairobi
  
  const geoRecords = records.filter(r => r.geolocation && r.geolocation.lat);
  
  const heatPoints = geoRecords.map(r => [
    r.geolocation.lat, 
    r.geolocation.lng, 
    0.5 // Intensity
  ]);

  // If no records, add some mock heat points for visualization
  if (heatPoints.length === 0) {
    heatPoints.push([-1.2833, 36.8167, 0.8]);
    heatPoints.push([-1.2900, 36.8200, 0.6]);
    heatPoints.push([-1.3000, 36.8300, 0.9]);
    heatPoints.push([-1.2700, 36.8000, 0.4]);
  }

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-inner border border-gray-200">
      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <HeatmapLayer points={heatPoints} />
        
        {geoRecords.map((record, idx) => (
          <Marker key={idx} position={[record.geolocation.lat, record.geolocation.lng]}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-blue-900">{record.name}</h3>
                <p className="text-xs text-gray-600">{record.location}</p>
                <div className="mt-2 text-[10px] bg-blue-50 p-1 rounded">
                  <span className="font-mono">{record.blockchainHash?.substring(0, 12)}...</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default HotspotMap;
