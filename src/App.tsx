import "./components/i18n";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuthRTK";
// import { FirebaseAuthProvider } from "@/hooks/useFirebaseAuth"; // Optionnel
import { useEffect } from "react";
import ArtistHome from "@/pages/artist-home";
import InvestorHome from "@/pages/investor-home";
import LabelHome from "@/pages/label-home";
import UserHome from "@/pages/user-home";
import SearchPage from "@/pages/search";
import AnalyticsPage from "@/pages/analytics";
import SettingsPage from "@/pages/settings";
import CreatePage from "@/pages/create";
import PortfolioPage from "@/pages/portfolio";
import AdminDashboardPage from "@/pages/admin-dashboard";
import ArtistRegistrationPage from "@/pages/artist-registration-page";
import InvestorRegistrationPage from "@/pages/investor-registration-page";
import LabelRegistrationPage from "@/pages/label-registration-page";
import RosterManagement from "@/pages/roster-management";
import { AnalyticsDashboard } from "@/pages/analytics-dashboard";
import ArtistProfile from "@/pages/artist-profile";
import InvestArtistPage from "@/pages/invest-artist";
import DownloadProject from "@/pages/download-project";
import NotFound from "@/pages/not-found";
import RoleBasedNavigation from "@/components/role-based-navigation";
import CheckoutPage from "@/pages/checkout";
import PostCheckoutPage from "./pages/post-checkout";
import FanRegistrationPage from "./pages/fan-registration-page";
import MarketingHome from "./pages/MarketingHome";

function ConditionalHome() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show marketing page only if not authenticated and not loading
  if (!isLoading && !isAuthenticated) {
    return <MarketingHome />;
  }

  // If loading and we have a token, show a loading state instead of MarketingHome
  if (isLoading && localStorage.getItem('token')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If loading but no token, show MarketingHome
  if (isLoading && !localStorage.getItem('token')) {
    return <MarketingHome />;
  }

  // AUTHENTICATED: Show role-specific dashboard based on user role
  console.log("User role:", user?.role, "User:", user);

  switch (user?.role) {
    case "artist":
      return <ArtistHome />;
    case "investor":
      return <InvestorHome />; // NO NEED TO USE
    case "label":
      return <LabelHome />;
    case "fan":
      return <UserHome />; // Fan users get the free music discovery interface
    case "user":
    default:
      return <UserHome />;
  }
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="relative">
      <Routes>
        <Route path="/" element={<ConditionalHome />} />
        <Route path="/stripe-success" element={<PostCheckoutPage />} />
        <Route path="/artist-register" element={<ArtistRegistrationPage />} />
        <Route path="/fan-register" element={<FanRegistrationPage />} />
        <Route
          path="/investor-register"
          element={<InvestorRegistrationPage />}
        />
        <Route path="/label-register" element={<LabelRegistrationPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/roster" element={<RosterManagement />} />
        <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
        <Route path="/artist/:artistId" element={<ArtistProfile />} />
        <Route path="/invest/:projectId" element={<InvestArtistPage />} />
        <Route path="/checkout/:artistId/:amount" element={<CheckoutPage />} />
        <Route path="/download-project" element={<DownloadProject />} />
        <Route
          path="/download"
          element={
            <div>
              {/* You'll need to handle lazy loading differently with React Router */}
              {/* Consider using React.lazy() or import the component directly */}
            </div>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* Only show navigation when user is authenticated */}
      {isAuthenticated && <RoleBasedNavigation />}
    </div>
  );
}

function App() {
  useEffect(() => {
    // Gestion des WebSocket pour synchronisation données temps réel
    const handleStreamingUpdate = (event: CustomEvent) => {
      const data = event.detail;
      console.log("🔄 Mise à jour streaming:", data);
    };

    const handleInvestmentUpdate = (event: CustomEvent) => {
      const data = event.detail;
      console.log("🔄 Mise à jour investissement:", data);
    };

    const handleRoyaltyUpdate = (event: CustomEvent) => {
      const data = event.detail;
      console.log("🔄 Mise à jour royalties:", data);
    };

    // Écouter les événements WebSocket
    window.addEventListener(
      "sparkStreamingUpdate",
      handleStreamingUpdate as EventListener
    );
    window.addEventListener(
      "sparkInvestmentUpdate",
      handleInvestmentUpdate as EventListener
    );
    window.addEventListener(
      "sparkRoyaltyUpdate",
      handleRoyaltyUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "sparkStreamingUpdate",
        handleStreamingUpdate as EventListener
      );
      window.removeEventListener(
        "sparkInvestmentUpdate",
        handleInvestmentUpdate as EventListener
      );
      window.removeEventListener(
        "sparkRoyaltyUpdate",
        handleRoyaltyUpdate as EventListener
      );
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="spark-theme">
      <LanguageProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
