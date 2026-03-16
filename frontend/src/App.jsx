import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Search, LogOut, ShieldCheck, Database, AlertCircle, CheckCircle2, Wifi, WifiOff, RefreshCcw, Save, Map as MapIcon, Crosshair, Users, Activity, HeartPulse, Building2, Landmark, Stethoscope, ChevronRight, History, ShieldAlert } from 'lucide-react';
import { useOffline } from './hooks/useOffline';
import { saveOfflineRecord } from './utils/offlineStorage';
import HotspotMap from './components/HotspotMap';
import ChildTimeline from './components/ChildTimeline';
import RiskAssessmentBadge from './components/RiskAssessmentBadge';
import AidDistributionForm from './components/AidDistributionForm';
import DigitalIDCard from './components/DigitalIDCard';
import PhotoTimeline from './components/PhotoTimeline';
import RescueAlert from './components/RescueAlert';

// Organization/Role config
const ORG_CONFIG = { 
  'NGO': { icon: <Users className="text-blue-500" />, label: 'Social Work' },
  'Government': { icon: <Landmark className="text-purple-500" />, label: 'Policy' },
  'Shelter': { icon: <Building2 className="text-orange-500" />, label: 'Housing' },
  'Hospital': { icon: <Stethoscope className="text-red-500" />, label: 'Medical' },
};

// Mock components (will implement properly later)
const Dashboard = ({ onRescueAlert }) => {
  const { offlineCount, isOnline } = useOffline();
  const [showMap, setShowMap] = useState(false);
  const [activeOrg, setActiveOrg] = useState('Red Cross (NGO)');
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'aid', or 'photos'
  const [activeAlert, setActiveAlert] = useState(null);
  
  // Enhanced mock records with risk assessment, timeline, aid, and photos
  const mockRecords = [
    { 
      id: 1, 
      smId: 'SM-KE-2026-004321',
      name: 'John Doe', 
      location: 'Central Park', 
      geolocation: { lat: -1.2833, lng: 36.8167 }, 
      blockchainHash: '0x7a2...f4e', 
      interventions: 3,
      age: 8,
      riskAssessment: {
        score: 85,
        level: 'CRITICAL',
        reasons: ['No guardian', 'Under 10 years', 'Near trafficking hotspot'],
        trend: 'increasing'
      },
      timeline: [
        { eventType: 'IDENTIFIED', description: 'Found sleeping near Central Park benches. Assigned SM-ID: SM-KE-2026-004321', organization: 'Red Cross (NGO)', timestamp: '2026-03-10', blockchainHash: '0xabc...123' },
        { eventType: 'HEALTH_CHECK', description: 'Minor respiratory infection diagnosed', organization: 'General Hospital', timestamp: '2026-03-11', blockchainHash: '0xdef...456' },
        { eventType: 'SHELTER_PLACEMENT', description: 'Placed in Safe Haven temporary shelter', organization: 'Safe Haven', timestamp: '2026-03-12', blockchainHash: '0xghi...789' },
      ],
      aidDistributions: [
        { itemType: 'food', quantity: '2kg Rice & Beans', description: 'Weekly food basket', organization: 'Red Cross (NGO)', timestamp: '2026-03-12', blockchainHash: '0x123...aid1' },
        { itemType: 'clothing', quantity: '1 Blanket', description: 'Cold weather support', organization: 'Safe Haven', timestamp: '2026-03-13', blockchainHash: '0x456...aid2' }
      ],
      photoTimeline: [
        { photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1974&auto=format&fit=crop', photoHash: 'phash_001', caption: 'Initial encounter photo', location: 'Central Park', organization: 'Red Cross (NGO)', timestamp: '2026-03-10', blockchainHash: '0xabc...p1' },
        { photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop', photoHash: 'phash_002', caption: 'After 2 days in shelter', location: 'Safe Haven', organization: 'Safe Haven', timestamp: '2026-03-12', blockchainHash: '0xdef...p2' }
      ]
    },
    { 
      id: 2, 
      smId: 'SM-KE-2026-009876',
      name: 'Samuel Omondi', 
      location: 'Kibera', 
      geolocation: { lat: -1.3000, lng: 36.7800 }, 
      blockchainHash: '0x3c1...b2d', 
      interventions: 1,
      age: 14,
      riskAssessment: {
        score: 45,
        level: 'MEDIUM',
        reasons: ['Lacks official ID', 'Limited access to clean water'],
        trend: 'stabilizing'
      },
      timeline: [
        { eventType: 'IDENTIFIED', description: 'Identified during Kibera outreach. Assigned SM-ID: SM-KE-2026-009876', organization: 'Red Cross (NGO)', timestamp: '2026-03-14', blockchainHash: '0xjkl...012' },
      ],
      aidDistributions: [],
      photoTimeline: [
        { photoUrl: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?q=80&w=1854&auto=format&fit=crop', photoHash: 'phash_s1', caption: 'Registered at Kibera outpost', location: 'Kibera', organization: 'Red Cross (NGO)', timestamp: '2026-03-14', blockchainHash: '0xjkl...p3' }
      ]
    },
    { 
      id: 3, 
      smId: 'SM-KE-2026-005544',
      name: 'Aisha Kamau', 
      location: 'Eastleigh', 
      geolocation: { lat: -1.2750, lng: 36.8500 }, 
      blockchainHash: '0x9d4...e1f', 
      interventions: 5,
      age: 11,
      riskAssessment: {
        score: 65,
        level: 'HIGH',
        reasons: ['History of exploitation', 'Multiple missing reports'],
        trend: 'increasing'
      },
      timeline: [
        { eventType: 'IDENTIFIED', description: 'Found at Eastleigh market. Assigned SM-ID: SM-KE-2026-005544', organization: 'Red Cross (NGO)', timestamp: '2026-02-15', blockchainHash: '0xmno...345' },
        { eventType: 'SHELTER_PLACEMENT', description: 'Transferred to protection unit', organization: 'Gov Family Dept', timestamp: '2026-02-20', blockchainHash: '0xpqr...678' },
        { eventType: 'SCHOOL_ENROLLMENT', description: 'Enrolled in bridge education program', organization: 'Education First NGO', timestamp: '2026-03-01', blockchainHash: '0xstu...901' },
      ],
      aidDistributions: [
        { itemType: 'school_supplies', quantity: '1 Backpack Kit', description: 'Stationery and uniform for bridge program', organization: 'Education First NGO', timestamp: '2026-03-02', blockchainHash: '0x789...aid3' }
      ],
      photoTimeline: [
        { photoUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2080&auto=format&fit=crop', photoHash: 'phash_a1', caption: 'Identification photo', location: 'Eastleigh market', organization: 'Red Cross (NGO)', timestamp: '2026-02-15', blockchainHash: '0xmno...p4' },
        { photoUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038&auto=format&fit=crop', photoHash: 'phash_a2', caption: 'Enrollment in bridge program', location: 'Education First HQ', organization: 'Education First NGO', timestamp: '2026-03-01', blockchainHash: '0xstu...p5' }
      ]
    },
  ];
  
  return (
    <div className="p-6">
      <RescueAlert alert={activeAlert} onClose={() => setActiveAlert(null)} />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Coordination Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
            Logged in as: <span className="font-bold text-blue-600">{activeOrg}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowMap(!showMap)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition ${showMap ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
          >
            <MapIcon size={20} /> {showMap ? 'Show List' : 'Show Network Hotspots'}
          </button>
          {!isOnline && (
            <div className="flex items-center gap-2 text-orange-600 bg-orange-100 px-4 py-2 rounded-full font-bold">
              <WifiOff size={20} /> Offline Mode Active
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">Network Records</h3>
          <p className="text-3xl font-bold">1,204</p>
          <p className="text-[10px] text-blue-600 mt-2 font-bold">Shared across 12 Orgs</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500">
          <h3 className="text-gray-500 text-sm font-medium">Missing Alerts</h3>
          <p className="text-3xl font-bold text-red-600">12</p>
          <p className="text-[10px] text-red-600 mt-2 font-bold">High Priority Cases</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-medium">Interventions</h3>
          <p className="text-3xl font-bold text-purple-600">458</p>
          <p className="text-[10px] text-purple-600 mt-2 font-bold">This Month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium">Reunifications</h3>
          <p className="text-3xl font-bold text-green-600">89</p>
          <p className="text-[10px] text-green-600 mt-2 font-bold">Success Stories</p>
        </div>
      </div>
      
      {showMap ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Network Hotspot Map</h2>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Critical Need</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Shelter Needed</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Medical Outreach</span>
            </div>
          </div>
          <HotspotMap records={mockRecords} />
        </div>
      ) : (
        <div className="flex gap-6">
          <div className={`transition-all duration-300 ${selectedChild ? 'w-2/3' : 'w-full'} bg-white p-6 rounded-lg shadow-md`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Cross-Organization Activity</h2>
              <div className="flex gap-2">
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-1 rounded border border-blue-200 font-bold">NGO</span>
                <span className="text-[10px] bg-red-100 text-red-800 px-2 py-1 rounded border border-red-200 font-bold">HOSPITAL</span>
                <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-1 rounded border border-orange-200 font-bold">SHELTER</span>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SM-ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Child Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {mockRecords.map(record => (
                  <tr 
                    key={record.id} 
                    className={`cursor-pointer hover:bg-blue-50 transition ${selectedChild?.id === record.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                    onClick={() => setSelectedChild(record)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-bold text-blue-600">{record.smId}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-900">
                      <div className="flex items-center gap-2">
                        {record.name}
                        {record.riskAssessment.level === 'CRITICAL' && <ShieldAlert size={14} className="text-red-600 animate-pulse" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-[10px] leading-5 font-bold rounded-full border ${
                        record.riskAssessment.level === 'CRITICAL' ? 'bg-red-100 text-red-800 border-red-200' : 
                        record.riskAssessment.level === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                        'bg-green-100 text-green-800 border-green-200'
                      }`}>
                        {record.riskAssessment.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-600">Red Cross (NGO)</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-[10px] text-gray-400">{record.blockchainHash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedChild && (
            <div className="w-1/3 space-y-6 animate-in slide-in-from-right duration-300">
              {/* Tab Switcher */}
              <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-100 flex">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('aid')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition ${activeTab === 'aid' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Aid Tracking
                </button>
                <button 
                  onClick={() => setActiveTab('photos')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition ${activeTab === 'photos' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Photos
                </button>
              </div>

              {activeTab === 'overview' ? (
                <>
                  {/* Digital ID Card */}
                  <div className="flex justify-center mb-6">
                    <DigitalIDCard child={selectedChild} />
                  </div>

                  {/* Risk Panel */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <ShieldAlert size={20} className="text-blue-600" /> AI Risk Profile
                      </h3>
                      <button onClick={() => setSelectedChild(null)} className="text-gray-400 hover:text-gray-600">×</button>
                    </div>
                    <RiskAssessmentBadge assessment={selectedChild.riskAssessment} />
                  </div>

                  {/* Timeline Panel */}
                  <div className="bg-white p-6 rounded-lg shadow-md max-h-[400px] overflow-y-auto">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                      <History size={20} className="text-blue-600" /> Life Progress Timeline
                    </h3>
                    <ChildTimeline events={selectedChild.timeline} />
                  </div>
                </>
              ) : activeTab === 'aid' ? (
                <>
                  {/* Aid Distribution Form */}
                  <AidDistributionForm 
                    childId={selectedChild.id} 
                    onAidRecorded={(newAid) => {
                      // Update local state for demo
                      selectedChild.aidDistributions = [newAid, ...selectedChild.aidDistributions];
                      setSelectedChild({...selectedChild});
                    }} 
                  />

                  {/* Aid History */}
                  <div className="bg-white p-6 rounded-lg shadow-md max-h-[400px] overflow-y-auto">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                      <Package size={20} className="text-blue-600" /> Aid History
                    </h3>
                    {selectedChild.aidDistributions.length === 0 ? (
                      <p className="text-gray-400 text-sm italic">No aid distributions recorded yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {selectedChild.aidDistributions.map((aid, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-bold uppercase text-blue-600 px-2 py-0.5 bg-blue-50 rounded border border-blue-100">
                                {aid.itemType.replace('_', ' ')}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono">
                                {new Date(aid.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-gray-800">{aid.quantity}</p>
                            <p className="text-xs text-gray-600 mb-2">{aid.description}</p>
                            <div className="flex justify-between items-center text-[10px] text-gray-400">
                              <span className="font-bold text-gray-500">{aid.organization}</span>
                              <span className="truncate max-w-[100px]" title={aid.blockchainHash}>
                                BC: {aid.blockchainHash.substring(0, 10)}...
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="max-h-[800px] overflow-y-auto pr-2">
                  <PhotoTimeline 
                    photos={selectedChild.photoTimeline || []} 
                    childId={selectedChild.id}
                    onPhotoAdded={(newPhoto) => {
                      // Simulate Rescue Alert for "Border Crossing" in Photo Encounter
                      if (newPhoto.location.toLowerCase().includes('border crossing')) {
                        onRescueAlert({
                          alertId: `ALRT-${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
                          smId: selectedChild.smId,
                          childName: selectedChild.name,
                          riskLevel: 'CRITICAL',
                          zoneName: 'Border Crossing A',
                          zoneType: 'trafficking_hotspot',
                          location: newPhoto.location,
                          notifiedOrgs: ['Red Cross', 'Local Police', 'Save the Children'],
                          instructions: 'IMMEDIATE DISPATCH: Child spotted in high-risk border zone during photo encounter. Dispatch extraction team.'
                        });
                      }
                      selectedChild.photoTimeline = [newPhoto, ...selectedChild.photoTimeline];
                      setSelectedChild({...selectedChild});
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Registration = ({ onRescueAlert }) => {
  const { isOnline } = useOffline();
  const [matchAlert, setMatchAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredRecord, setRegisteredRecord] = useState(null);
  const [offlineSaved, setOfflineSaved] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState('None');

  const captureLocation = () => {
    setIsGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocationData({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setIsGettingLocation(false);
      }, (error) => {
        console.error("Error getting location:", error);
        // Fallback mock location for demo
        setLocationData({ lat: -1.2921, lng: 36.8219, accuracy: 15 });
        setIsGettingLocation(false);
      });
    } else {
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const elements = e.target.elements;
    const name = elements[0].value;
    const age = parseInt(elements[1].value);
    const gender = elements[2].value;
    const location = elements[3].value;

    const recordData = { 
      smId: `SM-KE-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      name, 
      age, 
      gender, 
      location, 
      biometricHash: `bio_${Date.now()}`,
      geolocation: locationData,
      blockchainHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      initialIntervention: selectedIntervention !== 'None' ? selectedIntervention : null
    };

    if (!isOnline) {
      // Handle Offline Save
      setTimeout(() => {
        saveOfflineRecord(recordData);
        setIsSubmitting(false);
        setOfflineSaved(true);
      }, 1500);
      return;
    }
    
    // Simulate Online API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Simulate Rescue Alert for "Border Crossing"
      if (location.toLowerCase().includes('border crossing')) {
        onRescueAlert({
          alertId: `ALRT-${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
          smId: recordData.smId,
          childName: recordData.name,
          riskLevel: 'CRITICAL',
          zoneName: 'Border Crossing A',
          zoneType: 'trafficking_hotspot',
          location: location,
          notifiedOrgs: ['Red Cross', 'Local Police', 'Save the Children'],
          instructions: 'IMMEDIATE DISPATCH: Child identified in high-risk border zone. Dispatch extraction team.'
        });
      }

      // Simulate a match for testing (e.g., if name is Samuel Omondi)
      if (name.toLowerCase().includes('samuel')) {
        setMatchAlert({
          source: 'Government Missing Persons API',
          confidence: '98%',
          originalName: 'Samuel Omondi',
          contact: '+254 700 123456'
        });
      } else {
        setRegisteredRecord(recordData);
      }
    }, 2000);
  };

  if (registeredRecord || offlineSaved) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        {offlineSaved ? (
          <>
            <Save className="mx-auto h-20 w-20 text-orange-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Saved Locally (Offline)</h1>
            <p className="text-gray-600 mb-6 font-medium bg-orange-50 p-4 rounded border border-orange-200">
              You are currently offline. The record has been encrypted and stored on this device. 
              It will be automatically synced to the blockchain when internet is restored.
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="mx-auto h-20 w-20 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Registration Success</h1>
            <p className="text-gray-600 mb-6">Temporary Digital Identity issued and logged to blockchain.</p>
            
            <div className="flex justify-center mb-10">
              <DigitalIDCard child={registeredRecord} />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-8 text-left">
              <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2">
                <ShieldCheck size={16} /> Identity Utilization
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Use SM-ID for school enrollment and healthcare access.</li>
                <li>• Present this digital ID to government agencies for formal registration.</li>
                <li>• All aid distributions will be tracked using this identity.</li>
              </ul>
            </div>
          </>
        )}
        <button onClick={() => { setRegisteredRecord(null); setOfflineSaved(false); setLocationData(null); }} className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold">Register Another</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Register New Network Record</h1>
      
      {!isOnline && (
        <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-md flex items-center gap-3">
          <WifiOff className="text-orange-600" />
          <div>
            <p className="text-orange-800 font-bold text-sm">Offline Mode Active</p>
            <p className="text-orange-700 text-xs">Data will be encrypted and saved locally until you reconnect.</p>
          </div>
        </div>
      )}

      {matchAlert && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-6 rounded-md shadow-sm animate-bounce">
          <div className="flex items-center gap-3 text-red-800 mb-2">
            <AlertCircle className="h-6 w-6" />
            <h2 className="text-lg font-bold">AI MATCH ALERT: POTENTIAL MISSING CHILD</h2>
          </div>
          <p className="text-red-700 text-sm mb-4">
            Our Face Recognition AI has found a high-confidence match in the <strong>{matchAlert.source}</strong>.
          </p>
          <div className="bg-white p-4 rounded border border-red-200 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-gray-500 uppercase text-xs font-bold">Original Name</span>
              <span className="font-bold">{matchAlert.originalName}</span>
            </div>
            <div>
              <span className="block text-gray-500 uppercase text-xs font-bold">Match Confidence</span>
              <span className="font-bold text-green-600">{matchAlert.confidence}</span>
            </div>
            <div className="col-span-2">
              <span className="block text-gray-500 uppercase text-xs font-bold">Parent/Guardian Contact</span>
              <span className="font-bold">{matchAlert.contact}</span>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="flex-1 bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 transition">Alert Authorities</button>
            <button onClick={() => setMatchAlert(null)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-bold hover:bg-gray-300 transition">Dismiss</button>
          </div>
        </div>
      )}

      <form className="bg-white p-8 rounded-lg shadow-md space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 border-b pb-2 flex items-center gap-2">
            <Users size={18} /> Basic Information
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Child's name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input type="number" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 border-b pb-2 flex items-center gap-2">
            <Landmark size={18} /> Location & Coordination
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location Description</label>
            <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Street, City" />
          </div>

          {/* Geo-tagging Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <MapIcon size={16} /> GPS Geo-Tagging
              </label>
              <button 
                type="button"
                onClick={captureLocation}
                disabled={isGettingLocation}
                className={`text-xs font-bold flex items-center gap-1 px-3 py-1 rounded transition ${locationData ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white'}`}
              >
                <Crosshair size={12} className={isGettingLocation ? 'animate-spin' : ''} />
                {isGettingLocation ? 'Capturing...' : locationData ? 'Location Captured' : 'Get Current GPS'}
              </button>
            </div>
            {locationData ? (
              <div className="text-[10px] font-mono text-gray-500 bg-white p-2 rounded border border-gray-100">
                LAT: {locationData.lat.toFixed(6)} | LNG: {locationData.lng.toFixed(6)} | ACCURACY: {locationData.accuracy.toFixed(1)}m
              </div>
            ) : (
              <p className="text-[10px] text-gray-400 italic">No GPS coordinates attached to this record yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 border-b pb-2 flex items-center gap-2">
            <HeartPulse size={18} /> Immediate Intervention
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Action Taken</label>
            <select 
              value={selectedIntervention}
              onChange={(e) => setSelectedIntervention(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="None">No Intervention Yet</option>
              <option value="Medical">Medical Checkup Required</option>
              <option value="Shelter">Referred to Shelter</option>
              <option value="Food">Food & Water Provided</option>
              <option value="Counseling">Trauma Counseling Started</option>
              <option value="Legal">Legal Aid Requested</option>
            </select>
          </div>
        </div>

        <div className="border-2 border-dashed border-blue-200 p-6 rounded-lg text-center bg-blue-50">
          <ShieldCheck className="mx-auto h-12 w-12 text-blue-500 mb-2" />
          <p className="text-sm text-blue-700 font-medium text-center">Biometric Enrollment & Audit Trail Linking</p>
          <p className="text-[10px] text-blue-500 mb-4">Blockchain will log this action for: <span className="font-bold">Red Cross (NGO)</span></p>
          <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Start AI Capture</button>
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full font-bold py-3 rounded-md transition duration-300 flex justify-center items-center gap-2 ${isSubmitting ? 'bg-gray-400' : isOnline ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'}`}
        >
          {isSubmitting ? 'Processing Audit Logs...' : isOnline ? 'Register & Notify Network' : 'Save Encrypted Locally'}
        </button>
      </form>
    </div>
  );
};

const Verification = () => (
  <div className="p-6 max-w-2xl mx-auto">
    <h1 className="text-3xl font-bold mb-6">Record Verification</h1>
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <h2 className="text-xl font-medium mb-2">Scan Biometrics to Retrieve Record</h2>
      <p className="text-gray-500 mb-6">This will search the blockchain for an existing record matching the biometric template.</p>
      <button className="bg-blue-600 text-white px-8 py-3 rounded-md font-bold hover:bg-blue-700">Start Scan</button>
    </div>
  </div>
);

const Login = ({ setAuth }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl">
      <div className="text-center mb-8">
        <Database className="mx-auto h-12 w-12 text-blue-600" />
        <h2 className="text-3xl font-extrabold text-gray-900 mt-2">STREET Mobilizer</h2>
        <p className="text-gray-600">Secure Blockchain Data Portal</p>
      </div>
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setAuth(true); }}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" defaultValue="admin@street.org" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" defaultValue="password123" />
        </div>
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Sign In
        </button>
      </form>
    </div>
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isOnline, offlineCount, isSyncing, syncRecords } = useOffline();

  if (!isAuthenticated) {
    return <Login setAuth={setIsAuthenticated} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-blue-900 text-white shadow-lg flex flex-col">
          <div className="p-6">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Database size={24} /> STREET Mobilizer
            </h1>
          </div>
          <nav className="mt-6 flex-1">
            <Link to="/" className="flex items-center gap-3 px-6 py-4 hover:bg-blue-800 transition">
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link to="/register" className="flex items-center gap-3 px-6 py-4 hover:bg-blue-800 transition">
              <UserPlus size={20} /> Register Child
            </Link>
            <Link to="/verify" className="flex items-center gap-3 px-6 py-4 hover:bg-blue-800 transition">
              <Search size={20} /> Verify Record
            </Link>
          </nav>
          
          {/* Offline Sync Status Section */}
          <div className="p-4 bg-blue-950 m-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Sync Status</span>
              {isOnline ? <Wifi size={14} className="text-green-400" /> : <WifiOff size={14} className="text-orange-400" />}
            </div>
            <div className="text-sm mb-3">
              <p className="flex justify-between">
                <span>Unsynced:</span>
                <span className={`font-bold ${offlineCount > 0 ? 'text-orange-400' : 'text-green-400'}`}>{offlineCount}</span>
              </p>
            </div>
            <button 
              onClick={syncRecords}
              disabled={!isOnline || offlineCount === 0 || isSyncing}
              className={`w-full py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-2 transition ${!isOnline || offlineCount === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
            >
              <RefreshCcw size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>

          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-800 transition border-t border-blue-800"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Authorized Personnel Portal</span>
              {offlineCount > 0 && (
                <div className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  <AlertCircle size={12} /> {offlineCount} Unsynced Records
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                <span className="text-xs text-gray-500 font-bold">{isOnline ? 'Network Online' : 'Network Offline'}</span>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                <span className="text-xs text-gray-500">Blockchain: Active</span>
              </div>
            </div>
          </header>
          
          <Routes>
            <Route path="/" element={<Dashboard onRescueAlert={setActiveAlert} />} />
            <Route path="/register" element={<Registration onRescueAlert={setActiveAlert} />} />
            <Route path="/verify" element={<Verification />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
