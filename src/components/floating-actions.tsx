import { useState } from "react";
import { Plus, TrendingUp, Search, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionsProps {
  onQuickInvest: () => void;
  onShowSearch: () => void;
  onShowAnalytics: () => void;
}

export default function FloatingActions({ onQuickInvest, onShowSearch, onShowAnalytics }: FloatingActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Quick Invest",
      action: onQuickInvest,
      gradient: "from-green-400 to-emerald-500",
      hoverGlow: "hover:shadow-green-400/25"
    },
    {
      icon: <Search className="w-5 h-5" />,
      label: "Search Artists",
      action: onShowSearch,
      gradient: "from-blue-400 to-cyan-500",
      hoverGlow: "hover:shadow-blue-400/25"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: "Market Pulse",
      action: onShowAnalytics,
      gradient: "from-yellow-400 to-orange-500",
      hoverGlow: "hover:shadow-yellow-400/25"
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      <div className={`flex flex-col space-y-3 mb-4 transition-all duration-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {actions.map((action, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap animate-slide-up">
              {action.label}
            </span>
            <Button
              onClick={() => {
                action.action();
                setIsExpanded(false);
              }}
              className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.gradient} text-black font-semibold hover:shadow-lg ${action.hoverGlow} transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 animate-float`}
              style={{ animationDelay: `${index * 100}ms` }}
              aria-label={action.label}
            >
              {action.icon}
            </Button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-semibold hover:shadow-xl hover:shadow-cyan-400/30 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 animate-pulse-glow ${isExpanded ? 'rotate-45' : ''}`}
        aria-label={isExpanded ? "Close quick actions" : "Open quick actions"}
        aria-expanded={isExpanded}
      >
        {isExpanded ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </Button>
    </div>
  );
}