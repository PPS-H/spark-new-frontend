// Internationalization system for SPARK
export type Language = 'en' | 'fr' | 'es' | 'de';

export interface Translations {
  // Navigation
  home: string;
  search: string;
  analytics: string;
  portfolio: string;
  settings: string;
  create: string;
  
  // Authentication
  login: string;
  register: string;
  logout: string;
  email: string;
  password: string;
  username: string;
  
  // Common actions
  invest: string;
  message: string;
  follow: string;
  share: string;
  save: string;
  cancel: string;
  continue: string;
  back: string;
  
  // Investment
  investNow: string;
  expectedReturn: string;
  monthlyListeners: string;
  fundingGoal: string;
  currentFunding: string;
  riskLevel: string;
  
  // User roles
  fan: string;
  artist: string;
  investor: string;
  label: string;
  
  // Dashboard
  totalInvested: string;
  currentValue: string;
  totalReturn: string;
  activeInvestments: string;
  
  // Search
  searchPlaceholder: string;
  risingArtists: string;
  topResults: string;
  
  // Profile
  profile: string;
  editProfile: string;
  uploadPhoto: string;
  description: string;
  
  // Settings
  language: string;
  notifications: string;
  privacy: string;
  account: string;
  
  // Messages
  welcomeBack: string;
  investmentSuccessful: string;
  profileUpdated: string;
  
  // Streaming platforms
  spotify: string;
  youtube: string;
  apple: string;
  deezer: string;
  soundcloud: string;
  
  // File operations
  chooseFile: string;
  uploadContent: string;
  editProfile: string;
  saveChanges: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    home: "Home",
    search: "Search",
    analytics: "Analytics",
    portfolio: "Portfolio",
    settings: "Settings",
    create: "Create",
    
    // Authentication
    login: "Login",
    register: "Register",
    logout: "Logout",
    email: "Email",
    password: "Password",
    username: "Username",
    
    // Common actions
    invest: "Invest",
    message: "Message",
    follow: "Follow",
    share: "Share",
    save: "Save",
    cancel: "Cancel",
    continue: "Continue",
    back: "Back",
    
    // Investment
    investNow: "Invest Now",
    expectedReturn: "Expected Return",
    monthlyListeners: "Monthly Listeners",
    fundingGoal: "Funding Goal",
    currentFunding: "Current Funding",
    riskLevel: "Risk Level",
    
    // User roles
    fan: "Fan",
    artist: "Artist",
    investor: "Investor",
    label: "Label",
    
    // Dashboard
    totalInvested: "Total Invested",
    currentValue: "Current Value",
    totalReturn: "Total Return",
    activeInvestments: "Active Investments",
    
    // Search
    searchPlaceholder: "Search artists, songs, genres...",
    risingArtists: "Rising Artists",
    topResults: "Top Results",
    
    // Profile
    profile: "Profile",
    uploadPhoto: "Upload Photo",
    description: "Description",
    
    // Settings
    language: "Language",
    notifications: "Notifications",
    privacy: "Privacy",
    account: "Account",
    appPreferences: "App Preferences",
    darkMode: "Dark Mode",
    audioPreviews: "Audio Previews",
    accountActions: "Account Actions",
    changePassword: "Change Password",
    downloadMyData: "Download My Data",
    
    // Messages
    welcomeBack: "Welcome back",
    investmentSuccessful: "Investment successful",
    profileUpdated: "Profile updated",
    
    // Streaming platforms
    spotify: "Spotify",
    youtube: "YouTube",
    apple: "Apple Music",
    deezer: "Deezer",
    soundcloud: "SoundCloud",
    
    // File operations
    chooseFile: "Choose File",
    uploadContent: "Upload Content",
    saveChanges: "Save Changes",
  },
  
  fr: {
    // Navigation
    home: "Accueil",
    search: "Rechercher",
    analytics: "Analytics",
    portfolio: "Portefeuille",
    settings: "Paramètres",
    create: "Créer",
    
    // Authentication
    login: "Connexion",
    register: "S'inscrire",
    logout: "Déconnexion",
    email: "Email",
    password: "Mot de passe",
    username: "Nom d'utilisateur",
    
    // Common actions
    invest: "Investir",
    message: "Message",
    follow: "Suivre",
    share: "Partager",
    save: "Sauvegarder",
    cancel: "Annuler",
    continue: "Continuer",
    back: "Retour",
    
    // Investment
    investNow: "Investir Maintenant",
    expectedReturn: "Rendement Attendu",
    monthlyListeners: "Auditeurs Mensuels",
    fundingGoal: "Objectif de Financement",
    currentFunding: "Financement Actuel",
    riskLevel: "Niveau de Risque",
    
    // User roles
    fan: "Fan",
    artist: "Artiste",
    investor: "Investisseur",
    label: "Label",
    
    // Dashboard
    totalInvested: "Total Investi",
    currentValue: "Valeur Actuelle",
    totalReturn: "Rendement Total",
    activeInvestments: "Investissements Actifs",
    
    // Search
    searchPlaceholder: "Rechercher artistes, chansons, genres...",
    risingArtists: "Artistes Montants",
    topResults: "Meilleurs Résultats",
    
    // Profile
    profile: "Profil",
    editProfile: "Modifier le Profil",
    uploadPhoto: "Télécharger Photo",
    description: "Description",
    
    // Settings
    language: "Langue",
    notifications: "Notifications",
    privacy: "Confidentialité",
    account: "Compte",
    appPreferences: "Préférences de l'App",
    darkMode: "Mode Sombre",
    audioPreviews: "Aperçus Audio",
    accountActions: "Actions du Compte",
    changePassword: "Changer le Mot de Passe",
    downloadMyData: "Télécharger Mes Données",
    
    // Messages
    welcomeBack: "Bon retour",
    investmentSuccessful: "Investissement réussi",
    profileUpdated: "Profil mis à jour",
    
    // Streaming platforms
    spotify: "Spotify",
    youtube: "YouTube",
    apple: "Apple Music",
    deezer: "Deezer",
    soundcloud: "SoundCloud",
  },
  
  es: {
    // Navigation
    home: "Inicio",
    search: "Buscar",
    analytics: "Analytics",
    portfolio: "Portafolio",
    settings: "Configuración",
    create: "Crear",
    
    // Authentication
    login: "Iniciar Sesión",
    register: "Registrarse",
    logout: "Cerrar Sesión",
    email: "Email",
    password: "Contraseña",
    username: "Nombre de Usuario",
    
    // Common actions
    invest: "Invertir",
    message: "Mensaje",
    follow: "Seguir",
    share: "Compartir",
    save: "Guardar",
    cancel: "Cancelar",
    continue: "Continuar",
    back: "Atrás",
    
    // Investment
    investNow: "Invertir Ahora",
    expectedReturn: "Retorno Esperado",
    monthlyListeners: "Oyentes Mensuales",
    fundingGoal: "Meta de Financiación",
    currentFunding: "Financiación Actual",
    riskLevel: "Nivel de Riesgo",
    
    // User roles
    fan: "Fan",
    artist: "Artista",
    investor: "Inversor",
    label: "Discográfica",
    
    // Dashboard
    totalInvested: "Total Invertido",
    currentValue: "Valor Actual",
    totalReturn: "Retorno Total",
    activeInvestments: "Inversiones Activas",
    
    // Search
    searchPlaceholder: "Buscar artistas, canciones, géneros...",
    risingArtists: "Artistas Emergentes",
    topResults: "Mejores Resultados",
    
    // Profile
    profile: "Perfil",
    editProfile: "Editar Perfil",
    uploadPhoto: "Subir Foto",
    description: "Descripción",
    
    // Settings
    language: "Idioma",
    notifications: "Notificaciones",
    privacy: "Privacidad",
    account: "Cuenta",
    
    // Messages
    welcomeBack: "Bienvenido de vuelta",
    investmentSuccessful: "Inversión exitosa",
    profileUpdated: "Perfil actualizado",
    
    // Streaming platforms
    spotify: "Spotify",
    youtube: "YouTube",
    apple: "Apple Music",
    deezer: "Deezer",
    soundcloud: "SoundCloud",
  },
  
  de: {
    // Navigation
    home: "Startseite",
    search: "Suchen",
    analytics: "Analytics",
    portfolio: "Portfolio",
    settings: "Einstellungen",
    create: "Erstellen",
    
    // Authentication
    login: "Anmelden",
    register: "Registrieren",
    logout: "Abmelden",
    email: "Email",
    password: "Passwort",
    username: "Benutzername",
    
    // Common actions
    invest: "Investieren",
    message: "Nachricht",
    follow: "Folgen",
    share: "Teilen",
    save: "Speichern",
    cancel: "Abbrechen",
    continue: "Weiter",
    back: "Zurück",
    
    // Investment
    investNow: "Jetzt Investieren",
    expectedReturn: "Erwartete Rendite",
    monthlyListeners: "Monatliche Hörer",
    fundingGoal: "Finanzierungsziel",
    currentFunding: "Aktuelle Finanzierung",
    riskLevel: "Risikoniveau",
    
    // User roles
    fan: "Fan",
    artist: "Künstler",
    investor: "Investor",
    label: "Label",
    
    // Dashboard
    totalInvested: "Gesamt Investiert",
    currentValue: "Aktueller Wert",
    totalReturn: "Gesamtrendite",
    activeInvestments: "Aktive Investitionen",
    
    // Search
    searchPlaceholder: "Künstler, Songs, Genres suchen...",
    risingArtists: "Aufstrebende Künstler",
    topResults: "Top Ergebnisse",
    
    // Profile
    profile: "Profil",
    editProfile: "Profil Bearbeiten",
    uploadPhoto: "Foto Hochladen",
    description: "Beschreibung",
    
    // Settings
    language: "Sprache",
    notifications: "Benachrichtigungen",
    privacy: "Privatsphäre",
    account: "Konto",
    
    // Messages
    welcomeBack: "Willkommen zurück",
    investmentSuccessful: "Investition erfolgreich",
    profileUpdated: "Profil aktualisiert",
    
    // Streaming platforms
    spotify: "Spotify",
    youtube: "YouTube",
    apple: "Apple Music",
    deezer: "Deezer",
    soundcloud: "SoundCloud",
  }
};

class I18nService {
  private currentLanguage: Language = 'en';
  private listeners: Array<() => void> = [];
  
  constructor() {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('spark-language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    }
  }
  
  setLanguage(language: Language): void {
    if (translations[language]) {
      this.currentLanguage = language;
      localStorage.setItem('spark-language', language);
      this.notifyListeners();
    }
  }
  
  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }
  
  t(key: keyof Translations): string {
    return translations[this.currentLanguage][key] || translations['en'][key] || key;
  }
  
  subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const i18n = new I18nService();