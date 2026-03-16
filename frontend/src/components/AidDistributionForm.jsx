import React, { useState } from 'react';
import { Package, Truck, Info, CheckCircle2, AlertCircle } from 'lucide-react';

const AID_TYPES = [
  { id: 'food', label: 'Food & Nutrition', icon: '🍎' },
  { id: 'clothing', label: 'Clothing & Bedding', icon: '👕' },
  { id: 'medical_support', label: 'Medical Support', icon: '💊' },
  { id: 'school_supplies', label: 'School Supplies', icon: '📚' },
];

const AidDistributionForm = ({ childId, onAidRecorded }) => {
  const [itemType, setItemType] = useState('food');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const mockAid = {
        itemType,
        quantity,
        description,
        timestamp: new Date().toISOString(),
        blockchainHash: `0x${Math.random().toString(16).slice(2, 10)}...aid`
      };

      onAidRecorded(mockAid);
      setIsSubmitting(false);
      setSuccess(true);
      
      // Reset form after delay
      setTimeout(() => {
        setSuccess(false);
        setQuantity('');
        setDescription('');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
        <Package size={20} className="text-blue-600" /> Record Aid Distribution
      </h3>

      {success ? (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={24} />
          <div>
            <p className="font-bold">Aid Recorded Successfully</p>
            <p className="text-xs text-green-600">Transaction logged to blockchain for transparency.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {AID_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setItemType(type.id)}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition text-sm font-medium ${
                  itemType === type.id 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-100 hover:border-blue-200 text-gray-600'
                }`}
              >
                <span>{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity / Unit</label>
            <input
              type="text"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g., 2kg, 1 pair, 1 kit"
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Distribution Notes</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the aid..."
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20 resize-none"
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 border border-blue-100">
            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-700 leading-tight">
              Recording this distribution will create a blockchain transaction linked to this child's ID. This prevents duplicate aid and ensures donor transparency.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
              isSubmitting ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
            }`}
          >
            {isSubmitting ? (
              <>
                <Truck size={18} className="animate-bounce" /> Processing Transaction...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} /> Record & Log Distribution
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default AidDistributionForm;
