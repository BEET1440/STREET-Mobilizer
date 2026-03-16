import React from 'react';
import { ShieldCheck, User, Fingerprint, Calendar, MapPin, Globe } from 'lucide-react';

const DigitalIDCard = ({ child }) => {
  if (!child) return null;

  const { smId, name, age, gender, location, blockchainHash, createdAt } = child;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white rounded-xl shadow-2xl p-6 border-2 border-blue-400 max-w-sm w-full">
      {/* Decorative Watermark */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-10">
        <Globe size={200} className="text-white" />
      </div>

      <div className="flex justify-between items-start relative z-10 mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-md">
            <ShieldCheck size={24} className="text-blue-800" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest leading-none">STREET Mobilizer</h2>
            <p className="text-[8px] font-bold opacity-70 uppercase tracking-tighter leading-none">Global Digital Identity</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest leading-none">TEMPORARY ID</p>
          <p className="text-sm font-mono font-bold text-blue-300">{smId}</p>
        </div>
      </div>

      <div className="flex gap-4 relative z-10 mb-6">
        {/* Profile Image Mock */}
        <div className="w-24 h-24 bg-blue-600 rounded-lg border border-blue-400 flex items-center justify-center overflow-hidden shrink-0">
          <User size={48} className="text-blue-200" />
        </div>

        <div className="space-y-2 flex-1">
          <div>
            <p className="text-[8px] font-bold opacity-50 uppercase leading-none mb-1">Full Legal Name</p>
            <p className="text-lg font-bold leading-tight uppercase tracking-wide truncate">{name}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[8px] font-bold opacity-50 uppercase leading-none mb-1">Age</p>
              <p className="text-sm font-bold">{age || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[8px] font-bold opacity-50 uppercase leading-none mb-1">Gender</p>
              <p className="text-sm font-bold">{gender || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10 mb-4 text-[10px]">
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-blue-300" />
          <span className="font-medium opacity-80">{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-blue-300" />
          <span className="font-medium opacity-80">Issued: {new Date(createdAt || Date.now()).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="border-t border-blue-500 pt-4 relative z-10 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 opacity-60">
            <Fingerprint size={10} />
            <span className="text-[8px] font-mono uppercase">Biometric Verified</span>
          </div>
          <div className="flex items-center gap-1 opacity-60">
            <ShieldCheck size={10} />
            <span className="text-[8px] font-mono uppercase truncate max-w-[150px]">Chain: {blockchainHash?.substring(0, 16)}...</span>
          </div>
        </div>
        
        {/* QR Code Placeholder */}
        <div className="bg-white p-1 rounded-sm shrink-0 shadow-inner">
          <div className="w-10 h-10 border border-gray-100 flex flex-wrap">
            {/* Simple QR Mock with divs */}
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={`w-[33.33%] h-[33.33%] ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer disclaimer */}
      <div className="mt-2 text-[6px] opacity-40 font-bold uppercase tracking-widest text-center relative z-10">
        Authorized use for humanitarian coordination, education & healthcare access only
      </div>
    </div>
  );
};

export default DigitalIDCard;
