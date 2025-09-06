import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr' | 'es' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    'nav.portfolio': 'Portfolio',
    'nav.create': 'Create',
    
    // Settings
    'settings.title': 'Settings',
    'settings.privacy': 'Privacy & Security',
    'settings.public_profile': 'Public Profile',
    'settings.public_profile_desc': 'Allow others to discover your profile',
    'settings.investment_activity': 'Investment Activity',
    'settings.investment_activity_desc': 'Show your investments publicly',
    'settings.direct_messages': 'Direct Messages',
    'settings.direct_messages_desc': 'Allow artists and labels to contact you',
    'settings.app_preferences': 'App Preferences',
    'settings.dark_mode': 'Dark Mode',
    'settings.dark_mode_desc': 'Use dark theme (recommended)',
    'settings.audio_preview': 'Audio Preview',
    'settings.audio_preview_desc': 'Auto-play music samples',
    'settings.language': 'Language',
    'settings.language_desc': 'Choose your preferred language',
    
    // Investment
    'investment.title': 'Investment',
    'investment.amount': 'Amount',
    'investment.payment_method': 'Payment Method',
    'investment.credit_card': 'Credit/Debit Card',
    'investment.bank_transfer': 'Bank Transfer',
    'investment.mobile_payment': 'Mobile Payment',
    'investment.jurisdiction': 'Jurisdiction',
    'investment.invest_now': 'Invest Now',
    'investment.payment_error': 'Payment Error',
    'investment.payment_failed': 'Payment processing failed. Please try again.',
    
    // Search
    'search.trending_now': 'Trending Now',
    'search.popular_searches': 'Popular Searches',
    'search.fan_search': 'Fan Search',
    'search.top': 'Top',
    'search.artists': 'Artists',
    'search.songs': 'Songs',
    'search.playlists': 'Playlists',
    'search.live': 'LIVE',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.search': 'Recherche',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Paramètres',
    'nav.portfolio': 'Portfolio',
    'nav.create': 'Créer',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.privacy': 'Confidentialité & Sécurité',
    'settings.public_profile': 'Profil Public',
    'settings.public_profile_desc': 'Permettre aux autres de découvrir votre profil',
    'settings.investment_activity': 'Activité d\'Investissement',
    'settings.investment_activity_desc': 'Afficher vos investissements publiquement',
    'settings.direct_messages': 'Messages Directs',
    'settings.direct_messages_desc': 'Permettre aux artistes et labels de vous contacter',
    'settings.app_preferences': 'Préférences de l\'App',
    'settings.dark_mode': 'Mode Sombre',
    'settings.dark_mode_desc': 'Utiliser le thème sombre (recommandé)',
    'settings.audio_preview': 'Aperçu Audio',
    'settings.audio_preview_desc': 'Lecture automatique des échantillons musicaux',
    'settings.language': 'Langue',
    'settings.language_desc': 'Choisissez votre langue préférée',
    
    // Investment
    'investment.title': 'Investissement',
    'investment.amount': 'Montant',
    'investment.payment_method': 'Méthode de Paiement',
    'investment.credit_card': 'Carte de Crédit/Débit',
    'investment.bank_transfer': 'Virement Bancaire',
    'investment.mobile_payment': 'Paiement Mobile',
    'investment.jurisdiction': 'Juridiction',
    'investment.invest_now': 'Investir Maintenant',
    'investment.payment_error': 'Erreur de Paiement',
    'investment.payment_failed': 'Échec du traitement du paiement. Veuillez réessayer.',
    
    // Search
    'search.trending_now': 'Tendances Actuelles',
    'search.popular_searches': 'Recherches Populaires',
    'search.fan_search': 'Recherche Fan',
    'search.top': 'Top',
    'search.artists': 'Artistes',
    'search.songs': 'Chansons',
    'search.playlists': 'Playlists',
    'search.live': 'DIRECT',
    
    // Common
    'common.loading': 'Chargement...',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.back': 'Retour',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.search': 'Buscar',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Configuración',
    'nav.portfolio': 'Portfolio',
    'nav.create': 'Crear',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.privacy': 'Privacidad y Seguridad',
    'settings.public_profile': 'Perfil Público',
    'settings.public_profile_desc': 'Permitir que otros descubran tu perfil',
    'settings.investment_activity': 'Actividad de Inversión',
    'settings.investment_activity_desc': 'Mostrar tus inversiones públicamente',
    'settings.direct_messages': 'Mensajes Directos',
    'settings.direct_messages_desc': 'Permitir que artistas y sellos te contacten',
    'settings.app_preferences': 'Preferencias de la App',
    'settings.dark_mode': 'Modo Oscuro',
    'settings.dark_mode_desc': 'Usar tema oscuro (recomendado)',
    'settings.audio_preview': 'Vista Previa de Audio',
    'settings.audio_preview_desc': 'Reproducir automáticamente muestras musicales',
    'settings.language': 'Idioma',
    'settings.language_desc': 'Elige tu idioma preferido',
    
    // Investment
    'investment.title': 'Inversión',
    'investment.amount': 'Cantidad',
    'investment.payment_method': 'Método de Pago',
    'investment.credit_card': 'Tarjeta de Crédito/Débito',
    'investment.bank_transfer': 'Transferencia Bancaria',
    'investment.mobile_payment': 'Pago Móvil',
    'investment.jurisdiction': 'Jurisdicción',
    'investment.invest_now': 'Invertir Ahora',
    'investment.payment_error': 'Error de Pago',
    'investment.payment_failed': 'Error en el procesamiento del pago. Inténtalo de nuevo.',
    
    // Search
    'search.trending_now': 'Tendencias Ahora',
    'search.popular_searches': 'Búsquedas Populares',
    'search.fan_search': 'Búsqueda Fan',
    'search.top': 'Top',
    'search.artists': 'Artistas',
    'search.songs': 'Canciones',
    'search.playlists': 'Playlists',
    'search.live': 'EN VIVO',
    
    // Common
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.back': 'Atrás',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.search': 'Suchen',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Einstellungen',
    'nav.portfolio': 'Portfolio',
    'nav.create': 'Erstellen',
    
    // Settings
    'settings.title': 'Einstellungen',
    'settings.privacy': 'Datenschutz & Sicherheit',
    'settings.public_profile': 'Öffentliches Profil',
    'settings.public_profile_desc': 'Anderen erlauben, Ihr Profil zu entdecken',
    'settings.investment_activity': 'Investment-Aktivität',
    'settings.investment_activity_desc': 'Zeigen Sie Ihre Investitionen öffentlich',
    'settings.direct_messages': 'Direkte Nachrichten',
    'settings.direct_messages_desc': 'Künstlern und Labels erlauben, Sie zu kontaktieren',
    'settings.app_preferences': 'App-Einstellungen',
    'settings.dark_mode': 'Dunkler Modus',
    'settings.dark_mode_desc': 'Dunkles Theme verwenden (empfohlen)',
    'settings.audio_preview': 'Audio-Vorschau',
    'settings.audio_preview_desc': 'Musik-Samples automatisch abspielen',
    'settings.language': 'Sprache',
    'settings.language_desc': 'Wählen Sie Ihre bevorzugte Sprache',
    
    // Investment
    'investment.title': 'Investition',
    'investment.amount': 'Betrag',
    'investment.payment_method': 'Zahlungsmethode',
    'investment.credit_card': 'Kredit-/Debitkarte',
    'investment.bank_transfer': 'Banküberweisung',
    'investment.mobile_payment': 'Mobile Zahlung',
    'investment.jurisdiction': 'Gerichtsbarkeit',
    'investment.invest_now': 'Jetzt Investieren',
    'investment.payment_error': 'Zahlungsfehler',
    'investment.payment_failed': 'Zahlungsverarbeitung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    
    // Search
    'search.trending_now': 'Jetzt im Trend',
    'search.popular_searches': 'Beliebte Suchen',
    'search.fan_search': 'Fan-Suche',
    'search.top': 'Top',
    'search.artists': 'Künstler',
    'search.songs': 'Songs',
    'search.playlists': 'Playlists',
    'search.live': 'LIVE',
    
    // Common
    'common.loading': 'Wird geladen...',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    'common.back': 'Zurück',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr'); // Default to French

  // Load saved language from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('spark-language') as Language;
    if (saved && Object.keys(translations).includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('spark-language', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}