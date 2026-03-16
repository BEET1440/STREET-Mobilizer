import React, { useState } from 'react';
import { Camera, MapPin, Calendar, Image as ImageIcon, CheckCircle2, ShieldCheck, User, Info } from 'lucide-react';

const PhotoTimeline = ({ photos, childId, onPhotoAdded }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call and blockchain hashing
    setTimeout(() => {
      const newPhoto = {
        photoUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop', // Mock URL
        photoHash: `phash_${Math.random().toString(16).slice(2, 18)}`,
        caption,
        location,
        organization: 'Red Cross (NGO)',
        timestamp: new Date().toISOString(),
        blockchainHash: `0x${Math.random().toString(16).slice(2, 10)}...photo`
      };

      onPhotoAdded(newPhoto);
      setIsSubmitting(false);
      setIsAdding(false);
      setCaption('');
      setLocation('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Camera size={20} className="text-blue-600" /> Photo Timeline
        </h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`text-xs font-bold px-3 py-1.5 rounded-md transition flex items-center gap-1 ${isAdding ? 'bg-gray-100 text-gray-600' : 'bg-blue-600 text-white shadow-sm'}`}
        >
          {isAdding ? 'Cancel' : <><Camera size={14} /> Add Encounter Photo</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-center border-2 border-dashed border-blue-200 rounded-lg p-6 bg-white hover:bg-gray-50 transition cursor-pointer">
            <div className="text-center">
              <ImageIcon size={32} className="mx-auto text-blue-400 mb-2" />
              <p className="text-xs font-bold text-blue-600">Click to capture or upload photo</p>
              <p className="text-[10px] text-gray-400">Growth and health tracking</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Caption (e.g., Growth check, health update)" 
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 text-sm border border-blue-200 rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text" 
              placeholder="Location" 
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 text-sm border border-blue-200 rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-start gap-2 text-[10px] text-blue-700 bg-white/50 p-2 rounded border border-blue-100">
            <ShieldCheck size={14} className="shrink-0 mt-0.5" />
            <p>Photo will be stored off-chain. A cryptographically unique hash of the image will be logged to the blockchain to detect tampering or identity misuse.</p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 transition disabled:bg-gray-300"
          >
            {isSubmitting ? 'Hashing & Syncing...' : 'Record Photo Encounter'}
          </button>
        </form>
      )}

      {photos.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500 italic">No photos recorded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {photos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((photo, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group">
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img 
                  src={photo.photoUrl} 
                  alt={photo.caption} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="bg-green-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded shadow-lg flex items-center gap-1">
                    <ShieldCheck size={8} /> On-Chain Verified
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <p className="font-bold text-gray-800 text-sm mb-1">{photo.caption}</p>
                <div className="flex items-center gap-4 text-[10px] text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><MapPin size={10} /> {photo.location}</span>
                  <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(photo.timestamp).toLocaleDateString()}</span>
                </div>
                
                <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-blue-600">{photo.organization}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-mono text-gray-400 leading-none">P-HASH: {photo.photoHash.substring(0, 12)}...</span>
                    <span className="text-[8px] font-mono text-gray-400 leading-none mt-1">TX: {photo.blockchainHash.substring(0, 12)}...</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex items-start gap-3">
        <Info size={18} className="text-orange-500 shrink-0 mt-0.5" />
        <div className="text-xs text-orange-800 leading-relaxed">
          <strong>Humanitarian Impact:</strong> Photo timelines are critical for detecting subtle signs of trafficking, monitoring nutritional recovery, and ensuring that children don't "disappear" from the system across different regions.
        </div>
      </div>
    </div>
  );
};

export default PhotoTimeline;
