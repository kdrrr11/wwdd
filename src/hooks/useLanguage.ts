// src/hooks/useLanguage.ts
import { useState, useEffect, createContext, useContext } from 'react';
import { detectUserLanguage, getTranslation, setDocumentLanguage } from '../utils/languages';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'tr',
  setLanguage: () => {},
  t: (key: string) => key
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguageProvider = () => {
  const [language, setLanguageState] = useState(() => {
    return detectUserLanguage();
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    setDocumentLanguage(lang);
  };

  const t = (key: string): string => {
    return getTranslation(key, language);
  };

  useEffect(() => {
    setDocumentLanguage(language);
  }, [language]);

  return {
    language,
    setLanguage,
    t
  };
};