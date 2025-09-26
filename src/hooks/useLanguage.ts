// src/hooks/useLanguage.ts
import { useState, useEffect, createContext, useContext } from 'react';
import { detectUserLanguage, getTranslation } from '../utils/languages';

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
    const saved = localStorage.getItem('language');
    return saved || detectUserLanguage();
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    
    // RTL support for Arabic
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  const t = (key: string): string => {
    return getTranslation(key, language);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  return {
    language,
    setLanguage,
    t
  };
};