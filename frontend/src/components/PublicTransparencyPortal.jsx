import React, { useState, useEffect } from 'react';
import { Users, Home, GraduationCap, Heart, Database, Share2, ShieldCheck, TrendingUp, BarChart3, Globe } from 'lucide-react';

const PublicTransparencyPortal = () => {
  const [stats, setStats] = useState({
    totalRegistered: 12450,
    reunited: 3100,
    inShelters: 2230,
    backToSchool: 1870,
    totalInterventions: 45800,
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);

  // In a real app, this would fetch from the /api/records/public/stats endpoint
  useEffect(() => {
    // Simulate live update
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalInterventions: prev.totalInterventions + Math.floor(Math.random() * 5),
        lastUpdated: new Date().toISOString()
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'Children Registered', value: stats.totalRegistered.toLocaleString(), icon: <Users className="text-blue-600" />, color: 'blue', detail: 'Total digital identities issued on blockchain' },
    { label: 'Family Reunifications', value: stats.reunited.toLocaleString(), icon: <Heart className="text-red-600" />, color: 'red', detail: 'Successful trace and reintegration cases' },
    { label: 'Shelter Placement', value: stats.inShelters.toLocaleString(), icon: <Home className="text-orange-600" />, color: 'orange', detail: 'Children currently in verified safe housing' },
    { label: 'Back to School', value: stats.backToSchool.toLocaleString(), icon: <GraduationCap className="text-green-600" />, color: 'green', detail: 'Children enrolled in bridge or formal education' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <Globe className="w-full h-full transform scale-150" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-blue-400">
            <ShieldCheck size={18} /> STREET-Mobilizer Public Transparency Portal
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Real-Time Humanitarian Impact</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Blockchain-backed transparency for street children mobilization. 
            Providing verifiable data for donors, NGOs, and policy makers.
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="max-w-6xl mx-auto -mt-10 px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transform transition hover:-translate-y-1">
              <div className={`bg-${card.color}-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                {card.icon}
              </div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{card.label}</p>
              <h2 className="text-3xl font-black mt-1">{card.value}</h2>
              <p className="text-[10px] text-gray-400 mt-3 italic">{card.detail}</p>
            </div>
          ))}
        </div>

        {/* Secondary Stats & Blockchain Proof */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="text-blue-600" /> Impact Trends (Last 30 Days)
              </h3>
              <div className="text-xs text-gray-400 font-mono">
                Last Updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
            
            {/* Mock Chart Area */}
            <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-gray-100">
              {[65, 45, 78, 52, 88, 62, 95, 70, 85, 90, 110, 125].map((h, i) => (
                <div key={i} className="w-full group relative">
                  <div 
                    className="bg-blue-500 bg-opacity-80 hover:bg-opacity-100 rounded-t-sm transition-all duration-500 cursor-pointer" 
                    style={{ height: `${h}px` }}
                  ></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">
                    {Math.floor(h * 1.5)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-bold uppercase">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Share2 size={20} className="text-blue-300" /> Blockchain Ledger
            </h3>
            <div className="space-y-6">
              <div className="bg-blue-800 bg-opacity-50 p-4 rounded-xl border border-blue-700">
                <p className="text-xs text-blue-300 font-bold uppercase mb-1">Total Network Interventions</p>
                <p className="text-3xl font-black">{stats.totalInterventions.toLocaleString()}</p>
                <p className="text-[10px] text-blue-400 mt-2">Every action (aid, school, health) is cryptographically signed and stored.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs">01</div>
                  <div>
                    <p className="text-sm font-bold">Immutability</p>
                    <p className="text-[10px] text-blue-300">Data cannot be altered by any single entity.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs">02</div>
                  <div>
                    <p className="text-sm font-bold">Verifiability</p>
                    <p className="text-[10px] text-blue-300">Auditors can prove impact with public keys.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs">03</div>
                  <div>
                    <p className="text-sm font-bold">Privacy First</p>
                    <p className="text-[10px] text-blue-300">No sensitive biometric data is shared publicly.</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-blue-500 hover:bg-blue-400 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 mt-4 shadow-lg">
                <BarChart3 size={18} /> Download Impact Report (PDF)
              </button>
            </div>
          </div>
        </div>

        {/* Policy Section */}
        <div className="mt-12 bg-white p-10 rounded-2xl shadow-lg border border-gray-100 text-center">
          <h3 className="text-2xl font-bold mb-4">Empowering Policy through Data</h3>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The STREET-Mobilizer platform provides governments with the necessary evidence to formulate child welfare policies. 
            By mapping hotspots and tracking success rates of various interventions, we help allocate resources where they are needed most.
          </p>
          <div className="flex justify-center gap-8 mt-10">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <Database className="text-blue-600" />
              </div>
              <span className="text-xs font-bold text-gray-500">Government API</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <ShieldCheck className="text-blue-600" />
              </div>
              <span className="text-xs font-bold text-gray-500">NGO Network</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <Globe className="text-blue-600" />
              </div>
              <span className="text-xs font-bold text-gray-500">Global Transparency</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTransparencyPortal;
