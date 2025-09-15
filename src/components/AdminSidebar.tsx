import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  FileText, 
  LogOut, 
  Menu,
  X,
  Home
} from "lucide-react";

interface AdminSidebarProps {
  onLogout: () => void;
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
      description: "Overview and statistics"
    },
    {
      title: "Draft Projects",
      href: "/admin/draft-projects",
      icon: FileText,
      description: "Projects awaiting approval"
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Admin Panel</h1>
                <p className="text-slate-400 text-xs">Management Dashboard</p>
              </div>
            </div>
          )}
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors group ${
                active
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${
                active ? 'text-purple-300' : 'text-slate-400 group-hover:text-white'
              }`} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-slate-500 group-hover:text-slate-300">
                    {item.description}
                  </p>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700"
        >
          <LogOut className="w-5 h-5 mr-3" />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
}
