import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "fr", "es", "pt", "ko"],
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
          dashboard: "Dashboard",
          logout: "Logout",
          registerInvestor: "Investor Registration",
          email: "Email",
          password: "Password",
          goal: "Investment Goal",
          selectGoal: "Select your goal",
          growth: "Growth",
          income: "Income",
          balance: "Balance",
          register: "Register",
        },
      },
      fr: {
        translation: {
          welcome: "Bienvenue",
          dashboard: "Tableau de bord",
          logout: "Déconnexion",
          registerInvestor: "Inscription Investisseur",
          email: "Adresse e-mail",
          password: "Mot de passe",
          goal: "Objectif d'investissement",
          selectGoal: "Sélectionnez votre objectif",
          growth: "Croissance",
          income: "Revenu",
          balance: "Équilibre",
          register: "S'inscrire",
        },
      },
      es: {
        translation: {
          welcome: "Bienvenido",
          dashboard: "Panel de control",
          logout: "Cerrar sesión",
          registerInvestor: "Registro de Inversor",
          email: "Correo electrónico",
          password: "Contraseña",
          goal: "Objetivo de inversión",
          selectGoal: "Seleccione su objetivo",
          growth: "Crecimiento",
          income: "Ingreso",
          balance: "Equilibrio",
          register: "Registrarse",
        },
      },
      pt: {
        translation: {
          welcome: "Bem-vindo",
          dashboard: "Painel",
          logout: "Sair",
          registerInvestor: "Registro de Investidor",
          email: "Email",
          password: "Senha",
          goal: "Objetivo de investimento",
          selectGoal: "Selecione seu objetivo",
          growth: "Crescimento",
          income: "Renda",
          balance: "Equilíbrio",
          register: "Registrar",
        },
      },
      ko: {
        translation: {
          welcome: "환영합니다",
          dashboard: "대시보드",
          logout: "로그아웃",
          registerInvestor: "투자자 등록",
          email: "이메일",
          password: "비밀번호",
          goal: "투자 목표",
          selectGoal: "목표 선택",
          growth: "성장",
          income: "수익",
          balance: "균형",
          register: "등록",
        },
      },
    },
  });

export default i18n;