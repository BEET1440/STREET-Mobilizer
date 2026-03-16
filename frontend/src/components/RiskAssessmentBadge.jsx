import React from 'react';
import { AlertTriangle, Info, ShieldAlert, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

const RiskAssessmentBadge = ({ assessment }) => {
  if (!assessment) return null;

  const { score, level, reasons, trend } = assessment;

  const getLevelStyles = (lvl) => {
    switch (lvl) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (s) => {
    if (s >= 80) return 'text-red-600';
    if (s >= 60) return 'text-orange-600';
    if (s >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg border-2 ${getLevelStyles(level)}`}>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {score >= 60 ? <ShieldAlert size={20} /> : <CheckCircle size={20} />}
            <span className="font-bold text-lg">Risk Level: {level}</span>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-black ${getScoreColor(score)}`}>{score}</span>
            <span className="text-xs ml-1 opacity-70">/100</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium mb-4">
          <span>AI Prediction Trend:</span>
          {trend === 'increasing' ? (
            <span className="flex items-center text-red-600"><TrendingUp size={14} /> Rising Risk</span>
          ) : (
            <span className="flex items-center text-green-600"><TrendingDown size={14} /> Stabilizing</span>
          )}
        </div>

        {reasons && reasons.length > 0 && (
          <div className="bg-white/50 p-3 rounded border border-current/10">
            <p className="text-xs font-bold uppercase mb-2 flex items-center gap-1">
              <Info size={12} /> Key Risk Factors
            </p>
            <ul className="space-y-1">
              {reasons.map((reason, idx) => (
                <li key={idx} className="text-xs flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {level === 'CRITICAL' && (
        <div className="flex items-center gap-2 p-3 bg-red-600 text-white rounded-lg animate-pulse shadow-lg">
          <AlertTriangle size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">Immediate Intervention Required</span>
        </div>
      )}
    </div>
  );
};

export default RiskAssessmentBadge;
