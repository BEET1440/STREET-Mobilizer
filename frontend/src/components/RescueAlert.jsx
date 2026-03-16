import React from 'react';
import { AlertTriangle, MapPin, Bell, ShieldAlert, Send, Users, Info } from 'lucide-react';

const RescueAlert = ({ alert, onClose }) => {
  if (!alert) return null;

  const { 
    alertId, 
    smId, 
    childName, 
    zoneName, 
    zoneType, 
    location, 
    notifiedOrgs, 
    instructions 
  } = alert;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border-4 border-red-600 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-red-600 p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full animate-pulse">
                <Bell size={24} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter">CRITICAL RESCUE ALERT</h2>
                <p className="text-[10px] font-bold opacity-80 font-mono">{alertId}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="hover:bg-red-700 p-1 rounded-full transition"
            >
              <span className="text-2xl leading-none">&times;</span>
            </button>
          </div>
          
          <div className="bg-red-700/50 p-4 rounded-lg border border-red-400">
            <p className="text-xs uppercase font-bold opacity-80 mb-1">Child Detected in High-Risk Zone</p>
            <h3 className="text-2xl font-bold">{childName} <span className="text-sm font-mono opacity-70">({smId})</span></h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase">Detection Zone</p>
              <div className="flex items-center gap-2 text-red-700">
                <ShieldAlert size={16} />
                <span className="font-bold text-sm">{zoneName}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase">Zone Type</p>
              <div className="flex items-center gap-2 text-orange-600">
                <AlertTriangle size={16} />
                <span className="font-bold text-sm uppercase">{zoneType.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase">Specific Encounter Location</p>
            <div className="flex items-center gap-2 text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <MapPin size={18} className="text-red-500" />
              <span className="font-bold">{location}</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase">Response Instructions</p>
            <div className="bg-red-50 border-l-4 border-red-600 p-4 text-red-800">
              <p className="text-sm font-bold leading-tight">{instructions}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2">
              <Users size={12} /> Organizations Notified
            </p>
            <div className="flex flex-wrap gap-2">
              {notifiedOrgs.map((org, idx) => (
                <span key={idx} className="text-[9px] font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-200">
                  {org}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition shadow-lg shadow-red-200"
          >
            <Send size={18} /> Acknowledge & Dispatch
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition"
          >
            Dismiss
          </button>
        </div>

        <div className="bg-gray-50 p-4 flex items-center gap-3 text-[10px] text-gray-500 italic border-t border-gray-100">
          <Info size={14} className="shrink-0" />
          Every second counts. This alert has been logged to the blockchain audit trail for accountability and rapid response verification.
        </div>
      </div>
    </div>
  );
};

export default RescueAlert;
