import React, { createContext, useContext, useState, useEffect } from 'react';
import { i18n } from '@/lib/i18n';

type Language = 'en' | 'fr' | 'es' | 'pt' | 'it' | 'ja' | 'zh' | 'ko';

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
  },
  
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.search': 'Pesquisar',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Configurações',
    'nav.portfolio': 'Portfólio',
    'nav.create': 'Criar',
    
    // Settings
    'settings.title': 'Configurações',
    'settings.privacy': 'Privacidade e Segurança',
    'settings.public_profile': 'Perfil Público',
    'settings.public_profile_desc': 'Permitir que outros descubram seu perfil',
    'settings.investment_activity': 'Atividade de Investimento',
    'settings.investment_activity_desc': 'Mostrar seus investimentos publicamente',
    'settings.direct_messages': 'Mensagens Diretas',
    'settings.direct_messages_desc': 'Permitir que artistas e gravadoras entrem em contato',
    'settings.app_preferences': 'Preferências do App',
    'settings.dark_mode': 'Modo Escuro',
    'settings.dark_mode_desc': 'Usar tema escuro (recomendado)',
    'settings.audio_preview': 'Prévia de Áudio',
    'settings.audio_preview_desc': 'Reproduzir automaticamente amostras musicais',
    'settings.language': 'Idioma',
    'settings.language_desc': 'Escolha seu idioma preferido',
    
    // Investment
    'investment.title': 'Investimento',
    'investment.amount': 'Valor',
    'investment.payment_method': 'Método de Pagamento',
    'investment.credit_card': 'Cartão de Crédito/Débito',
    'investment.bank_transfer': 'Transferência Bancária',
    'investment.mobile_payment': 'Pagamento Móvel',
    'investment.jurisdiction': 'Jurisdição',
    'investment.invest_now': 'Investir Agora',
    'investment.payment_error': 'Erro de Pagamento',
    'investment.payment_failed': 'Falha no processamento do pagamento. Tente novamente.',
    
    // Search
    'search.trending_now': 'Tendências Agora',
    'search.popular_searches': 'Pesquisas Populares',
    'search.fan_search': 'Pesquisa de Fãs',
    'search.top': 'Top',
    'search.artists': 'Artistas',
    'search.songs': 'Músicas',
    'search.playlists': 'Playlists',
    'search.live': 'AO VIVO',
    
    // Common
    'common.loading': 'Carregando...',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.back': 'Voltar',
  },
  
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.search': 'Cerca',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Impostazioni',
    'nav.portfolio': 'Portfolio',
    'nav.create': 'Crea',
    
    // Settings
    'settings.title': 'Impostazioni',
    'settings.privacy': 'Privacy e Sicurezza',
    'settings.public_profile': 'Profilo Pubblico',
    'settings.public_profile_desc': 'Consenti ad altri di scoprire il tuo profilo',
    'settings.investment_activity': 'Attività di Investimento',
    'settings.investment_activity_desc': 'Mostra i tuoi investimenti pubblicamente',
    'settings.direct_messages': 'Messaggi Diretti',
    'settings.direct_messages_desc': 'Consenti ad artisti e etichette di contattarti',
    'settings.app_preferences': 'Preferenze App',
    'settings.dark_mode': 'Modalità Scura',
    'settings.dark_mode_desc': 'Usa tema scuro (raccomandato)',
    'settings.audio_preview': 'Anteprima Audio',
    'settings.audio_preview_desc': 'Riproduci automaticamente campioni musicali',
    'settings.language': 'Lingua',
    'settings.language_desc': 'Scegli la tua lingua preferita',
    
    // Investment
    'investment.title': 'Investimento',
    'investment.amount': 'Importo',
    'investment.payment_method': 'Metodo di Pagamento',
    'investment.credit_card': 'Carta di Credito/Debito',
    'investment.bank_transfer': 'Bonifico Bancario',
    'investment.mobile_payment': 'Pagamento Mobile',
    'investment.jurisdiction': 'Giurisdizione',
    'investment.invest_now': 'Investi Ora',
    'investment.payment_error': 'Errore di Pagamento',
    'investment.payment_failed': 'Elaborazione pagamento fallita. Riprova.',
    
    // Search
    'search.trending_now': 'Tendenze Ora',
    'search.popular_searches': 'Ricerche Popolari',
    'search.fan_search': 'Ricerca Fan',
    'search.top': 'Top',
    'search.artists': 'Artisti',
    'search.songs': 'Canzoni',
    'search.playlists': 'Playlist',
    'search.live': 'LIVE',
    
    // Common
    'common.loading': 'Caricamento...',
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.edit': 'Modifica',
    'common.delete': 'Elimina',
    'common.back': 'Indietro',
  },
  
  ja: {
    // Navigation
    'nav.home': 'ホーム',
    'nav.search': '検索',
    'nav.analytics': 'アナリティクス',
    'nav.settings': '設定',
    'nav.portfolio': 'ポートフォリオ',
    'nav.create': '作成',
    
    // Settings
    'settings.title': '設定',
    'settings.privacy': 'プライバシーとセキュリティ',
    'settings.public_profile': 'パブリックプロフィール',
    'settings.public_profile_desc': '他の人があなたのプロフィールを発見できるようにする',
    'settings.investment_activity': '投資活動',
    'settings.investment_activity_desc': '投資を公開表示する',
    'settings.direct_messages': 'ダイレクトメッセージ',
    'settings.direct_messages_desc': 'アーティストやレーベルからの連絡を許可する',
    'settings.app_preferences': 'アプリ設定',
    'settings.dark_mode': 'ダークモード',
    'settings.dark_mode_desc': 'ダークテーマを使用（推奨）',
    'settings.audio_preview': 'オーディオプレビュー',
    'settings.audio_preview_desc': '音楽サンプルを自動再生する',
    'settings.language': '言語',
    'settings.language_desc': 'お好みの言語を選択してください',
    
    // Investment
    'investment.title': '投資',
    'investment.amount': '金額',
    'investment.payment_method': '支払い方法',
    'investment.credit_card': 'クレジット/デビットカード',
    'investment.bank_transfer': '銀行振込',
    'investment.mobile_payment': 'モバイル決済',
    'investment.jurisdiction': '管轄',
    'investment.invest_now': '今すぐ投資',
    'investment.payment_error': '支払いエラー',
    'investment.payment_failed': '支払い処理に失敗しました。再試行してください。',
    
    // Search
    'search.trending_now': '今のトレンド',
    'search.popular_searches': '人気の検索',
    'search.fan_search': 'ファン検索',
    'search.top': 'トップ',
    'search.artists': 'アーティスト',
    'search.songs': '楽曲',
    'search.playlists': 'プレイリスト',
    'search.live': 'ライブ',
    
    // Common
    'common.loading': '読み込み中...',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.edit': '編集',
    'common.delete': '削除',
    'common.back': '戻る',
  },
  
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.search': '搜索',
    'nav.analytics': '分析',
    'nav.settings': '设置',
    'nav.portfolio': '投资组合',
    'nav.create': '创建',
    
    // Settings
    'settings.title': '设置',
    'settings.privacy': '隐私和安全',
    'settings.public_profile': '公开资料',
    'settings.public_profile_desc': '允许其他人发现您的资料',
    'settings.investment_activity': '投资活动',
    'settings.investment_activity_desc': '公开显示您的投资',
    'settings.direct_messages': '私信',
    'settings.direct_messages_desc': '允许艺术家和厂牌联系您',
    'settings.app_preferences': '应用偏好',
    'settings.dark_mode': '深色模式',
    'settings.dark_mode_desc': '使用深色主题（推荐）',
    'settings.audio_preview': '音频预览',
    'settings.audio_preview_desc': '自动播放音乐样本',
    'settings.language': '语言',
    'settings.language_desc': '选择您偏好的语言',
    
    // Investment
    'investment.title': '投资',
    'investment.amount': '金额',
    'investment.payment_method': '支付方式',
    'investment.credit_card': '信用卡/借记卡',
    'investment.bank_transfer': '银行转账',
    'investment.mobile_payment': '移动支付',
    'investment.jurisdiction': '管辖区',
    'investment.invest_now': '立即投资',
    'investment.payment_error': '支付错误',
    'investment.payment_failed': '支付处理失败。请重试。',
    
    // Search
    'search.trending_now': '当前热门',
    'search.popular_searches': '热门搜索',
    'search.fan_search': '粉丝搜索',
    'search.top': '热门',
    'search.artists': '艺术家',
    'search.songs': '歌曲',
    'search.playlists': '播放列表',
    'search.live': '直播',
    
    // Common
    'common.loading': '加载中...',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.back': '返回',
  },
  
  ko: {
    // Navigation
    'nav.home': '홈',
    'nav.search': '검색',
    'nav.analytics': '분석',
    'nav.settings': '설정',
    'nav.portfolio': '포트폴리오',
    'nav.create': '생성',
    
    // Settings
    'settings.title': '설정',
    'settings.privacy': '개인정보 보호 및 보안',
    'settings.public_profile': '공개 프로필',
    'settings.public_profile_desc': '다른 사람이 귀하의 프로필을 발견할 수 있도록 허용',
    'settings.investment_activity': '투자 활동',
    'settings.investment_activity_desc': '투자를 공개적으로 표시',
    'settings.direct_messages': '직접 메시지',
    'settings.direct_messages_desc': '아티스트와 레이블이 연락할 수 있도록 허용',
    'settings.app_preferences': '앱 환경설정',
    'settings.dark_mode': '다크 모드',
    'settings.dark_mode_desc': '다크 테마 사용 (권장)',
    'settings.audio_preview': '오디오 미리보기',
    'settings.audio_preview_desc': '음악 샘플 자동 재생',
    'settings.language': '언어',
    'settings.language_desc': '선호하는 언어를 선택하세요',
    
    // Investment
    'investment.title': '투자',
    'investment.amount': '금액',
    'investment.payment_method': '결제 방법',
    'investment.credit_card': '신용/체크 카드',
    'investment.bank_transfer': '은행 송금',
    'investment.mobile_payment': '모바일 결제',
    'investment.jurisdiction': '관할권',
    'investment.invest_now': '지금 투자',
    'investment.payment_error': '결제 오류',
    'investment.payment_failed': '결제 처리에 실패했습니다. 다시 시도해주세요.',
    
    // Search
    'search.trending_now': '지금 트렌딩',
    'search.popular_searches': '인기 검색',
    'search.fan_search': '팬 검색',
    'search.top': '인기',
    'search.artists': '아티스트',
    'search.songs': '곡',
    'search.playlists': '플레이리스트',
    'search.live': '라이브',
    
    // Common
    'common.loading': '로딩 중...',
    'common.save': '저장',
    'common.cancel': '취소',
    'common.edit': '편집',
    'common.delete': '삭제',
    'common.back': '뒤로',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(i18n.getCurrentLanguage());

  // Listen to changes from the I18nService
  useEffect(() => {
    const unsubscribe = i18n.subscribe(() => {
      setLanguageState(i18n.getCurrentLanguage());
    });
    
    return unsubscribe;
  }, []);

  const setLanguage = (lang: Language) => {
    i18n.setLanguage(lang);
    setLanguageState(lang);
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