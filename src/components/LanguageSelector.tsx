// src/components/LanguageSelector.tsx
import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { supportedLanguages } from '../utils/languages';
import { Globe, ChevronDown } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = supportedLanguages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-white transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm">{currentLanguage?.flag}</span>
        <span className="text-sm hidden sm:inline">{currentLanguage?.name}</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-50 min-w-[150px]">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                language === lang.code ? 'bg-blue-600/20 text-blue-400' : 'text-white'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};