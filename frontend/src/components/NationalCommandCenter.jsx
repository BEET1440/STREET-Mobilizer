import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Map as MapIcon, 
  Users, 
  Zap, 
  Database, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  Fingerprint,
  Link as LinkIcon,
  Globe,
  Crosshair,
  Building2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import HotspotMap from './HotspotMap';
import RiskAssessmentBadge from './RiskAssessmentBadge';
import StreetChildNetworkGraph from './StreetChildNetworkGraph';

const NationalCommandCenter = () => {
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 1, type: 'CRITICAL', zone: 'Eastleigh Market', reason: 'Unusual gathering of minors', time: '2 mins ago', org: 'Red Cross' },
    { id: 2, type: 'WARNING', zone: 'Nairobi Terminus', reason: 'High-risk identification', time: '15 mins ago', org: 'Gov Family Dept' },
  ]);

  const [blockchainFeed, setBlockchainFeed] = useState([
    { id: '0x7a2...f4e', action: 'Digital ID Issued', status: 'CONFIRMED', time: '1 min ago' },
    { id: '0x3c1...b2d', action: 'Biometric Match', status: 'VERIFIED', time: '5 mins ago' },
    { id: '0x9d4...e1f', action: 'Aid Distributed', status: 'LOGGED', time: '12 mins ago' },
  ]);

  const [nationalStats, setNationalStats] = useState({
    totalIdentities: 12450,
    verifiedGuardians: 3102,
    activeHotspots: 8,
    orgsCoordinating: 24
  });

  // Mock data for the map
  const mockRecords = [
    { id: 1, name: 'John Doe', geolocation: { lat: -1.2833, lng: 36.8167 }, blockchainHash: '0x7a2...f4e', location: 'Central Park' },
    { id: 2, name: 'Samuel Omondi', geolocation: { lat: -1.3000, lng: 36.7800 }, blockchainHash: '0x3c1...b2d', location: 'Kibera' },
    { id: 3, name: 'Aisha Kamau', geolocation: { lat: -1.2750, lng: 36.8500 }, blockchainHash: '0x9d4...e1f', location: 'Eastleigh' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-black uppercase text-xs tracking-widest mb-1">
            <Globe size={14} /> National Intervention Platform
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Command Center</h1>
          <p className="text-slate-500 font-medium">Synthesizing biometrics, blockchain, and AI for real-time coordination.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          <div className="flex flex-col items-end px-3 border-r border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">System Status</span>
            <span className="text-xs font-black text-green-600 flex items-center gap-1">
              <Zap size={10} fill="currentColor" /> ALL SYSTEMS ACTIVE
            </span>
          </div>
          <div className="px-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Last Global Sync</span>
            <span className="text-xs font-black text-slate-700 flex items-center gap-1">
              <Clock size={12} /> JUST NOW
            </span>
          </div>
        </div>
      </div>

      {/* National Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 group hover:border-blue-500 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Fingerprint size={24} />
            </div>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+12 Today</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Digital Identities</p>
          <h2 className="text-3xl font-black text-slate-900">{nationalStats.totalIdentities.toLocaleString()}</h2>
          <p className="text-[10px] text-slate-400 mt-2 font-medium italic">Biometric-backed IDs issued nationwide</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 group hover:border-purple-500 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <ShieldCheck size={24} />
            </div>
            <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-full">99.8% Trust</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Verified Guardians</p>
          <h2 className="text-3xl font-black text-slate-900">{nationalStats.verifiedGuardians.toLocaleString()}</h2>
          <p className="text-[10px] text-slate-400 mt-2 font-medium italic">Blockchain-verified family links</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 group hover:border-red-500 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-red-50 p-2.5 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <AlertTriangle size={24} />
            </div>
            <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-full">3 High Priority</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Hotspots</p>
          <h2 className="text-3xl font-black text-slate-900">{nationalStats.activeHotspots}</h2>
          <p className="text-[10px] text-slate-400 mt-2 font-medium italic">AI-predicted intervention zones</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 group hover:border-green-500 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-green-50 p-2.5 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Building2 size={24} />
            </div>
            <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full">Active Sync</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">NGO Coordination</p>
          <h2 className="text-3xl font-black text-slate-900">{nationalStats.orgsCoordinating}</h2>
          <p className="text-[10px] text-slate-400 mt-2 font-medium italic">Entities sharing data on blockchain</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map and Main Coordination View */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 overflow-hidden relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <MapIcon className="text-blue-600" /> Geo-Hotspot Intervention Map
              </h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> High Risk
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Outreach
                </span>
              </div>
            </div>
            <HotspotMap records={mockRecords} />
            <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-white max-w-xs z-[1000]">
              <h4 className="text-xs font-black uppercase text-blue-700 mb-1">AI Prediction</h4>
              <p className="text-[11px] font-bold text-slate-700">Movement patterns suggest 85% probability of new trafficking hotspot forming in Eastleigh Zone B.</p>
              <button className="mt-3 w-full bg-blue-600 text-white text-[10px] font-black py-2 rounded-lg uppercase tracking-wider">Deploy Alert</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="text-blue-600" /> Real-Time NGO Coordination Log
            </h3>
            <div className="space-y-4">
              {[
                { org: 'Red Cross', action: 'Distributed medical kits', location: 'Central Park', time: '5 mins ago', icon: <Building2 size={14} className="text-blue-500" /> },
                { org: 'Gov Family Dept', action: 'Verified 3 guardians', location: 'Nairobi HQ', time: '12 mins ago', icon: <ShieldCheck size={14} className="text-purple-500" /> },
                { org: 'Safe Haven', action: 'Registered 2 new entries', location: 'Industrial Area', time: '20 mins ago', icon: <Fingerprint size={14} className="text-green-500" /> },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                      {log.icon}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{log.org}</p>
                      <p className="text-xs text-slate-500">{log.action} at <span className="font-bold">{log.location}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400">{log.time}</p>
                    <span className="text-[8px] font-mono text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">BC: 0x{Math.random().toString(16).slice(2, 10)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <StreetChildNetworkGraph />
        </div>

        {/* Sidebar Intelligence Panels */}
        <div className="space-y-8">
          {/* AI Risk Intelligence */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <Zap size={20} className="text-yellow-400" /> AI Risk Intelligence
            </h3>
            <div className="space-y-6">
              {activeAlerts.map(alert => (
                <div key={alert.id} className="relative pl-4 border-l-2 border-slate-700">
                  <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${alert.type === 'CRITICAL' ? 'bg-red-500' : 'bg-yellow-500'} animate-pulse`}></div>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${alert.type === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {alert.type}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">{alert.time}</span>
                  </div>
                  <p className="text-sm font-black mb-1">{alert.zone}</p>
                  <p className="text-xs text-slate-400 mb-2">{alert.reason}</p>
                  <div className="flex items-center gap-2 text-[10px] text-blue-400 font-bold">
                    <Building2 size={10} /> Reported by {alert.org}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-xs font-black py-3 rounded-2xl transition border border-slate-700 uppercase tracking-wider">
              View All Intelligence Alerts
            </button>
          </div>

          {/* Blockchain Audit Stream */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <LinkIcon size={20} className="text-blue-600" /> Blockchain Audit Trail
            </h3>
            <div className="space-y-4">
              {blockchainFeed.map(item => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 font-mono">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">{item.action}</span>
                    <span className="text-[9px] text-green-600 font-black flex items-center gap-1">
                      <CheckCircle2 size={10} /> {item.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-blue-500 font-bold truncate max-w-[120px]">{item.id}</span>
                    <span className="text-[9px] text-slate-400 font-bold">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                  <Database size={16} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-blue-900">Immutable Ledger</p>
                  <p className="text-[9px] text-blue-700">100% of registrations are signed and verifiable by any authorized entity.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Stats */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" /> Platform Trust Index
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-1">
                  <span>Biometric Accuracy</span>
                  <span>99.2%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[99.2%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-1">
                  <span>Inter-Org Data Sharing</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full w-[85%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-1">
                  <span>Record Immutability</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-full w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NationalCommandCenter;
