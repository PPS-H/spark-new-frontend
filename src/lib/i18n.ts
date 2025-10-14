// Internationalization system for SPARK
import i18next from "../components/i18n";
export type Language = 'en' | 'fr' | 'es' | 'pt' | 'it' | 'ja' | 'zh' | 'ko';

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
  saveChanges: string;
  
  // Marketing & Landing
  investInMusic: string;
  discoverEmergingArtists: string;
  shareInSuccess: string;
  futureOfMusicInvestment: string;
  startInvesting: string;
  whyChooseSpark: string;
  chooseYourJourney: string;
  perfectPlan: string;
  smartInvestments: string;
  aiPoweredRecommendations: string;
  globalReach: string;
  accessArtists: string;
  securePlatform: string;
  bankGradeSecurity: string;
  joinAsArtist: string;
  joinAsLabel: string;
  joinAsFan: string;
  explorePlans: string;
  signIn: string;
  
  // Features
  smartInvestmentTools: string;
  portfolioTracking: string;
  earlyAccessToTalent: string;
  professionalDashboard: string;
  fundingCampaigns: string;
  fanAnalytics: string;
  platformIntegration: string;
  advancedArtistDiscovery: string;
  directContactTools: string;
  marketIntelligence: string;
  exclusiveAccess: string;
  browseGlobalArtists: string;
  
  // Pricing
  freeForever: string;
  monthly: string;
  yearly: string;
  popular: string;
  mostPopular: string;
  bestValue: string;
  getStarted: string;
  upgradeNow: string;
  currentPlan: string;
  
  // Common UI
  loading: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  required: string;
  optional: string;
  invalid: string;
  valid: string;
  confirm: string;
  submit: string;
  close: string;
  open: string;
  view: string;
  edit: string;
  delete: string;
  next: string;
  previous: string;
  finish: string;
  complete: string;
  start: string;
  stop: string;
  refresh: string;
  retry: string;
  
  // Status
  active: string;
  inactive: string;
  enabled: string;
  disabled: string;
  public: string;
  private: string;
  visible: string;
  hidden: string;
  available: string;
  unavailable: string;
  completed: string;
  inProgress: string;
  pending: string;
  cancelled: string;
  expired: string;
  
  // Forms
  emailRequired: string;
  passwordRequired: string;
  usernameRequired: string;
  confirmPasswordRequired: string;
  passwordsDoNotMatch: string;
  invalidEmail: string;
  strongPassword: string;
  minLength: string;
  maxLength: string;
  
  // Messages
  settingsUpdated: string;
  emailVerified: string;
  accountCreated: string;
  loginSuccessful: string;
  logoutSuccessful: string;
  operationSuccessful: string;
  operationFailed: string;
  tryAgain: string;
  contactSupport: string;
  
  // Payment
  paymentProcessing: string;
  paymentSuccess: string;
  paymentFailed: string;
  billing: string;
  subscription: string;
  invoice: string;
  receipt: string;
  refund: string;
  amount: string;
  price: string;
  cost: string;
  total: string;
  subtotal: string;
  tax: string;
  discount: string;
  paid: string;
  
  // System
  systemStatus: string;
  operational: string;
  running: string;
  connected: string;
  disconnected: string;
  online: string;
  offline: string;
  lastRun: string;
  nextScheduled: string;
  automation: string;
  compliance: string;
  
  // Time
  today: string;
  yesterday: string;
  tomorrow: string;
  thisWeek: string;
  thisMonth: string;
  thisYear: string;
  lastWeek: string;
  lastMonth: string;
  lastYear: string;
  
  // File operations
  download: string;
  upload: string;
  file: string;
  image: string;
  audio: string;
  video: string;
  
  // Settings Page Specific Translations
  manageAccountPreferences: string;
  accountInformation: string;
  displayName: string;
  emailCannotBeChanged: string;
  profilePicture: string;
  selectImageFile: string;
  updating: string;
  updateProfile: string;
  emailNotifications: string;
  investmentUpdatesAndNews: string;
  pushNotifications: string;
  realTimeAlertsOnDevice: string;
  fundingAlerts: string;
  whenCampaignsReachMilestones: string;
  publicProfile: string;
  allowOthersToDiscoverProfile: string;
  investmentActivity: string;
  showInvestmentsPublicly: string;
  directMessages: string;
  allowArtistsAndLabelsToContact: string;
  appPreferences: string;
  darkMode: string;
  darkModeDescription: string;
  audioPreview: string;
  audioPreviewDescription: string;
  languageDescription: string;
  connectYourAccounts: string;
  connectStripeAccount: string;
  connecting: string;
  connectStripe: string;
  proRequired: string;
  upgradeToProToConnectStripe: string;
  connectStripeAccountToReceivePayments: string;
  upgradeToProToReceivePayments: string;
  subscriptionAndProFeatures: string;
  proMember: string;
  artistPro: string;
  labelPro: string;
  nextBilling: string;
  freePlan: string;
  upgradeToProForPremiumFeatures: string;
  free: string;
  availablePlans: string;
  features: string;
  processing: string;
  upgradeToPro: string;
  
  // Error Messages for Settings
  invalidFileType: string;
  pleaseSelectImageFile: string;
  fileTooLarge: string;
  pleaseSelectImageSmallerThan5MB: string;
  invalidName: string;
  pleaseEnterValidDisplayName: string;
  profileUpdatedSuccessfully: string;
  updateFailed: string;
  failedToUpdateProfile: string;
  settingUpdated: string;
  preferenceUpdatedSuccessfully: string;
  failedToUpdateSetting: string;
  languageUpdated: string;
  languagePreferenceUpdatedSuccessfully: string;
  failedToUpdateLanguage: string;
  missingCurrentPassword: string;
  pleaseEnterCurrentPassword: string;
  missingNewPassword: string;
  pleaseEnterNewPassword: string;
  passwordMismatch: string;
  newPasswordAndConfirmPasswordDoNotMatch: string;
  weakPassword: string;
  passwordMustBeAtLeast6Characters: string;
  passwordChanged: string;
  passwordUpdatedSuccessfully: string;
  passwordChangeFailed: string;
  failedToChangePassword: string;
  spotifyConnected: string;
  spotifyConnectionSuccess: string;
  spotifyConnectionFailed: string;
  failedToConnectSpotify: string;
  stripeConnected: string;
  stripeConnectionSuccess: string;
  stripeConnectionFailed: string;
  failedToConnectStripe: string;
  loadingSubscriptionDetails: string;
  
  // Additional missing keys
  accountActions: string;
  changePassword: string;
  signOut: string;
  deleteAccount: string;
  deleteAccountWarning: string;
  currentPassword: string;
  enterCurrentPassword: string;
  newPassword: string;
  enterNewPassword: string;
  confirmNewPassword: string;
  confirmNewPasswordPlaceholder: string;
  changing: string;
  changePasswordButton: string;
  downloadMyData: string;
  connectSpotify: string;
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
    audioPreview: "Audio Preview",
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
    
    // Marketing & Landing
    investInMusic: "INVEST IN MUSIC",
    discoverEmergingArtists: "Discover emerging artists, invest in their future, and share in their success. The future of music investment is here.",
    shareInSuccess: "share in their success",
    futureOfMusicInvestment: "The future of music investment is here.",
    startInvesting: "Start Investing",
    whyChooseSpark: "Why Choose SPARK",
    chooseYourJourney: "Choose Your Journey",
    perfectPlan: "Whether you're an investor or artist, we have the perfect plan",
    smartInvestments: "Smart Investments",
    aiPoweredRecommendations: "AI-powered recommendations to discover the next big artists before they break mainstream",
    globalReach: "Global Reach",
    accessArtists: "Access artists from every corner of the world across all genres and cultural scenes",
    securePlatform: "Secure Platform",
    bankGradeSecurity: "Bank-grade security with transparent investment tracking and verified artist profiles",
    joinAsArtist: "Join as Artist",
    joinAsLabel: "Join as Label",
    joinAsFan: "Join as Fan",
    explorePlans: "Explore Plans",
    signIn: "Sign In",
    
    // Features
    smartInvestmentTools: "Smart investment tools",
    portfolioTracking: "Portfolio tracking",
    earlyAccessToTalent: "Early access to talent",
    professionalDashboard: "Professional dashboard",
    fundingCampaigns: "Funding campaigns",
    fanAnalytics: "Fan analytics",
    platformIntegration: "Platform integration",
    advancedArtistDiscovery: "Advanced artist discovery",
    directContactTools: "Direct contact tools",
    marketIntelligence: "Market intelligence",
    exclusiveAccess: "Exclusive access",
    browseGlobalArtists: "Browse global artists",
    
    // Pricing
    freeForever: "Free Forever",
    monthly: "month",
    yearly: "year",
    popular: "Popular",
    mostPopular: "Most Popular",
    bestValue: "Best Value",
    getStarted: "Get Started",
    upgradeNow: "Upgrade Now",
    currentPlan: "Current Plan",
    
    // Common UI
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",
    required: "Required",
    optional: "Optional",
    invalid: "Invalid",
    valid: "Valid",
    confirm: "Confirm",
    submit: "Submit",
    close: "Close",
    open: "Open",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    back: "Back",
    next: "Next",
    previous: "Previous",
    continue: "Continue",
    finish: "Finish",
    complete: "Complete",
    start: "Start",
    stop: "Stop",
    refresh: "Refresh",
    retry: "Retry",
    
    // Status
    active: "Active",
    inactive: "Inactive",
    enabled: "Enabled",
    disabled: "Disabled",
    public: "Public",
    private: "Private",
    visible: "Visible",
    hidden: "Hidden",
    available: "Available",
    unavailable: "Unavailable",
    completed: "Completed",
    inProgress: "In Progress",
    pending: "Pending",
    cancelled: "Cancelled",
    expired: "Expired",
    
    // Forms
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
    usernameRequired: "Username is required",
    confirmPasswordRequired: "Confirm password is required",
    passwordsDoNotMatch: "Passwords do not match",
    invalidEmail: "Invalid email address",
    weakPassword: "Password is too weak",
    strongPassword: "Strong password",
    minLength: "Minimum length",
    maxLength: "Maximum length",
    
    // Messages
    welcomeBack: "Welcome back",
    profileUpdated: "Profile updated",
    settingsUpdated: "Settings updated",
    languageUpdated: "Language updated",
    passwordChanged: "Password changed",
    emailVerified: "Email verified",
    accountCreated: "Account created",
    loginSuccessful: "Login successful",
    logoutSuccessful: "Logout successful",
    operationSuccessful: "Operation successful",
    operationFailed: "Operation failed",
    tryAgain: "Try again",
    contactSupport: "Contact support",
    
    // Payment
    paymentProcessing: "Payment processing",
    paymentSuccess: "Payment successful",
    paymentFailed: "Payment failed",
    billing: "Billing",
    subscription: "Subscription",
    invoice: "Invoice",
    receipt: "Receipt",
    refund: "Refund",
    amount: "Amount",
    price: "Price",
    cost: "Cost",
    total: "Total",
    subtotal: "Subtotal",
    tax: "Tax",
    discount: "Discount",
    free: "Free",
    paid: "Paid",
    
    // System
    systemStatus: "System Status",
    operational: "Operational",
    running: "Running",
    connected: "Connected",
    disconnected: "Disconnected",
    online: "Online",
    offline: "Offline",
    lastRun: "Last Run",
    nextScheduled: "Next Scheduled",
    automation: "Automation",
    compliance: "Compliance",
    
    // Time
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisYear: "This Year",
    lastWeek: "Last Week",
    lastMonth: "Last Month",
    lastYear: "Last Year",
    
    // File operations
    download: "Download",
    upload: "Upload",
    file: "File",
    image: "Image",
    audio: "Audio",
    video: "Video",
    
    // Settings Page Specific Translations
    manageAccountPreferences: "Manage your account and preferences",
    accountInformation: "Account Information",
    displayName: "Display Name",
    emailCannotBeChanged: "Email cannot be changed",
    profilePicture: "Profile Picture",
    selectImageFile: "Select an image file (max 5MB)",
    updating: "Updating...",
    updateProfile: "Update Profile",
    emailNotifications: "Email Notifications",
    investmentUpdatesAndNews: "Investment updates and news",
    pushNotifications: "Push Notifications",
    realTimeAlertsOnDevice: "Real-time alerts on your device",
    fundingAlerts: "Funding Alerts",
    whenCampaignsReachMilestones: "When campaigns reach milestones",
    publicProfile: "Public Profile",
    allowOthersToDiscoverProfile: "Allow others to discover your profile",
    investmentActivity: "Investment Activity",
    showInvestmentsPublicly: "Show your investments publicly",
    directMessages: "Direct Messages",
    allowArtistsAndLabelsToContact: "Allow artists and labels to contact you",
    appPreferences: "App Preferences",
    darkMode: "Dark Mode",
    darkModeDescription: "Use eye-friendly dark theme",
    audioPreview: "Audio Preview",
    audioPreviewDescription: "Enable automatic music playback",
    languageDescription: "Choose your app display language",
    connectYourAccounts: "Connect Your Accounts",
    connectStripeAccount: "Connect Stripe Account",
    connecting: "Connecting...",
    stripeConnected: "Stripe Connected",
    connectStripe: "Connect Stripe",
    proRequired: "Pro Required",
    upgradeToProToConnectStripe: "Upgrade to Pro to connect Stripe",
    connectStripeAccountToReceivePayments: "Connect your Stripe account to receive payments from investments",
    upgradeToProToReceivePayments: "Upgrade to Pro to connect Stripe and receive payments",
    subscriptionAndProFeatures: "Subscription & Pro Features",
    proMember: "Pro Member",
    artistPro: "Artist Pro",
    labelPro: "Label Pro",
    nextBilling: "Next billing",
    freePlan: "Free Plan",
    upgradeToProForPremiumFeatures: "Upgrade to Pro for premium features",
    free: "Free",
    availablePlans: "Available Plans",
    features: "Features",
    processing: "Processing...",
    upgradeToPro: "Upgrade to Pro",
    
    // Error Messages for Settings
    invalidFileType: "Invalid File Type",
    pleaseSelectImageFile: "Please select an image file.",
    fileTooLarge: "File Too Large",
    pleaseSelectImageSmallerThan5MB: "Please select an image smaller than 5MB.",
    invalidName: "Invalid Name",
    pleaseEnterValidDisplayName: "Please enter a valid display name.",
    profileUpdatedSuccessfully: "Your profile has been updated successfully.",
    updateFailed: "Update Failed",
    failedToUpdateProfile: "Failed to update profile. Please try again.",
    settingUpdated: "Setting Updated",
    preferenceUpdatedSuccessfully: "Your preference has been updated successfully.",
    failedToUpdateSetting: "Failed to update setting. Please try again.",
    languageUpdated: "Language Updated",
    languagePreferenceUpdatedSuccessfully: "Your language preference has been updated successfully.",
    failedToUpdateLanguage: "Failed to update language. Please try again.",
    missingCurrentPassword: "Missing Current Password",
    pleaseEnterCurrentPassword: "Please enter your current password.",
    missingNewPassword: "Missing New Password",
    pleaseEnterNewPassword: "Please enter a new password.",
    passwordMismatch: "Password Mismatch",
    newPasswordAndConfirmPasswordDoNotMatch: "New password and confirm password do not match.",
    weakPassword: "Weak Password",
    passwordMustBeAtLeast6Characters: "Password must be at least 6 characters long.",
    passwordChanged: "Password Changed",
    passwordUpdatedSuccessfully: "Your password has been updated successfully.",
    passwordChangeFailed: "Password Change Failed",
    failedToChangePassword: "Failed to change password. Please try again.",
    spotifyConnected: "Spotify Connected",
    spotifyConnectionSuccess: "Spotify account connected successfully.",
    spotifyConnectionFailed: "Spotify Connection Failed",
    failedToConnectSpotify: "Failed to connect Spotify. Please try again.",
    stripeConnected: "Stripe Connected",
    stripeConnectionSuccess: "Stripe account connected successfully.",
    stripeConnectionFailed: "Stripe Connection Failed",
    failedToConnectStripe: "Failed to connect Stripe. Please try again.",
    loadingSubscriptionDetails: "Loading subscription details...",
    
    // Additional missing keys
    accountActions: "Account Actions",
    changePassword: "Change Password",
    signOut: "Sign Out",
    deleteAccount: "Delete Account",
    deleteAccountWarning: "This action cannot be undone and will permanently delete your account.",
    currentPassword: "Current Password",
    enterCurrentPassword: "Enter your current password",
    newPassword: "New Password",
    enterNewPassword: "Enter a new password",
    confirmNewPassword: "Confirm New Password",
    confirmNewPasswordPlaceholder: "Confirm your new password",
    changing: "Changing...",
    changePasswordButton: "Change Password",
    downloadMyData: "Download My Data",
    connectSpotify: "Connect Spotify",
    editProfile: "Edit Profile",
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
    audioPreview: "Aperçu Audio",
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
    
    // File operations
    chooseFile: "Choisir un fichier",
    uploadContent: "Télécharger du contenu",
    saveChanges: "Sauvegarder les modifications",
    
    // Marketing & Landing
    investInMusic: "INVESTIR DANS LA MUSIQUE",
    discoverEmergingArtists: "Découvrez les artistes émergents, investissez dans leur avenir et partagez leur succès. L'avenir de l'investissement musical est ici.",
    shareInSuccess: "partager leur succès",
    futureOfMusicInvestment: "L'avenir de l'investissement musical est ici.",
    startInvesting: "Commencer à Investir",
    whyChooseSpark: "Pourquoi Choisir",
    chooseYourJourney: "Choisissez Votre",
    perfectPlan: "Que vous soyez investisseur ou artiste, nous avons le plan parfait",
    smartInvestments: "Investissements Intelligents",
    aiPoweredRecommendations: "Recommandations alimentées par l'IA pour découvrir les prochains grands artistes avant qu'ils ne deviennent mainstream",
    globalReach: "Portée Mondiale",
    accessArtists: "Accédez aux artistes de tous les coins du monde à travers tous les genres et scènes culturelles",
    securePlatform: "Plateforme Sécurisée",
    bankGradeSecurity: "Sécurité de niveau bancaire avec suivi transparent des investissements et profils d'artistes vérifiés",
    joinAsArtist: "Rejoindre en tant qu'Artiste",
    joinAsLabel: "Rejoindre en tant que Label",
    joinAsFan: "Rejoindre en tant que Fan",
    explorePlans: "Explorer les Plans",
    signIn: "Se Connecter",
    
    // Features
    smartInvestmentTools: "Outils d'investissement intelligents",
    portfolioTracking: "Suivi de portefeuille",
    earlyAccessToTalent: "Accès anticipé aux talents",
    professionalDashboard: "Tableau de bord professionnel",
    fundingCampaigns: "Campagnes de financement",
    fanAnalytics: "Analyses de fans",
    platformIntegration: "Intégration de plateforme",
    advancedArtistDiscovery: "Découverte avancée d'artistes",
    directContactTools: "Outils de contact direct",
    marketIntelligence: "Intelligence de marché",
    exclusiveAccess: "Accès exclusif",
    browseGlobalArtists: "Parcourir les artistes mondiaux",
    
    // Pricing
    freeForever: "Gratuit à Jamais",
    monthly: "mois",
    yearly: "année",
    popular: "Populaire",
    mostPopular: "Le Plus Populaire",
    bestValue: "Meilleure Valeur",
    getStarted: "Commencer",
    upgradeNow: "Mettre à Niveau Maintenant",
    currentPlan: "Plan Actuel",
    
    // Common UI
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    warning: "Avertissement",
    info: "Info",
    required: "Requis",
    optional: "Optionnel",
    invalid: "Invalide",
    valid: "Valide",
    confirm: "Confirmer",
    submit: "Soumettre",
    close: "Fermer",
    open: "Ouvrir",
    view: "Voir",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Sauvegarder",
    cancel: "Annuler",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    continue: "Continuer",
    finish: "Terminer",
    complete: "Compléter",
    start: "Commencer",
    stop: "Arrêter",
    refresh: "Actualiser",
    retry: "Réessayer",
    
    // Status
    active: "Actif",
    inactive: "Inactif",
    enabled: "Activé",
    disabled: "Désactivé",
    public: "Public",
    private: "Privé",
    visible: "Visible",
    hidden: "Caché",
    available: "Disponible",
    unavailable: "Indisponible",
    completed: "Terminé",
    inProgress: "En Cours",
    pending: "En Attente",
    cancelled: "Annulé",
    expired: "Expiré",
    
    // Forms
    emailRequired: "L'email est requis",
    passwordRequired: "Le mot de passe est requis",
    usernameRequired: "Le nom d'utilisateur est requis",
    confirmPasswordRequired: "La confirmation du mot de passe est requise",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
    invalidEmail: "Adresse email invalide",
    weakPassword: "Mot de passe trop faible",
    strongPassword: "Mot de passe fort",
    minLength: "Longueur minimale",
    maxLength: "Longueur maximale",
    
    // Messages
    welcomeBack: "Bon retour",
    profileUpdated: "Profil mis à jour",
    settingsUpdated: "Paramètres mis à jour",
    languageUpdated: "Langue mise à jour",
    passwordChanged: "Mot de passe modifié",
    emailVerified: "Email vérifié",
    accountCreated: "Compte créé",
    loginSuccessful: "Connexion réussie",
    logoutSuccessful: "Déconnexion réussie",
    operationSuccessful: "Opération réussie",
    operationFailed: "Opération échouée",
    tryAgain: "Réessayer",
    contactSupport: "Contacter le support",
    
    // Payment
    paymentProcessing: "Traitement du paiement",
    paymentSuccess: "Paiement réussi",
    paymentFailed: "Paiement échoué",
    billing: "Facturation",
    subscription: "Abonnement",
    invoice: "Facture",
    receipt: "Reçu",
    refund: "Remboursement",
    amount: "Montant",
    price: "Prix",
    cost: "Coût",
    total: "Total",
    subtotal: "Sous-total",
    tax: "Taxe",
    discount: "Remise",
    free: "Gratuit",
    paid: "Payé",
    
    // System
    systemStatus: "Statut du Système",
    operational: "Opérationnel",
    running: "En Cours",
    connected: "Connecté",
    disconnected: "Déconnecté",
    online: "En Ligne",
    offline: "Hors Ligne",
    lastRun: "Dernière Exécution",
    nextScheduled: "Prochaine Programmation",
    automation: "Automatisation",
    compliance: "Conformité",
    
    // Time
    today: "Aujourd'hui",
    yesterday: "Hier",
    tomorrow: "Demain",
    thisWeek: "Cette Semaine",
    thisMonth: "Ce Mois",
    thisYear: "Cette Année",
    lastWeek: "Semaine Dernière",
    lastMonth: "Mois Dernier",
    lastYear: "Année Dernière",
    
    // File operations
    download: "Télécharger",
    upload: "Téléverser",
    file: "Fichier",
    image: "Image",
    audio: "Audio",
    video: "Vidéo",
    
    // Settings Page Specific Translations
    manageAccountPreferences: "Gérez votre compte et vos préférences",
    accountInformation: "Informations du Compte",
    displayName: "Nom d'Affichage",
    emailCannotBeChanged: "L'email ne peut pas être modifié",
    profilePicture: "Photo de Profil",
    selectImageFile: "Sélectionner un fichier image (max 5MB)",
    updating: "Mise à jour...",
    updateProfile: "Mettre à jour le Profil",
    emailNotifications: "Notifications Email",
    investmentUpdatesAndNews: "Mises à jour d'investissement et actualités",
    pushNotifications: "Notifications Push",
    realTimeAlertsOnDevice: "Alertes en temps réel sur votre appareil",
    fundingAlerts: "Alertes de Financement",
    whenCampaignsReachMilestones: "Quand les campagnes atteignent des jalons",
    publicProfile: "Profil Public",
    allowOthersToDiscoverProfile: "Permettre aux autres de découvrir votre profil",
    investmentActivity: "Activité d'Investissement",
    showInvestmentsPublicly: "Afficher vos investissements publiquement",
    directMessages: "Messages Directs",
    allowArtistsAndLabelsToContact: "Permettre aux artistes et labels de vous contacter",
    darkModeDescription: "Utiliser le thème sombre respectueux des yeux",
    audioPreview: "Aperçu Audio",
    audioPreviewDescription: "Activer la lecture automatique de musique",
    languageDescription: "Choisissez la langue d'affichage de votre application",
    connectYourAccounts: "Connecter Vos Comptes",
    connectStripeAccount: "Connecter le Compte Stripe",
    connecting: "Connexion...",
    stripeConnected: "Stripe Connecté",
    connectStripe: "Connecter Stripe",
    proRequired: "Pro Requis",
    upgradeToProToConnectStripe: "Passer à Pro pour connecter Stripe",
    connectStripeAccountToReceivePayments: "Connectez votre compte Stripe pour recevoir les paiements des investissements",
    upgradeToProToReceivePayments: "Passer à Pro pour connecter Stripe et recevoir des paiements",
    subscriptionAndProFeatures: "Abonnement et Fonctionnalités Pro",
    proMember: "Membre Pro",
    artistPro: "Artiste Pro",
    labelPro: "Label Pro",
    nextBilling: "Prochaine facturation",
    freePlan: "Plan Gratuit",
    upgradeToProForPremiumFeatures: "Passer à Pro pour les fonctionnalités premium",
    free: "Gratuit",
    availablePlans: "Plans Disponibles",
    features: "Fonctionnalités",
    processing: "Traitement...",
    upgradeToPro: "Passer à Pro",
    
    // Error Messages for Settings
    invalidFileType: "Type de Fichier Invalide",
    pleaseSelectImageFile: "Veuillez sélectionner un fichier image.",
    fileTooLarge: "Fichier Trop Volumineux",
    pleaseSelectImageSmallerThan5MB: "Veuillez sélectionner une image plus petite que 5MB.",
    invalidName: "Nom Invalide",
    pleaseEnterValidDisplayName: "Veuillez entrer un nom d'affichage valide.",
    profileUpdatedSuccessfully: "Votre profil a été mis à jour avec succès.",
    updateFailed: "Échec de la Mise à jour",
    failedToUpdateProfile: "Échec de la mise à jour du profil. Veuillez réessayer.",
    settingUpdated: "Paramètre Mis à Jour",
    preferenceUpdatedSuccessfully: "Votre préférence a été mise à jour avec succès.",
    failedToUpdateSetting: "Échec de la mise à jour du paramètre. Veuillez réessayer.",
    languageUpdated: "Langue Mise à Jour",
    languagePreferenceUpdatedSuccessfully: "Votre préférence de langue a été mise à jour avec succès.",
    failedToUpdateLanguage: "Échec de la mise à jour de la langue. Veuillez réessayer.",
    missingCurrentPassword: "Mot de Passe Actuel Manquant",
    pleaseEnterCurrentPassword: "Veuillez entrer votre mot de passe actuel.",
    missingNewPassword: "Nouveau Mot de Passe Manquant",
    pleaseEnterNewPassword: "Veuillez entrer un nouveau mot de passe.",
    passwordMismatch: "Mot de Passe Incompatible",
    newPasswordAndConfirmPasswordDoNotMatch: "Le nouveau mot de passe et la confirmation ne correspondent pas.",
    weakPassword: "Mot de Passe Faible",
    passwordMustBeAtLeast6Characters: "Le mot de passe doit contenir au moins 6 caractères.",
    passwordChanged: "Mot de Passe Modifié",
    passwordUpdatedSuccessfully: "Votre mot de passe a été mis à jour avec succès.",
    passwordChangeFailed: "Échec du Changement de Mot de Passe",
    failedToChangePassword: "Échec du changement de mot de passe. Veuillez réessayer.",
    spotifyConnected: "Spotify Connecté",
    spotifyConnectionSuccess: "Compte Spotify connecté avec succès.",
    spotifyConnectionFailed: "Échec de la Connexion Spotify",
    failedToConnectSpotify: "Échec de la connexion Spotify. Veuillez réessayer.",
    stripeConnected: "Stripe Connecté",
    stripeConnectionSuccess: "Compte Stripe connecté avec succès.",
    stripeConnectionFailed: "Échec de la Connexion Stripe",
    failedToConnectStripe: "Échec de la connexion Stripe. Veuillez réessayer.",
    loadingSubscriptionDetails: "Chargement des détails d'abonnement...",
    
    // Additional missing keys
    signOut: "Se Déconnecter",
    deleteAccount: "Supprimer le Compte",
    deleteAccountWarning: "Cette action ne peut pas être annulée et supprimera définitivement votre compte.",
    currentPassword: "Mot de Passe Actuel",
    enterCurrentPassword: "Entrez votre mot de passe actuel",
    newPassword: "Nouveau Mot de Passe",
    enterNewPassword: "Entrez un nouveau mot de passe",
    confirmNewPassword: "Confirmer le Nouveau Mot de Passe",
    confirmNewPasswordPlaceholder: "Confirmez votre nouveau mot de passe",
    changing: "Modification...",
    changePasswordButton: "Changer le Mot de Passe",
    downloadMyData: "Télécharger Mes Données",
    connectSpotify: "Connecter Spotify",
    editProfile: "Modifier le Profil",
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
    appPreferences: "Preferencias de la App",
    darkMode: "Modo Oscuro",
    audioPreview: "Vista previa de audio",
    accountActions: "Acciones de la cuenta",
    changePassword: "Cambiar contraseña",
    downloadMyData: "Descargar mis datos",
    
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
    
    // Settings Page Specific Translations
    manageAccountPreferences: "Gestiona tu cuenta y preferencias",
    accountInformation: "Información de la cuenta",
    displayName: "Nombre para mostrar",
    emailCannotBeChanged: "El email no se puede cambiar",
    profilePicture: "Foto de perfil",
    selectImageFile: "Selecciona un archivo de imagen (máx 5MB)",
    updating: "Actualizando...",
    updateProfile: "Actualizar perfil",
    emailNotifications: "Notificaciones por email",
    investmentUpdatesAndNews: "Actualizaciones de inversión y noticias",
    pushNotifications: "Notificaciones push",
    realTimeAlertsOnDevice: "Alertas en tiempo real en tu dispositivo",
    fundingAlerts: "Alertas de financiación",
    whenCampaignsReachMilestones: "Cuando las campañas alcanzan hitos",
    publicProfile: "Perfil público",
    allowOthersToDiscoverProfile: "Permitir que otros descubran tu perfil",
    investmentActivity: "Actividad de inversión",
    showInvestmentsPublicly: "Mostrar tus inversiones públicamente",
    directMessages: "Mensajes directos",
    allowArtistsAndLabelsToContact: "Permitir que artistas y sellos te contacten",
    darkModeDescription: "Usar tema oscuro agradable a la vista",
    audioPreviewDescription: "Habilitar reproducción automática de música",
    languageDescription: "Elige el idioma de la aplicación",
    connectYourAccounts: "Conecta tus cuentas",
    connectStripeAccount: "Conectar cuenta de Stripe",
    connecting: "Conectando...",
    stripeConnected: "Stripe conectado",
    connectStripe: "Conectar Stripe",
    proRequired: "Se requiere Pro",
    upgradeToProToConnectStripe: "Mejora a Pro para conectar Stripe",
    connectStripeAccountToReceivePayments: "Conecta tu cuenta de Stripe para recibir pagos de inversiones",
    upgradeToProToReceivePayments: "Mejora a Pro para conectar Stripe y recibir pagos",
    subscriptionAndProFeatures: "Suscripción y funciones Pro",
    proMember: "Miembro Pro",
    artistPro: "Artista Pro",
    labelPro: "Sello Pro",
    nextBilling: "Próxima facturación",
    freePlan: "Plan gratuito",
    upgradeToProForPremiumFeatures: "Mejora a Pro para funciones premium",
    free: "Gratis",
    availablePlans: "Planes disponibles",
    features: "Funciones",
    processing: "Procesando...",
    upgradeToPro: "Mejorar a Pro",
    
    // Error Messages for Settings
    invalidFileType: "Tipo de archivo no válido",
    pleaseSelectImageFile: "Por favor selecciona un archivo de imagen.",
    fileTooLarge: "Archivo demasiado grande",
    pleaseSelectImageSmallerThan5MB: "Selecciona una imagen menor a 5MB.",
    invalidName: "Nombre no válido",
    pleaseEnterValidDisplayName: "Ingresa un nombre para mostrar válido.",
    updateFailed: "Actualización fallida",
    failedToUpdateProfile: "No se pudo actualizar el perfil. Inténtalo de nuevo.",
    settingUpdated: "Configuración actualizada",
    preferenceUpdatedSuccessfully: "Tu preferencia se ha actualizado correctamente.",
    failedToUpdateSetting: "No se pudo actualizar la configuración. Inténtalo de nuevo.",
    languageUpdated: "Idioma actualizado",
    languagePreferenceUpdatedSuccessfully: "Tu preferencia de idioma se ha actualizado correctamente.",
    failedToUpdateLanguage: "No se pudo actualizar el idioma. Inténtalo de nuevo.",
    missingCurrentPassword: "Falta la contraseña actual",
    pleaseEnterCurrentPassword: "Ingresa tu contraseña actual.",
    missingNewPassword: "Falta la nueva contraseña",
    pleaseEnterNewPassword: "Ingresa una nueva contraseña.",
    passwordMismatch: "Las contraseñas no coinciden",
    newPasswordAndConfirmPasswordDoNotMatch: "La nueva contraseña y la confirmación no coinciden.",
    weakPassword: "Contraseña débil",
    passwordMustBeAtLeast6Characters: "La contraseña debe tener al menos 6 caracteres.",
    passwordChanged: "Contraseña cambiada",
    passwordUpdatedSuccessfully: "Tu contraseña se ha actualizado correctamente.",
    passwordChangeFailed: "Error al cambiar la contraseña",
    failedToChangePassword: "No se pudo cambiar la contraseña. Inténtalo de nuevo.",
    spotifyConnected: "Spotify conectado",
    spotifyConnectionSuccess: "Cuenta de Spotify conectada correctamente.",
    spotifyConnectionFailed: "Error de conexión con Spotify",
    failedToConnectSpotify: "No se pudo conectar Spotify. Inténtalo de nuevo.",
    stripeConnectionFailed: "Error de conexión con Stripe",
    failedToConnectStripe: "No se pudo conectar Stripe. Inténtalo de nuevo.",
    loadingSubscriptionDetails: "Cargando detalles de la suscripción...",
    
    // Additional keys used in settings
    signOut: "Cerrar sesión",
    deleteAccount: "Eliminar cuenta",
    deleteAccountWarning: "Esta acción no se puede deshacer y eliminará tu cuenta permanentemente.",
    currentPassword: "Contraseña actual",
    enterCurrentPassword: "Ingresa tu contraseña actual",
    newPassword: "Nueva contraseña",
    enterNewPassword: "Ingresa una nueva contraseña",
    confirmNewPassword: "Confirmar nueva contraseña",
    confirmNewPasswordPlaceholder: "Confirma tu nueva contraseña",
    changing: "Cambiando...",
    changePasswordButton: "Cambiar contraseña",
    connectSpotify: "Conectar Spotify",
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
  },
  
  pt: {
    // Navigation
    home: "Início",
    search: "Pesquisar",
    analytics: "Analytics",
    portfolio: "Portfólio",
    settings: "Configurações",
    create: "Criar",
    
    // Authentication
    login: "Entrar",
    register: "Registrar",
    logout: "Sair",
    email: "Email",
    password: "Senha",
    username: "Nome de usuário",
    
    // Common actions
    invest: "Investir",
    message: "Mensagem",
    follow: "Seguir",
    share: "Compartilhar",
    save: "Salvar",
    cancel: "Cancelar",
    continue: "Continuar",
    back: "Voltar",
    
    // Investment
    investNow: "Investir Agora",
    expectedReturn: "Retorno Esperado",
    monthlyListeners: "Ouvintes Mensais",
    fundingGoal: "Meta de Financiamento",
    currentFunding: "Financiamento Atual",
    riskLevel: "Nível de Risco",
    
    // User roles
    fan: "Fã",
    artist: "Artista",
    investor: "Investidor",
    label: "Gravadora",
    
    // Dashboard
    totalInvested: "Total Investido",
    currentValue: "Valor Atual",
    totalReturn: "Retorno Total",
    activeInvestments: "Investimentos Ativos",
    
    // Search
    searchPlaceholder: "Pesquisar artistas, músicas, gêneros...",
    risingArtists: "Artistas em Ascensão",
    topResults: "Melhores Resultados",
    
    // Profile
    profile: "Perfil",
    editProfile: "Editar Perfil",
    uploadPhoto: "Enviar Foto",
    description: "Descrição",
    
    // Settings
    language: "Idioma",
    notifications: "Notificações",
    privacy: "Privacidade",
    account: "Conta",
    appPreferences: "Preferências do App",
    darkMode: "Modo Escuro",
    audioPreview: "Prévia de Áudio",
    accountActions: "Ações da Conta",
    changePassword: "Alterar Senha",
    downloadMyData: "Baixar Meus Dados",
    
    // Messages
    welcomeBack: "Bem-vindo de volta",
    investmentSuccessful: "Investimento bem-sucedido",
    profileUpdated: "Perfil atualizado",
    
    // Streaming platforms
    spotify: "Spotify",
    youtube: "YouTube",
    apple: "Apple Music",
    deezer: "Deezer",
    soundcloud: "SoundCloud",
    
    // Settings Page Specific Translations
    manageAccountPreferences: "Gerencie sua conta e preferências",
    accountInformation: "Informações da Conta",
    displayName: "Nome de Exibição",
    emailCannotBeChanged: "O e-mail não pode ser alterado",
    profilePicture: "Foto de Perfil",
    selectImageFile: "Selecione um arquivo de imagem (máx. 5MB)",
    updating: "Atualizando...",
    updateProfile: "Atualizar Perfil",
    emailNotifications: "Notificações por Email",
    investmentUpdatesAndNews: "Atualizações de investimento e notícias",
    pushNotifications: "Notificações Push",
    realTimeAlertsOnDevice: "Alertas em tempo real no seu dispositivo",
    fundingAlerts: "Alertas de Financiamento",
    whenCampaignsReachMilestones: "Quando as campanhas atingirem marcos",
    publicProfile: "Perfil Público",
    allowOthersToDiscoverProfile: "Permitir que outros descubram seu perfil",
    investmentActivity: "Atividade de Investimento",
    showInvestmentsPublicly: "Mostrar seus investimentos publicamente",
    directMessages: "Mensagens Diretas",
    allowArtistsAndLabelsToContact: "Permitir que artistas e gravadoras entrem em contato",
    darkModeDescription: "Usar tema escuro agradável aos olhos",
    audioPreviewDescription: "Habilitar reprodução automática de música",
    languageDescription: "Escolha o idioma de exibição do app",
    connectYourAccounts: "Conecte suas Contas",
    connectStripeAccount: "Conectar Conta Stripe",
    connecting: "Conectando...",
    stripeConnected: "Stripe Conectado",
    connectStripe: "Conectar Stripe",
    proRequired: "Pro Necessário",
    upgradeToProToConnectStripe: "Atualize para Pro para conectar o Stripe",
    connectStripeAccountToReceivePayments: "Conecte sua conta Stripe para receber pagamentos de investimentos",
    upgradeToProToReceivePayments: "Atualize para Pro para conectar o Stripe e receber pagamentos",
    subscriptionAndProFeatures: "Assinatura e Recursos Pro",
    proMember: "Membro Pro",
    artistPro: "Artista Pro",
    labelPro: "Gravadora Pro",
    nextBilling: "Próxima cobrança",
    freePlan: "Plano Gratuito",
    upgradeToProForPremiumFeatures: "Atualize para Pro para recursos premium",
    free: "Grátis",
    availablePlans: "Planos Disponíveis",
    features: "Recursos",
    processing: "Processando...",
    upgradeToPro: "Atualizar para Pro",
    
    // Error Messages for Settings
    invalidFileType: "Tipo de arquivo inválido",
    pleaseSelectImageFile: "Selecione um arquivo de imagem.",
    fileTooLarge: "Arquivo muito grande",
    pleaseSelectImageSmallerThan5MB: "Selecione uma imagem menor que 5MB.",
    invalidName: "Nome inválido",
    pleaseEnterValidDisplayName: "Insira um nome de exibição válido.",
    updateFailed: "Falha na atualização",
    failedToUpdateProfile: "Não foi possível atualizar o perfil. Tente novamente.",
    settingUpdated: "Configuração atualizada",
    preferenceUpdatedSuccessfully: "Sua preferência foi atualizada com sucesso.",
    failedToUpdateSetting: "Não foi possível atualizar a configuração. Tente novamente.",
    languageUpdated: "Idioma atualizado",
    languagePreferenceUpdatedSuccessfully: "Sua preferência de idioma foi atualizada com sucesso.",
    failedToUpdateLanguage: "Não foi possível atualizar o idioma. Tente novamente.",
    missingCurrentPassword: "Senha atual ausente",
    pleaseEnterCurrentPassword: "Insira sua senha atual.",
    missingNewPassword: "Nova senha ausente",
    pleaseEnterNewPassword: "Insira uma nova senha.",
    passwordMismatch: "As senhas não coincidem",
    newPasswordAndConfirmPasswordDoNotMatch: "A nova senha e a confirmação não coincidem.",
    weakPassword: "Senha fraca",
    passwordMustBeAtLeast6Characters: "A senha deve ter pelo menos 6 caracteres.",
    passwordChanged: "Senha alterada",
    passwordUpdatedSuccessfully: "Sua senha foi atualizada com sucesso.",
    passwordChangeFailed: "Falha ao alterar a senha",
    failedToChangePassword: "Não foi possível alterar a senha. Tente novamente.",
    spotifyConnected: "Spotify conectado",
    spotifyConnectionSuccess: "Conta do Spotify conectada com sucesso.",
    spotifyConnectionFailed: "Falha na conexão com o Spotify",
    failedToConnectSpotify: "Não foi possível conectar o Spotify. Tente novamente.",
    stripeConnectionFailed: "Falha na conexão com o Stripe",
    failedToConnectStripe: "Não foi possível conectar o Stripe. Tente novamente.",
    loadingSubscriptionDetails: "Carregando detalhes da assinatura...",
    
    // Additional keys used in settings
    signOut: "Sair",
    deleteAccount: "Excluir Conta",
    deleteAccountWarning: "Esta ação não pode ser desfeita e excluirá sua conta permanentemente.",
    currentPassword: "Senha Atual",
    enterCurrentPassword: "Insira sua senha atual",
    newPassword: "Nova Senha",
    enterNewPassword: "Insira uma nova senha",
    confirmNewPassword: "Confirmar Nova Senha",
    confirmNewPasswordPlaceholder: "Confirme sua nova senha",
    changing: "Alterando...",
    changePasswordButton: "Alterar Senha",
    connectSpotify: "Conectar Spotify",
  },
  
  it: {
    // Navigation
    home: "Home",
    search: "Cerca",
    analytics: "Analytics",
    portfolio: "Portfolio",
    settings: "Impostazioni",
    create: "Crea",
    
    // Authentication
    login: "Accedi",
    register: "Registrati",
    logout: "Esci",
    email: "Email",
    password: "Password",
    username: "Nome utente",
    
    // Common actions
    invest: "Investi",
    message: "Messaggio",
    follow: "Segui",
    share: "Condividi",
    save: "Salva",
    cancel: "Annulla",
    continue: "Continua",
    back: "Indietro",
    
    // Investment
    investNow: "Investi Ora",
    expectedReturn: "Ritorno Atteso",
    monthlyListeners: "Ascoltatori Mensili",
    fundingGoal: "Obiettivo di Finanziamento",
    currentFunding: "Finanziamento Attuale",
    riskLevel: "Livello di Rischio",
    
    // User roles
    fan: "Fan",
    artist: "Artista",
    investor: "Investitore",
    label: "Etichetta",
    
    // Dashboard
    totalInvested: "Totale Investito",
    currentValue: "Valore Attuale",
    totalReturn: "Ritorno Totale",
    activeInvestments: "Investimenti Attivi",
    
    // Search
    searchPlaceholder: "Cerca artisti, canzoni, generi...",
    risingArtists: "Artisti Emergenti",
    topResults: "Migliori Risultati",
    
    // Profile
    profile: "Profilo",
    editProfile: "Modifica Profilo",
    uploadPhoto: "Carica Foto",
    description: "Descrizione",
    
    // Settings
    language: "Lingua",
    notifications: "Notifiche",
    privacy: "Privacy",
    account: "Account",
    appPreferences: "Preferenze dell'App",
    darkMode: "Tema Scuro",
    audioPreview: "Anteprima Audio",
    accountActions: "Azioni dell'Account",
    changePassword: "Cambia Password",
    downloadMyData: "Scarica i Miei Dati",
    
    // Messages
    welcomeBack: "Bentornato",
    investmentSuccessful: "Investimento riuscito",
    profileUpdated: "Profilo aggiornato",
    
    // Streaming platforms
    spotify: "Spotify",
    youtube: "YouTube",
    apple: "Apple Music",
    deezer: "Deezer",
    soundcloud: "SoundCloud",
    
    // Settings Page Specific Translations
    manageAccountPreferences: "Gestisci il tuo account e le preferenze",
    accountInformation: "Informazioni Account",
    displayName: "Nome Visualizzato",
    emailCannotBeChanged: "L'email non può essere modificata",
    profilePicture: "Immagine del Profilo",
    selectImageFile: "Seleziona un file immagine (max 5MB)",
    updating: "Aggiornamento...",
    updateProfile: "Aggiorna Profilo",
    emailNotifications: "Notifiche Email",
    investmentUpdatesAndNews: "Aggiornamenti sugli investimenti e notizie",
    pushNotifications: "Notifiche Push",
    realTimeAlertsOnDevice: "Avvisi in tempo reale sul tuo dispositivo",
    fundingAlerts: "Avvisi di Finanziamento",
    whenCampaignsReachMilestones: "Quando le campagne raggiungono traguardi",
    publicProfile: "Profilo Pubblico",
    allowOthersToDiscoverProfile: "Consenti agli altri di scoprire il tuo profilo",
    investmentActivity: "Attività di Investimento",
    showInvestmentsPublicly: "Mostra pubblicamente i tuoi investimenti",
    directMessages: "Messaggi Diretti",
    allowArtistsAndLabelsToContact: "Consenti ad artisti ed etichette di contattarti",
    darkModeDescription: "Usa il tema scuro più riposante per gli occhi",
    audioPreviewDescription: "Abilita la riproduzione automatica della musica",
    languageDescription: "Scegli la lingua dell'app",
    connectYourAccounts: "Collega i Tuoi Account",
    connectStripeAccount: "Collega Account Stripe",
    connecting: "Connessione...",
    stripeConnected: "Stripe Collegato",
    connectStripe: "Collega Stripe",
    proRequired: "Pro Richiesto",
    upgradeToProToConnectStripe: "Aggiorna a Pro per collegare Stripe",
    connectStripeAccountToReceivePayments: "Collega il tuo account Stripe per ricevere i pagamenti dagli investimenti",
    upgradeToProToReceivePayments: "Aggiorna a Pro per collegare Stripe e ricevere pagamenti",
    subscriptionAndProFeatures: "Abbonamento e Funzionalità Pro",
    proMember: "Membro Pro",
    artistPro: "Artista Pro",
    labelPro: "Etichetta Pro",
    nextBilling: "Prossima fatturazione",
    freePlan: "Piano Gratuito",
    upgradeToProForPremiumFeatures: "Aggiorna a Pro per funzionalità premium",
    free: "Gratis",
    availablePlans: "Piani Disponibili",
    features: "Funzionalità",
    processing: "Elaborazione...",
    upgradeToPro: "Aggiorna a Pro",
    
    // Error Messages for Settings
    invalidFileType: "Tipo di file non valido",
    pleaseSelectImageFile: "Seleziona un file immagine.",
    fileTooLarge: "File troppo grande",
    pleaseSelectImageSmallerThan5MB: "Seleziona un'immagine inferiore a 5MB.",
    invalidName: "Nome non valido",
    pleaseEnterValidDisplayName: "Inserisci un nome visualizzato valido.",
    updateFailed: "Aggiornamento non riuscito",
    failedToUpdateProfile: "Impossibile aggiornare il profilo. Riprova.",
    settingUpdated: "Impostazione aggiornata",
    preferenceUpdatedSuccessfully: "La tua preferenza è stata aggiornata correttamente.",
    failedToUpdateSetting: "Impossibile aggiornare l'impostazione. Riprova.",
    languageUpdated: "Lingua aggiornata",
    languagePreferenceUpdatedSuccessfully: "La preferenza della lingua è stata aggiornata correttamente.",
    failedToUpdateLanguage: "Impossibile aggiornare la lingua. Riprova.",
    missingCurrentPassword: "Password attuale mancante",
    pleaseEnterCurrentPassword: "Inserisci la password attuale.",
    missingNewPassword: "Nuova password mancante",
    pleaseEnterNewPassword: "Inserisci una nuova password.",
    passwordMismatch: "Le password non corrispondono",
    newPasswordAndConfirmPasswordDoNotMatch: "La nuova password e la conferma non corrispondono.",
    weakPassword: "Password debole",
    passwordMustBeAtLeast6Characters: "La password deve contenere almeno 6 caratteri.",
    passwordChanged: "Password cambiata",
    passwordUpdatedSuccessfully: "La password è stata aggiornata correttamente.",
    passwordChangeFailed: "Cambio password non riuscito",
    failedToChangePassword: "Impossibile cambiare la password. Riprova.",
    spotifyConnected: "Spotify collegato",
    spotifyConnectionSuccess: "Account Spotify collegato correttamente.",
    spotifyConnectionFailed: "Connessione a Spotify non riuscita",
    failedToConnectSpotify: "Impossibile collegare Spotify. Riprova.",
    stripeConnectionFailed: "Connessione a Stripe non riuscita",
    failedToConnectStripe: "Impossibile collegare Stripe. Riprova.",
    loadingSubscriptionDetails: "Caricamento dei dettagli dell'abbonamento...",
    
    // Additional keys used in settings
    signOut: "Disconnetti",
    deleteAccount: "Elimina Account",
    deleteAccountWarning: "Questa azione è irreversibile e eliminerà definitivamente il tuo account.",
    currentPassword: "Password Attuale",
    enterCurrentPassword: "Inserisci la password attuale",
    newPassword: "Nuova Password",
    enterNewPassword: "Inserisci una nuova password",
    confirmNewPassword: "Conferma Nuova Password",
    confirmNewPasswordPlaceholder: "Conferma la tua nuova password",
    changing: "Modifica in corso...",
    changePasswordButton: "Cambia Password",
    connectSpotify: "Collega Spotify",
  },
  
  ja: {
    // Navigation
    home: "ホーム",
    search: "検索",
    analytics: "アナリティクス",
    portfolio: "ポートフォリオ",
    settings: "設定",
    create: "作成",
    
    // Authentication
    login: "ログイン",
    register: "登録",
    logout: "ログアウト",
    email: "メール",
    password: "パスワード",
    username: "ユーザー名",
    
    // Common actions
    invest: "投資",
    message: "メッセージ",
    follow: "フォロー",
    share: "共有",
    save: "保存",
    cancel: "キャンセル",
    continue: "続行",
    back: "戻る",
    
    // Investment
    investNow: "今すぐ投資",
    expectedReturn: "期待リターン",
    monthlyListeners: "月間リスナー",
    fundingGoal: "資金調達目標",
    currentFunding: "現在の資金調達",
    riskLevel: "リスクレベル",
    
    // User roles
    fan: "ファン",
    artist: "アーティスト",
    investor: "投資家",
    label: "レーベル",
    
    // Dashboard
    totalInvested: "総投資額",
    currentValue: "現在価値",
    totalReturn: "総リターン",
    activeInvestments: "アクティブ投資",
    
    // Search
    searchPlaceholder: "アーティスト、楽曲、ジャンルを検索...",
    risingArtists: "急上昇アーティスト",
    topResults: "トップ結果",
    
    // Profile
    profile: "プロフィール",
    editProfile: "プロフィール編集",
    uploadPhoto: "写真アップロード",
    description: "説明",
    
    // Settings
    language: "言語",
    notifications: "通知",
    privacy: "プライバシー",
    account: "アカウント",
    
    // Messages
    welcomeBack: "おかえりなさい",
    investmentSuccessful: "投資成功",
    profileUpdated: "プロフィール更新済み",
    
    // Streaming platforms
    spotify: "Spotify",
    youtube: "YouTube",
    apple: "Apple Music",
    deezer: "Deezer",
    soundcloud: "SoundCloud",
    
    // Settings Page Specific Translations
    manageAccountPreferences: "アカウントと設定を管理",
    accountInformation: "アカウント情報",
    displayName: "表示名",
    emailCannotBeChanged: "メールアドレスは変更できません",
    profilePicture: "プロフィール画像",
    selectImageFile: "画像ファイルを選択（最大5MB）",
    updating: "更新中...",
    updateProfile: "プロフィール更新",
    emailNotifications: "メール通知",
    investmentUpdatesAndNews: "投資の更新とニュース",
    pushNotifications: "プッシュ通知",
    realTimeAlertsOnDevice: "デバイスでのリアルタイムアラート",
    fundingAlerts: "資金調達アラート",
    whenCampaignsReachMilestones: "キャンペーンがマイルストーンに到達したとき",
    publicProfile: "公開プロフィール",
    allowOthersToDiscoverProfile: "他の人があなたのプロフィールを発見できるようにする",
    investmentActivity: "投資活動",
    showInvestmentsPublicly: "投資を公開表示する",
    directMessages: "ダイレクトメッセージ",
    allowArtistsAndLabelsToContact: "アーティストやレーベルが連絡できるようにする",
    appPreferences: "アプリ設定",
    darkMode: "ダークモード",
    darkModeDescription: "目に優しいダークテーマを使用",
    audioPreview: "オーディオプレビュー",
    audioPreviewDescription: "音楽の自動再生を有効にする",
    languageDescription: "アプリの表示言語を選択",
    connectYourAccounts: "アカウントを接続",
    connectSpotify: "Spotifyに接続",
    stripe: "Stripe",
    connectStripe: "Stripeに接続",
    accountActions: "アカウント操作",
    changePassword: "パスワード変更",
    signOut: "サインアウト",
    deleteAccount: "アカウント削除",
    deleteAccountWarning: "この操作は元に戻せず、アカウントが永続的に削除されます。",
    currentPassword: "現在のパスワード",
    enterCurrentPassword: "現在のパスワードを入力",
    newPassword: "新しいパスワード",
    enterNewPassword: "新しいパスワードを入力",
    confirmNewPassword: "新しいパスワードを確認",
    confirmNewPasswordPlaceholder: "新しいパスワードを確認",
    changing: "変更中...",
    changePasswordButton: "パスワード変更",
    
    // Error Messages for Settings
    invalidFileType: "無効なファイルタイプ",
    pleaseSelectImageFile: "画像ファイルを選択してください。",
    fileTooLarge: "ファイルが大きすぎます",
    pleaseSelectImageSmallerThan5MB: "5MBより小さい画像を選択してください。",
    invalidName: "無効な名前",
    pleaseEnterValidDisplayName: "有効な表示名を入力してください。",
    profileUpdatedSuccessfully: "プロフィールが正常に更新されました。",
    updateFailed: "更新に失敗しました",
    failedToUpdateProfile: "プロフィールの更新に失敗しました。もう一度お試しください。",
    settingUpdated: "設定が更新されました",
    preferenceUpdatedSuccessfully: "設定が正常に更新されました。",
    failedToUpdateSetting: "設定の更新に失敗しました。もう一度お試しください。",
    languageUpdated: "言語が更新されました",
    languagePreferenceUpdatedSuccessfully: "言語設定が正常に更新されました。",
    failedToUpdateLanguage: "言語の更新に失敗しました。もう一度お試しください。",
    missingCurrentPassword: "現在のパスワードが不足しています",
    pleaseEnterCurrentPassword: "現在のパスワードを入力してください。",
    missingNewPassword: "新しいパスワードが不足しています",
    pleaseEnterNewPassword: "新しいパスワードを入力してください。",
    passwordMismatch: "パスワードが一致しません",
    newPasswordAndConfirmPasswordDoNotMatch: "新しいパスワードと確認パスワードが一致しません。",
    weakPassword: "弱いパスワード",
    passwordMustBeAtLeast6Characters: "パスワードは6文字以上である必要があります。",
    passwordChanged: "パスワードが変更されました",
    passwordUpdatedSuccessfully: "パスワードが正常に更新されました。",
    passwordChangeFailed: "パスワード変更に失敗しました",
    failedToChangePassword: "パスワードの変更に失敗しました。もう一度お試しください。",
    spotifyConnected: "Spotifyに接続されました",
    spotifyConnectionSuccess: "Spotifyアカウントが正常に接続されました。",
    spotifyConnectionFailed: "Spotify接続に失敗しました",
    failedToConnectSpotify: "Spotifyの接続に失敗しました。もう一度お試しください。",
    stripeConnected: "Stripeに接続されました",
    stripeConnectionSuccess: "Stripeアカウントが正常に接続されました。",
    stripeConnectionFailed: "Stripe接続に失敗しました",
    failedToConnectStripe: "Stripeの接続に失敗しました。もう一度お試しください。",
    loadingSubscriptionDetails: "サブスクリプション詳細を読み込み中...",
    
    // Connect Accounts Section
    connectYourAccounts: "アカウントを接続",
    connectStripeAccount: "Stripeアカウントを接続",
    connecting: "接続中...",
    stripeConnected: "Stripe接続済み",
    connectStripe: "Stripeに接続",
    proRequired: "Proが必要",
    upgradeToProToConnectStripe: "Stripeに接続するにはProにアップグレード",
    connectStripeAccountToReceivePayments: "投資からの支払いを受け取るためにStripeアカウントを接続",
    upgradeToProToReceivePayments: "支払いを受け取るためにProにアップグレード",
    
    // Subscription & Pro Features
    subscriptionAndProFeatures: "サブスクリプションとPro機能",
    proMember: "Proメンバー",
    artistPro: "アーティストPro",
    labelPro: "レーベルPro",
    nextBilling: "次回請求日",
    active: "アクティブ",
    inactive: "非アクティブ",
    cancelled: "キャンセル済み",
    pastDue: "支払い遅延",
    trialing: "トライアル中",
    
    // Social Media Platform Names
    youtube: "YouTube",
    deezer: "Deezer",
    appleMusic: "Apple Music",
    soundcloud: "SoundCloud",
    
    // Subscription Status
    freePlan: "無料プラン",
    upgradeToProForPremiumFeatures: "プレミアム機能のためにProにアップグレード",
    free: "無料",
    availablePlans: "利用可能なプラン",
    features: "機能",
    processing: "処理中...",
    upgradeToPro: "Proにアップグレード",
  },
  
  zh: {
    // Navigation
    home: "首页",
    search: "搜索",
    analytics: "分析",
    portfolio: "投资组合",
    settings: "设置",
    create: "创建",
    
    // Authentication
    login: "登录",
    register: "注册",
    logout: "登出",
    email: "邮箱",
    password: "密码",
    username: "用户名",
    
    // Common actions
    invest: "投资",
    message: "消息",
    follow: "关注",
    share: "分享",
    save: "保存",
    cancel: "取消",
    continue: "继续",
    back: "返回",
    
    // Investment
    investNow: "立即投资",
    expectedReturn: "预期回报",
    monthlyListeners: "月听众数",
    fundingGoal: "融资目标",
    currentFunding: "当前融资",
    riskLevel: "风险等级",
    
    // User roles
    fan: "粉丝",
    artist: "艺术家",
    investor: "投资者",
    label: "厂牌",
    
    // Dashboard
    totalInvested: "总投资",
    currentValue: "当前价值",
    totalReturn: "总回报",
    activeInvestments: "活跃投资",
    
    // Search
    searchPlaceholder: "搜索艺术家、歌曲、类型...",
    risingArtists: "新兴艺术家",
    topResults: "热门结果",
    
    // Profile
    profile: "个人资料",
    editProfile: "编辑资料",
    uploadPhoto: "上传照片",
    description: "描述",
    
    // Settings
    language: "语言",
    notifications: "通知",
    privacy: "隐私",
    account: "账户",
    appPreferences: "应用偏好",
    darkMode: "深色模式",
    audioPreview: "音频预览",
    accountActions: "账户操作",
    changePassword: "更改密码",
    downloadMyData: "下载我的数据",
    
    // Messages
    welcomeBack: "欢迎回来",
    investmentSuccessful: "投资成功",
    profileUpdated: "资料已更新",
    
    // Streaming platforms
    spotify: "Spotify",
    youtube: "YouTube",
    apple: "Apple Music",
    deezer: "Deezer",
    soundcloud: "SoundCloud",
    
    // Settings Page Specific Translations
    manageAccountPreferences: "管理你的账户和偏好",
    accountInformation: "账户信息",
    displayName: "显示名称",
    emailCannotBeChanged: "邮箱不可更改",
    profilePicture: "头像",
    selectImageFile: "选择图片文件（最大5MB）",
    updating: "更新中...",
    updateProfile: "更新资料",
    emailNotifications: "邮件通知",
    investmentUpdatesAndNews: "投资更新与新闻",
    pushNotifications: "推送通知",
    realTimeAlertsOnDevice: "在设备上接收实时提醒",
    fundingAlerts: "融资提醒",
    whenCampaignsReachMilestones: "当活动达到里程碑时",
    publicProfile: "公开资料",
    allowOthersToDiscoverProfile: "允许他人发现你的资料",
    investmentActivity: "投资活动",
    showInvestmentsPublicly: "公开显示你的投资",
    directMessages: "私信",
    allowArtistsAndLabelsToContact: "允许艺人和厂牌联系你",
    darkModeDescription: "使用护眼的深色主题",
    audioPreviewDescription: "启用音乐自动播放",
    languageDescription: "选择应用显示语言",
    connectYourAccounts: "连接你的账户",
    connectStripeAccount: "连接 Stripe 账户",
    connecting: "连接中...",
    stripeConnected: "Stripe 已连接",
    connectStripe: "连接 Stripe",
    proRequired: "需要 Pro",
    upgradeToProToConnectStripe: "升级到 Pro 以连接 Stripe",
    connectStripeAccountToReceivePayments: "连接你的 Stripe 账户以接收投资付款",
    upgradeToProToReceivePayments: "升级到 Pro 以连接 Stripe 并接收付款",
    subscriptionAndProFeatures: "订阅与 Pro 功能",
    proMember: "Pro 会员",
    artistPro: "艺术家 Pro",
    labelPro: "厂牌 Pro",
    nextBilling: "下次扣费",
    freePlan: "免费计划",
    upgradeToProForPremiumFeatures: "升级到 Pro 获取高级功能",
    free: "免费",
    availablePlans: "可用方案",
    features: "功能",
    processing: "处理中...",
    upgradeToPro: "升级到 Pro",
    
    // Error Messages for Settings
    invalidFileType: "文件类型无效",
    pleaseSelectImageFile: "请选择图片文件。",
    fileTooLarge: "文件过大",
    pleaseSelectImageSmallerThan5MB: "请选择小于 5MB 的图片。",
    invalidName: "名称无效",
    pleaseEnterValidDisplayName: "请输入有效的显示名称。",
    updateFailed: "更新失败",
    failedToUpdateProfile: "更新资料失败，请重试。",
    settingUpdated: "设置已更新",
    preferenceUpdatedSuccessfully: "你的偏好已成功更新。",
    failedToUpdateSetting: "更新设置失败，请重试。",
    languageUpdated: "语言已更新",
    languagePreferenceUpdatedSuccessfully: "语言偏好设置已成功更新。",
    failedToUpdateLanguage: "语言更新失败，请重试。",
    missingCurrentPassword: "缺少当前密码",
    pleaseEnterCurrentPassword: "请输入当前密码。",
    missingNewPassword: "缺少新密码",
    pleaseEnterNewPassword: "请输入新密码。",
    passwordMismatch: "两次密码不一致",
    newPasswordAndConfirmPasswordDoNotMatch: "新密码与确认密码不一致。",
    weakPassword: "密码强度较弱",
    passwordMustBeAtLeast6Characters: "密码长度至少为 6 位。",
    passwordChanged: "密码已更改",
    passwordUpdatedSuccessfully: "你的密码已成功更新。",
    passwordChangeFailed: "更改密码失败",
    failedToChangePassword: "无法更改密码，请重试。",
    spotifyConnected: "Spotify 已连接",
    spotifyConnectionSuccess: "Spotify 账户连接成功。",
    spotifyConnectionFailed: "Spotify 连接失败",
    failedToConnectSpotify: "无法连接 Spotify，请重试。",
    stripeConnectionFailed: "Stripe 连接失败",
    failedToConnectStripe: "无法连接 Stripe，请重试。",
    loadingSubscriptionDetails: "正在加载订阅详情...",
    
    // Additional keys used in settings
    signOut: "退出登录",
    deleteAccount: "删除账户",
    deleteAccountWarning: "此操作不可撤销，将永久删除你的账户。",
    currentPassword: "当前密码",
    enterCurrentPassword: "请输入当前密码",
    newPassword: "新密码",
    enterNewPassword: "请输入新密码",
    confirmNewPassword: "确认新密码",
    confirmNewPasswordPlaceholder: "请确认你的新密码",
    changing: "正在更改...",
    changePasswordButton: "更改密码",
    connectSpotify: "连接 Spotify",
  },
  
  ko: {
    // Navigation
    home: "홈",
    search: "검색",
    analytics: "분석",
    portfolio: "포트폴리오",
    settings: "설정",
    create: "생성",
    
    // Authentication
    login: "로그인",
    register: "등록",
    logout: "로그아웃",
    email: "이메일",
    password: "비밀번호",
    username: "사용자명",
    
    // Common actions
    invest: "투자",
    message: "메시지",
    follow: "팔로우",
    share: "공유",
    save: "저장",
    cancel: "취소",
    continue: "계속",
    back: "뒤로",
    
    // Investment
    investNow: "지금 투자",
    expectedReturn: "예상 수익",
    monthlyListeners: "월간 청취자",
    fundingGoal: "펀딩 목표",
    currentFunding: "현재 펀딩",
    riskLevel: "위험 수준",
    
    // User roles
    fan: "팬",
    artist: "아티스트",
    investor: "투자자",
    label: "레이블",
    
    // Dashboard
    totalInvested: "총 투자",
    currentValue: "현재 가치",
    totalReturn: "총 수익",
    activeInvestments: "활성 투자",
    
    // Search
    searchPlaceholder: "아티스트, 곡, 장르 검색...",
    risingArtists: "상승 아티스트",
    topResults: "인기 결과",
    
    // Profile
    profile: "프로필",
    editProfile: "프로필 편집",
    uploadPhoto: "사진 업로드",
    description: "설명",
    
    // Settings
    language: "언어",
    notifications: "알림",
    privacy: "개인정보",
    account: "계정",
    appPreferences: "앱 환경설정",
    darkMode: "다크 모드",
    audioPreview: "오디오 미리듣기",
    accountActions: "계정 작업",
    changePassword: "비밀번호 변경",
    downloadMyData: "내 데이터 다운로드",
    
    // Messages
    welcomeBack: "다시 오신 것을 환영합니다",
    investmentSuccessful: "투자 성공",
    profileUpdated: "프로필 업데이트됨",
    
    // Streaming platforms
    spotify: "Spotify",
    youtube: "YouTube",
    apple: "Apple Music",
    deezer: "Deezer",
    soundcloud: "SoundCloud",
    
    // Settings Page Specific Translations
    manageAccountPreferences: "계정 및 환경설정을 관리하세요",
    accountInformation: "계정 정보",
    displayName: "표시 이름",
    emailCannotBeChanged: "이메일은 변경할 수 없습니다",
    profilePicture: "프로필 사진",
    selectImageFile: "이미지 파일 선택 (최대 5MB)",
    updating: "업데이트 중...",
    updateProfile: "프로필 업데이트",
    emailNotifications: "이메일 알림",
    investmentUpdatesAndNews: "투자 업데이트 및 소식",
    pushNotifications: "푸시 알림",
    realTimeAlertsOnDevice: "기기에서 실시간 알림 받기",
    fundingAlerts: "펀딩 알림",
    whenCampaignsReachMilestones: "캠페인이 마일스톤에 도달했을 때",
    publicProfile: "공개 프로필",
    allowOthersToDiscoverProfile: "다른 사용자가 내 프로필을 찾을 수 있도록 허용",
    investmentActivity: "투자 활동",
    showInvestmentsPublicly: "내 투자를 공개적으로 표시",
    directMessages: "개인 메시지",
    allowArtistsAndLabelsToContact: "아티스트와 레이블이 연락하도록 허용",
    darkModeDescription: "눈에 편한 다크 테마 사용",
    audioPreviewDescription: "음악 자동 재생 활성화",
    languageDescription: "앱 표시 언어를 선택하세요",
    connectYourAccounts: "계정 연결",
    connectStripeAccount: "Stripe 계정 연결",
    connecting: "연결 중...",
    stripeConnected: "Stripe 연결됨",
    connectStripe: "Stripe 연결",
    proRequired: "Pro 필요",
    upgradeToProToConnectStripe: "Stripe를 연결하려면 Pro로 업그레이드하세요",
    connectStripeAccountToReceivePayments: "투자 대금을 받으려면 Stripe 계정을 연결하세요",
    upgradeToProToReceivePayments: "Stripe 연결 및 결제 수신을 위해 Pro로 업그레이드",
    subscriptionAndProFeatures: "구독 및 Pro 기능",
    proMember: "Pro 멤버",
    artistPro: "아티스트 Pro",
    labelPro: "레이블 Pro",
    nextBilling: "다음 결제일",
    freePlan: "무료 플랜",
    upgradeToProForPremiumFeatures: "프리미엄 기능을 위해 Pro로 업그레이드",
    free: "무료",
    availablePlans: "이용 가능한 플랜",
    features: "기능",
    processing: "처리 중...",
    upgradeToPro: "Pro로 업그레이드",
    
    // Error Messages for Settings
    invalidFileType: "잘못된 파일 형식",
    pleaseSelectImageFile: "이미지 파일을 선택해주세요.",
    fileTooLarge: "파일이 너무 큽니다",
    pleaseSelectImageSmallerThan5MB: "5MB보다 작은 이미지를 선택해주세요.",
    invalidName: "잘못된 이름",
    pleaseEnterValidDisplayName: "유효한 표시 이름을 입력해주세요.",
    updateFailed: "업데이트 실패",
    failedToUpdateProfile: "프로필을 업데이트하지 못했습니다. 다시 시도해주세요.",
    settingUpdated: "설정이 업데이트되었습니다",
    preferenceUpdatedSuccessfully: "환경설정이 성공적으로 업데이트되었습니다.",
    failedToUpdateSetting: "설정을 업데이트하지 못했습니다. 다시 시도해주세요.",
    languageUpdated: "언어가 업데이트되었습니다",
    languagePreferenceUpdatedSuccessfully: "언어 설정이 성공적으로 업데이트되었습니다.",
    failedToUpdateLanguage: "언어를 업데이트하지 못했습니다. 다시 시도해주세요.",
    missingCurrentPassword: "현재 비밀번호가 필요합니다",
    pleaseEnterCurrentPassword: "현재 비밀번호를 입력해주세요.",
    missingNewPassword: "새 비밀번호가 필요합니다",
    pleaseEnterNewPassword: "새 비밀번호를 입력해주세요.",
    passwordMismatch: "비밀번호가 일치하지 않습니다",
    newPasswordAndConfirmPasswordDoNotMatch: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
    weakPassword: "취약한 비밀번호",
    passwordMustBeAtLeast6Characters: "비밀번호는 최소 6자 이상이어야 합니다.",
    passwordChanged: "비밀번호가 변경되었습니다",
    passwordUpdatedSuccessfully: "비밀번호가 성공적으로 업데이트되었습니다.",
    passwordChangeFailed: "비밀번호 변경 실패",
    failedToChangePassword: "비밀번호를 변경하지 못했습니다. 다시 시도해주세요.",
    spotifyConnected: "Spotify 연결됨",
    spotifyConnectionSuccess: "Spotify 계정이 성공적으로 연결되었습니다.",
    spotifyConnectionFailed: "Spotify 연결 실패",
    failedToConnectSpotify: "Spotify를 연결하지 못했습니다. 다시 시도해주세요.",
    stripeConnectionFailed: "Stripe 연결 실패",
    failedToConnectStripe: "Stripe를 연결하지 못했습니다. 다시 시도해주세요.",
    loadingSubscriptionDetails: "구독 세부 정보를 불러오는 중...",
    
    // Additional keys used in settings
    signOut: "로그아웃",
    deleteAccount: "계정 삭제",
    deleteAccountWarning: "이 작업은 되돌릴 수 없으며 계정이 영구적으로 삭제됩니다.",
    currentPassword: "현재 비밀번호",
    enterCurrentPassword: "현재 비밀번호를 입력하세요",
    newPassword: "새 비밀번호",
    enterNewPassword: "새 비밀번호를 입력하세요",
    confirmNewPassword: "새 비밀번호 확인",
    confirmNewPasswordPlaceholder: "새 비밀번호를 다시 입력하세요",
    changing: "변경 중...",
    changePasswordButton: "비밀번호 변경",
    connectSpotify: "Spotify 연결",
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
    // keep react-i18next in sync on startup
    try {
      i18next.changeLanguage(this.currentLanguage);
      localStorage.setItem('i18nextLng', this.currentLanguage);
    } catch {}
  }
  
  // Initialize language from user data
  initializeFromUser(userLanguage?: string): void {
    if (userLanguage && translations[userLanguage as Language]) {
      this.setLanguage(userLanguage as Language);
    }
  }
  
  setLanguage(language: Language): void {
    if (translations[language]) {
      this.currentLanguage = language;
      localStorage.setItem('spark-language', language);
      // keep react-i18next in sync whenever app language changes
      try {
        i18next.changeLanguage(language);
        localStorage.setItem('i18nextLng', language);
      } catch {}
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