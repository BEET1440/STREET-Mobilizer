import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Fingerprint, History, CheckCircle2, AlertCircle, Search } from 'lucide-react';

const RELATIONSHIPS = [
  { id: 'parent', label: 'Parent', icon: '👨‍👩‍👧' },
  { id: 'relative', label: 'Relative', icon: '👴' },
  { id: 'legal_guardian', label: 'Legal Guardian', icon: '⚖️' },
  { id: 'social_worker', label: 'Assigned Social Worker', icon: '💼' },
];

const GuardianVerificationForm = ({ childId, childName, onVerificationComplete }) => {
  const [guardianName, setGuardianName] = useState('');
  const [guardianId, setGuardianId] = useState('');
  const [relationship, setRelationship] = useState('parent');
  const [isScanning, setIsScanning] = useState(false);
  const [biometricMatch, setBiometricMatch] = useState(null); // null, 'MATCHED', 'NOT_MATCHED'
  const [historicalCheck, setHistoricalCheck] = useState(null); // null, 'VERIFIED', 'UNVERIFIED'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notes, setNotes] = useState('');

  const handleBiometricScan = () => {
    setIsScanning(true);
    // Simulate biometric scan
    setTimeout(() => {
      setIsScanning(false);
      // Logic: if name starts with same letter as child, higher chance of match (for demo)
      const isMatch = Math.random() > 0.3; 
      setBiometricMatch(isMatch ? 'MATCHED' : 'NOT_MATCHED');
    }, 2000);
  };

  const handleHistoricalCheck = () => {
    // Simulate historical records check
    setHistoricalCheck('checking');
    setTimeout(() => {
      const isVerified = Math.random() > 0.4;
      setHistoricalCheck(isVerified ? 'VERIFIED' : 'UNVERIFIED');
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!biometricMatch || !historicalCheck) {
      alert("Please complete Biometric Scan and Historical Check first.");
      return;
    }
    
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const result = {
        guardianName,
        guardianNationalId: guardianId,
        relationship,
        biometricStatus: biometricMatch,
        historicalCheckStatus: historicalCheck,
        timestamp: new Date().toISOString(),
        blockchainHash: `0x${Math.random().toString(16).slice(2, 10)}...guardian`
      };

      onVerificationComplete(result);
      setIsSubmitting(false);
      setSuccess(true);
      
      // Reset form after delay
      setTimeout(() => {
        setSuccess(false);
        setGuardianName('');
        setGuardianId('');
        setBiometricMatch(null);
        setHistoricalCheck(null);
        setNotes('');
      }, 4000);
    }, 1500);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-lg">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-blue-900">
        <ShieldCheck size={24} className="text-blue-600" /> Guardian Verification
      </h3>

      {success ? (
        <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in duration-300">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <div>
            <p className="text-lg font-bold">Verification Successful!</p>
            <p className="text-sm opacity-90">Guardian <b>{guardianName}</b> has been verified for <b>{childName}</b>.</p>
            <p className="text-xs mt-2 font-mono text-green-600">Proof-of-Verification logged to blockchain.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Guardian Full Name</label>
                <input
                  type="text"
                  required
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="Enter full legal name"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">National ID / Passport</label>
                <input
                  type="text"
                  required
                  value={guardianId}
                  onChange={(e) => setGuardianId(e.target.value)}
                  placeholder="ID Number"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Relationship to Child</label>
                <div className="grid grid-cols-2 gap-2">
                  {RELATIONSHIPS.map((rel) => (
                    <button
                      key={rel.id}
                      type="button"
                      onClick={() => setRelationship(rel.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg border-2 transition text-xs font-semibold ${
                        relationship === rel.id 
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                          : 'border-gray-100 hover:border-blue-200 text-gray-600 bg-white'
                      }`}
                    >
                      <span>{rel.icon}</span>
                      {rel.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${biometricMatch === 'MATCHED' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      <Fingerprint size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Biometric Match</p>
                      <p className="text-[10px] text-gray-500">Scan child & guardian fingerprint</p>
                    </div>
                  </div>
                  {biometricMatch ? (
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      biometricMatch === 'MATCHED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {biometricMatch}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleBiometricScan}
                      disabled={isScanning}
                      className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition font-bold disabled:opacity-50"
                    >
                      {isScanning ? 'Scanning...' : 'Start Scan'}
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${historicalCheck === 'VERIFIED' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                      <History size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Historical Check</p>
                      <p className="text-[10px] text-gray-500">Verify past claims & NGO records</p>
                    </div>
                  </div>
                  {historicalCheck && historicalCheck !== 'checking' ? (
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      historicalCheck === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {historicalCheck}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleHistoricalCheck}
                      disabled={historicalCheck === 'checking'}
                      className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 transition font-bold disabled:opacity-50"
                    >
                      {historicalCheck === 'checking' ? 'Checking...' : 'Check Records'}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Verification Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional context or red flags..."
                  className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-xs h-16 resize-none bg-white"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !biometricMatch || !historicalCheck}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-white font-bold text-lg transition shadow-md ${
              isSubmitting || !biometricMatch || !historicalCheck
                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-1'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying and Logging to Blockchain...
              </>
            ) : (
              <>
                <UserCheck size={22} />
                Finalize Guardian Verification
              </>
            )}
          </button>
          
          <p className="text-[10px] text-center text-gray-400 italic">
            All guardian verifications are permanent and stored on the immutable ledger to prevent future trafficking claims.
          </p>
        </form>
      )}
    </div>
  );
};

export default GuardianVerificationForm;
