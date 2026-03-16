import React, { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, Database, Share2, Clock, Fingerprint, Hash } from 'lucide-react';

const DataIntegrityVerifier = () => {
  const [smId, setSmId] = useState('SM-KE-2026-004321');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      if (smId === 'SM-KE-2026-004321') {
        setResult({
          integrity: true,
          message: 'Record verified successfully. Data is intact and matches the blockchain ledger.',
          dbRecord: {
            name: 'John Doe',
            age: 8,
            gender: 'Male',
            location: 'Central Park'
          },
          blockchainRecord: {
            transactionId: '0x7a2b4c6d8e0f1a3b5c7d9e2f4a6b8c0d1e3f5a7b9c2d4e6f8a0b1c3d5e7f9a2b',
            timestamp: '2026-03-10T10:00:00Z',
            blockNumber: 1024,
            data: {
              smId: 'SM-KE-2026-004321',
              name: 'John Doe',
              age: 8,
              gender: 'Male',
              location: 'Central Park',
              biometricHash: 'bio_1646906400000'
            }
          }
        });
      } else if (smId === 'SM-KE-2026-009876') {
        setResult({
          integrity: false,
          message: 'Data integrity compromised! Blockchain record does not match database record.',
          dbRecord: {
            name: 'Samuel Omondi',
            age: 15, // Age was tampered with in DB
            gender: 'Male',
            location: 'Kibera'
          },
          blockchainRecord: {
            transactionId: '0x3c1d5e7f9a2b4c6d8e0f1a3b5c7d9e2f4a6b8c0d1e3f5a7b9c2d4e6f8a0b1c3d',
            timestamp: '2026-03-14T12:30:00Z',
            blockNumber: 1055,
            data: {
              smId: 'SM-KE-2026-009876',
              name: 'Samuel Omondi',
              age: 14, // Original age on blockchain
              gender: 'Male',
              location: 'Kibera',
              biometricHash: 'bio_1647261000000'
            }
          }
        });
      } else {
        setError('No record found with this SM-ID.');
      }
      setIsLoading(false);
    }, 2000);
  };

  const renderComparison = (db, bc) => {
    const keys = Object.keys(db);
    return keys.map(key => {
      const dbValue = db[key];
      const bcValue = bc[key];
      const isMatch = dbValue === bcValue;
      return (
        <div key={key} className={`p-2 rounded-md text-xs grid grid-cols-3 gap-2 items-center ${isMatch ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="font-bold text-gray-500 capitalize col-span-1">{key}</div>
          <div className={`font-mono col-span-1 ${isMatch ? 'text-gray-700' : 'text-red-700 font-bold'}`}>{dbValue}</div>
          <div className={`font-mono col-span-1 ${isMatch ? 'text-gray-700' : 'text-green-700 font-bold'}`}>{bcValue}</div>
        </div>
      );
    });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl mx-auto border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
        <Share2 size={24} className="text-blue-600" />
        Data Integrity Verification Tool
      </h2>
      <p className="text-sm text-gray-500 mb-6">Verify the integrity of a child's record by comparing the database version against the immutable blockchain ledger.</p>

      <form onSubmit={handleVerify} className="flex items-center gap-2 mb-8">
        <input
          type="text"
          value={smId}
          onChange={(e) => setSmId(e.target.value)}
          placeholder="Enter SM-ID to verify (e.g., SM-KE-2026-004321)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Search size={18} />
          )}
          Verify
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 animate-in fade-in">
          <AlertTriangle size={24} />
          <div>
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="animate-in fade-in space-y-6">
          <div className={`p-6 rounded-xl flex items-center gap-4 ${result.integrity ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {result.integrity ? <CheckCircle2 size={40} /> : <AlertTriangle size={40} />}
            <div>
              <h3 className="text-lg font-bold">{result.integrity ? 'Integrity Verified' : 'Integrity Compromised'}</h3>
              <p className="text-sm">{result.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Database Record */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Database size={16} /> Database Record</h4>
              <div className="space-y-1">
                <div className="p-2 rounded-md text-xs grid grid-cols-3 gap-2 items-center bg-gray-100 font-bold">
                  <div className="col-span-1">Field</div>
                  <div className="col-span-1">DB Value</div>
                  <div className="col-span-1">BC Value</div>
                </div>
                {renderComparison(result.dbRecord, result.blockchainRecord.data)}
              </div>
            </div>

            {/* Blockchain Proof */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2"><Share2 size={16} /> Blockchain Proof</h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 p-1.5 rounded-md text-blue-700"><Hash size={14} /></div>
                  <div>
                    <p className="font-bold text-blue-900">Transaction ID</p>
                    <p className="font-mono text-blue-700 break-all">{result.blockchainRecord.transactionId}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 p-1.5 rounded-md text-blue-700"><Clock size={14} /></div>
                  <div>
                    <p className="font-bold text-blue-900">Timestamp</p>
                    <p className="font-mono text-blue-700">{new Date(result.blockchainRecord.timestamp).toUTCString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 p-1.5 rounded-md text-blue-700"><Fingerprint size={14} /></div>
                  <div>
                    <p className="font-bold text-blue-900">Biometric Hash</p>
                    <p className="font-mono text-blue-700">{result.blockchainRecord.data.biometricHash}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataIntegrityVerifier;
