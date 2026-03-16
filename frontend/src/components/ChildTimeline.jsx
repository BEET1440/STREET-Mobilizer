import React from 'react';
import { CheckCircle2, Clock, MapPin, School, Home, Heart, Shield } from 'lucide-react';

const EVENT_ICONS = {
  'IDENTIFIED': <MapPin size={16} className="text-blue-500" />,
  'HEALTH_CHECK': <Heart size={16} className="text-red-500" />,
  'SHELTER_PLACEMENT': <Home size={16} className="text-orange-500" />,
  'SCHOOL_ENROLLMENT': <School size={16} className="text-purple-500" />,
  'FAMILY_TRACED': <Clock size={16} className="text-green-500" />,
  'REINTEGRATION': <CheckCircle2 size={16} className="text-green-600" />,
  'FOLLOW_UP': <Shield size={16} className="text-gray-500" />,
};

const ChildTimeline = ({ events }) => {
  if (!events || events.length === 0) return <p className="text-gray-400 italic">No timeline events recorded.</p>;

  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <div className="space-y-8">
        {events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((event, idx) => (
          <div key={idx} className="relative pl-10">
            {/* Icon Dot */}
            <div className="absolute left-0 top-1 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center z-10">
              {EVENT_ICONS[event.eventType] || <Clock size={16} />}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{event.eventType.replace('_', ' ')}</h4>
                <span className="text-[10px] text-gray-400 font-mono">{new Date(event.timestamp).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-blue-600">{event.organization}</span>
                <span className="text-gray-400 truncate ml-4 max-w-[150px]" title={event.blockchainHash}>
                  BC: {event.blockchainHash?.substring(0, 16)}...
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChildTimeline;
