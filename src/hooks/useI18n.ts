import { useState, useEffect } from 'react';
import { i18n, Language } from '@/lib/i18n';

export function useI18n() {
  const [language, setLanguage] = useState<Language>(i18n.getCurrentLanguage());
  
  useEffect(() => {
    const unsubscribe = i18n.subscribe(() => {
      setLanguage(i18n.getCurrentLanguage());
    });
    
    return unsubscribe;
  }, []);
  
  const changeLanguage = (newLanguage: Language) => {
    i18n.setLanguage(newLanguage);
  };
  
  return {
    language,
    changeLanguage,
    t: i18n.t.bind(i18n)
  };
}