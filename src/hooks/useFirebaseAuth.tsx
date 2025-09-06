import { useState, useEffect, createContext, useContext } from "react";
import type { ReactNode } from "react";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Configuration Firebase (utilise les variables d'environnement)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

let app: any = null;
let auth: any = null;

// Initialisation Firebase si configuré
if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.log("Firebase non configuré, utilisation de l'authentification locale SPARK");
  }
}

interface FirebaseAuthContextType {
  firebaseUser: User | null;
  isFirebaseLoading: boolean;
  isFirebaseAuthenticated: boolean;
  firebaseLogin: (credentials: { email: string; password: string }) => Promise<void>;
  firebaseLogout: () => Promise<void>;
  firebaseRegister: (userData: { username: string; email: string; password: string; role?: string }) => Promise<void>;
  isFirebaseLoginLoading: boolean;
  isFirebaseLogoutLoading: boolean;
  isFirebaseRegisterLoading: boolean;
  firebaseEnabled: boolean;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

interface FirebaseAuthProviderProps {
  children: ReactNode;
}

export function FirebaseAuthProvider({ children }: FirebaseAuthProviderProps) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);
  const [isFirebaseAuthenticated, setIsFirebaseAuthenticated] = useState(false);
  const [isFirebaseLoginLoading, setIsFirebaseLoginLoading] = useState(false);
  const [isFirebaseLogoutLoading, setIsFirebaseLogoutLoading] = useState(false);
  const [isFirebaseRegisterLoading, setIsFirebaseRegisterLoading] = useState(false);
  const firebaseEnabled = !!auth;

  useEffect(() => {
    if (!auth) {
      setIsFirebaseLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsFirebaseAuthenticated(!!user);
      setIsFirebaseLoading(false);
      
      if (user) {
        console.log("🔐 Firebase utilisateur connecté:", user.email);
        // Stocker les infos Firebase pour intégration avec l'auth locale
        localStorage.setItem("firebaseUser", JSON.stringify({
          email: user.email,
          uid: user.uid,
          displayName: user.displayName
        }));
      } else {
        console.log("🔓 Firebase authentification déconnectée");
        localStorage.removeItem("firebaseUser");
      }
    });
    
    return () => unsubscribe();
  }, []);

  const firebaseLogin = async (credentials: { email: string; password: string }) => {
    if (!auth) throw new Error("Firebase non configuré");
    
    setIsFirebaseLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      console.log("🔐 Firebase login réussi");
    } catch (error) {
      console.error("🚨 Erreur Firebase login:", error);
      throw error;
    } finally {
      setIsFirebaseLoginLoading(false);
    }
  };

  const firebaseLogout = async () => {
    if (!auth) throw new Error("Firebase non configuré");
    
    setIsFirebaseLogoutLoading(true);
    try {
      await signOut(auth);
      console.log("🔓 Firebase logout réussi");
    } catch (error) {
      console.error("🚨 Erreur Firebase logout:", error);
      throw error;
    } finally {
      setIsFirebaseLogoutLoading(false);
    }
  };

  const firebaseRegister = async (userData: { username: string; email: string; password: string; role?: string }) => {
    if (!auth) throw new Error("Firebase non configuré");
    
    setIsFirebaseRegisterLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      
      if (user && userData.username) {
        await user.updateProfile({ displayName: userData.username });
        console.log("🔐 Firebase inscription réussie pour:", userData.username);
      }
    } catch (error) {
      console.error("🚨 Erreur Firebase inscription:", error);
      throw error;
    } finally {
      setIsFirebaseRegisterLoading(false);
    }
  };

  const value: FirebaseAuthContextType = {
    firebaseUser,
    isFirebaseLoading,
    isFirebaseAuthenticated,
    firebaseLogin,
    firebaseLogout,
    firebaseRegister,
    isFirebaseLoginLoading,
    isFirebaseLogoutLoading,
    isFirebaseRegisterLoading,
    firebaseEnabled,
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error("useFirebaseAuth must be used within a FirebaseAuthProvider");
  }
  return context;
}

export default useFirebaseAuth;