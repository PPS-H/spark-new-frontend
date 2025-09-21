import {
  Home,
  Search,
  BarChart3,
  Settings,
  Plus,
  Briefcase,
  Target,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthRTK";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RoleBasedNavigation() {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  // const user = {
  //   // role: "artist",
  //   // role: "fan",
  //   role: "label",
  // };
  const { t } = useLanguage();

  // Hide navigation on admin pages
  const isAdminPage = location.pathname.startsWith('/admin');

  const getNavigationItems = () => {
    if (!user) return [];

    const baseItems = [
      { path: "/", icon: Home, label: t("nav.home") },
      { path: "/search", icon: Search, label: t("nav.search") },
    ];

    if (user.role === "artist") {
      return [
        ...baseItems,
        { path: "/analytics", icon: BarChart3, label: t("nav.analytics") },
        { path: "/create", icon: Plus, label: t("nav.create") },
        { path: "/settings", icon: Settings, label: t("nav.settings") },
      ];
    }

    if (user.role === "investor" || user.role === "label") {
      return [
        ...baseItems,
        { path: "/analytics", icon: BarChart3, label: t("nav.analytics") },
        { path: "/portfolio", icon: Briefcase, label: t("nav.portfolio") },
        { path: "/settings", icon: Settings, label: t("nav.settings") },
      ];
    }

    // Free users (fan/user) get basic navigation only
    return [
      ...baseItems,
      { path: "/settings", icon: Settings, label: t("nav.settings") },
    ];
  };

  const navItems = getNavigationItems();

  if (!user || isAdminPage) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800">
      <div className="flex items-center justify-around max-w-md mx-auto py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <div
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-gray-500 hover:text-gray-300 hover:bg-slate-800/50"
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
