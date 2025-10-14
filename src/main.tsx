import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReduxProvider } from "./components/redux-provider";
import { LanguageProvider } from "./contexts/LanguageContext";

// Importation pour le thème sombre/clair avec Tailwind
import { useState, useEffect } from "react";

// Importation pour WebSocket (données en temps réel)
import { io } from "socket.io-client";
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

console.log("Stripe public key:", stripeKey);

const stripePromise = loadStripe(stripeKey);

// Importation pour Firebase (authentification optionnelle)
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Configuration Firebase (optionnelle - peut être configurée par l'utilisateur)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Initialisation Firebase si configuré
let auth: any = null;
if (firebaseConfig.apiKey) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.log(
      "Firebase non configuré, utilisation de l'authentification locale",
    );
  }
}

// Gestion du thème sombre/clair
const ThemeManager = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Applique le thème basé sur les préférences système ou localStorage
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const savedMode = localStorage.getItem("sparkDarkMode") === "true";
    setDarkMode(prefersDark || savedMode);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("sparkDarkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("sparkDarkMode", "false");
    }
  }, [darkMode]);

  return <div className={darkMode ? "dark" : ""}>{children}</div>;
};

// Connexion WebSocket pour données en temps réel (streaming data)
let socket: any = null;
if (typeof window !== "undefined") {
  try {
    socket = io(window.location.origin, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log(
        "🔌 SPARK WebSocket connecté - données en temps réel activées",
      );
    });

    socket.on("streamingUpdate", (data: any) => {
      console.log("📊 Mise à jour streaming:", data);
      // Événement personnalisé pour notifier l'app des mises à jour
      window.dispatchEvent(
        new CustomEvent("sparkStreamingUpdate", { detail: data }),
      );
    });

    socket.on("investmentUpdate", (data: any) => {
      console.log("💰 Mise à jour investissement:", data);
      window.dispatchEvent(
        new CustomEvent("sparkInvestmentUpdate", { detail: data }),
      );
    });

    socket.on("royaltyDistribution", (data: any) => {
      console.log("🎵 Distribution royalties:", data);
      window.dispatchEvent(
        new CustomEvent("sparkRoyaltyUpdate", { detail: data }),
      );
    });
  } catch (error) {
    console.log("WebSocket non disponible, fonctionnement en mode standard");
  }
}

const renderApp = () => {
  const root = createRoot(document.getElementById("root")!);

  // Fonction de rendu principal
  const renderSpark = () => {
    root.render(
      <ThemeManager>
        <LanguageProvider>
          <ReduxProvider>
            <Elements stripe={stripePromise}>
              <App />
            </Elements>
          </ReduxProvider>
        </LanguageProvider>
      </ThemeManager>,
    );
  };

  // Si Firebase est configuré, vérifier l'authentification
  if (auth) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("🔐 Utilisateur Firebase connecté:", user.email);
        // Stocker les infos Firebase pour intégration avec l'auth locale
        localStorage.setItem(
          "firebaseUser",
          JSON.stringify({
            email: user.email,
            uid: user.uid,
            displayName: user.displayName,
          }),
        );
      } else {
        console.log("🔓 Authentification Firebase déconnectée");
        localStorage.removeItem("firebaseUser");
      }
      renderSpark();
    });
  } else {
    // Rendu direct si Firebase n'est pas configuré
    renderSpark();
  }
};

// Gestion des erreurs globales
window.addEventListener("error", (event) => {
  console.error("🚨 Erreur SPARK:", event.message);
});

// Gestion des erreurs de promesse non capturées
window.addEventListener("unhandledrejection", (event) => {
  console.error("🚨 Erreur Promise SPARK:", event.reason);
});

// Initialiser SPARK
console.log("🚀 Initialisation SPARK - Plateforme d'investissement musical");
renderApp();
