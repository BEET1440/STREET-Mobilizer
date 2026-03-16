import React from 'react';
import { Home, Users, MapPin, Phone, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const ShelterAvailability = ({ shelters, onSelect }) => {
  if (!shelters || shelters.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
        <Home size={24} className="mx-auto text-gray-300 mb-2" />
        <p className="text-sm text-gray-500 italic">No shelters found in this area.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Home size={14} /> Real-Time Shelter Capacity
        </h3>
        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
          LIVE UPDATES
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {shelters.map((shelter) => {
          const availabilityPercentage = (shelter.available / shelter.capacity) * 100;
          const isLow = shelter.available <= 5;
          const isFull = shelter.available === 0;

          return (
            <div 
              key={shelter.id} 
              className={`p-4 rounded-xl border transition group cursor-pointer ${
                isFull ? 'bg-gray-50 border-gray-200 opacity-75' : 
                isLow ? 'bg-orange-50 border-orange-200 hover:border-orange-400' : 
                'bg-white border-gray-100 hover:border-blue-400 shadow-sm hover:shadow-md'
              }`}
              onClick={() => !isFull && onSelect && onSelect(shelter)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-gray-800 flex items-center gap-2">
                    {shelter.name}
                    {isFull && <AlertCircle size={14} className="text-gray-400" />}
                  </h4>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <MapPin size={10} /> {shelter.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black leading-none ${isFull ? 'text-gray-400' : isLow ? 'text-orange-600' : 'text-blue-600'}`}>
                    {shelter.available}
                  </p>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Beds Left</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full transition-all duration-500 ${
                    isFull ? 'bg-gray-300' : isLow ? 'bg-orange-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${100 - availabilityPercentage}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-3 text-gray-500">
                  <span className="flex items-center gap-1"><Users size={10} /> {shelter.occupied}/{shelter.capacity}</span>
                  <span className="flex items-center gap-1 font-bold text-gray-400 uppercase tracking-tighter">
                    <Clock size={10} /> Updated {new Date(shelter.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {!isFull && (
                  <button className="text-blue-600 font-black uppercase tracking-widest group-hover:underline">
                    SELECT
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 border border-blue-100 mt-4">
        <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-blue-700 leading-tight">
          Field workers can instantly reserve a bed for emergency placement. Capacity data is synchronized across the coordination network.
        </p>
      </div>
    </div>
  );
};

export default ShelterAvailability;
