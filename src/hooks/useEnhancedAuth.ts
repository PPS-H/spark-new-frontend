import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Configuration Firebase (variables d'environnement)
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
    console.log("🔥 Firebase initialisé avec succès");
  } catch (error) {
    console.log("📱 Firebase non configuré, utilisation de l'authentification locale SPARK");
  }
}

interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
  firstName?: string;
  lastName?: string;
}

export function useEnhancedAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Intégration Firebase pour l'état d'authentification
  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const userData = { 
            id: firebaseUser.uid as unknown as number, 
            username: firebaseUser.displayName || "", 
            email: firebaseUser.email || "", 
            role: localStorage.getItem("userRole") || "user" 
          };
          queryClient.setQueryData(["/api/auth/me"], userData);
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("authToken", token);
          console.log("🔐 Firebase auth state updated:", firebaseUser.email);
        } catch (error) {
          console.error("🚨 Erreur lors de la mise à jour de l'état Firebase:", error);
        }
      } else {
        queryClient.setQueryData(["/api/auth/me"], null);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        console.log("🔓 Firebase utilisateur déconnecté");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [queryClient]);

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        return apiRequest("GET", "/api/auth/me", undefined, token).then(res => res.json());
      }
      // Fallback local
      const localUser = localStorage.getItem("user");
      return localUser ? JSON.parse(localUser) : null;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      if (!credentials.email || !credentials.password) {
        throw new Error("Email et mot de passe requis");
      }

      // Essayer Firebase d'abord si disponible
      if (auth) {
        try {
          const credential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
          const token = await credential.user.getIdToken();
          localStorage.setItem("authToken", token);
          const userData = { 
            id: credential.user.uid as unknown as number, 
            username: credential.user.displayName || "", 
            email: credential.user.email || "", 
            role: localStorage.getItem("userRole") || "user" 
          };
          console.log("🔐 Firebase login réussi");
          return userData;
        } catch (firebaseError) {
          console.log("⚠️ Firebase login échoué, tentative avec auth locale");
        }
      }

      // Fallback vers auth locale SPARK
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data);
      localStorage.setItem("user", JSON.stringify(data));
      console.log("✅ Login réussi");
    },
    onError: (error) => console.error("🚨 Erreur login:", error),
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Déconnexion Firebase si disponible
      if (auth) {
        try {
          await signOut(auth);
          console.log("🔥 Firebase logout réussi");
        } catch (error) {
          console.log("⚠️ Erreur logout Firebase, continuons avec local");
        }
      }

      // Déconnexion locale
      try {
        await apiRequest("POST", "/api/auth/logout");
      } catch (error) {
        console.log("⚠️ Erreur logout API locale");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      window.location.href = "/";
      console.log("✅ Logout complet réussi");
    },
    onError: (error) => console.error("🚨 Erreur logout:", error),
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: { username: string; email: string; password: string; role?: string }) => {
      // Essayer Firebase d'abord si disponible
      if (auth) {
        try {
          const credential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
          await credential.user.updateProfile({ displayName: userData.username });
          const token = await credential.user.getIdToken();
          localStorage.setItem("authToken", token);
          localStorage.setItem("userRole", userData.role || "user");
          const registeredUser = { 
            id: credential.user.uid as unknown as number, 
            username: userData.username, 
            email: userData.email, 
            role: userData.role 
          };
          console.log("🔥 Firebase inscription réussie");
          return registeredUser;
        } catch (firebaseError) {
          console.log("⚠️ Firebase inscription échouée, tentative avec auth locale");
        }
      }

      // Fallback vers inscription locale SPARK
      const response = await apiRequest("POST", "/api/auth/register", userData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data);
      localStorage.setItem("user", JSON.stringify(data));
      console.log("✅ Inscription réussie");
    },
    onError: (error) => console.error("🚨 Erreur inscription:", error),
  });

  return {
    user: user as User | null,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    register: registerMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    firebaseEnabled: !!auth,
  };
}