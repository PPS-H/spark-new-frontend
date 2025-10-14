import { useState, useEffect } from 'react';
import { i18n, Language } from '@/lib/i18n';
import i18next from '@/components/i18n';

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
    // keep react-i18next in sync with app language
    try {
      i18next.changeLanguage(newLanguage);
      localStorage.setItem('i18nextLng', newLanguage);
    } catch {}
  };
  
  return {
    language,
    changeLanguage,
    t: i18n.t.bind(i18n)
  };
}