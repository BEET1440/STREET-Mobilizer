import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Languages, ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'sw', label: 'Swahili', flag: '🇰🇪' },
    { code: 'sheng', label: 'Sheng', flag: '🇰🇪' }
  ];

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm">
        <Languages size={16} className="text-blue-600" />
        <span>{languages.find(l => l.code === language).label}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
      
      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => setLanguage(l.code)}
            className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition ${
              language === l.code ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">{l.flag}</span>
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
