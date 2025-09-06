import { useState, useEffect } from "react";
import { Bell, X, TrendingUp, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "alert";
  title: string;
  message: string;
  timestamp: Date;
  actionLabel?: string;
  actionCallback?: () => void;
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const notificationTypes = [
        {
          type: "success" as const,
          title: "Investment Update",
          message: "Your investment in Léo increased by 5.2%",
          actionLabel: "View Portfolio"
        },
        {
          type: "info" as const,
          title: "New Artist Alert",
          message: "A new K-Pop artist matching your preferences is available",
          actionLabel: "Explore"
        },
        {
          type: "warning" as const,
          title: "Market Alert", 
          message: "Afrobeats genre showing high volatility",
          actionLabel: "View Analysis"
        },
        {
          type: "alert" as const,
          title: "Price Target Hit",
          message: "Kofi reached your target price of $55.00",
          actionLabel: "Trade"
        }
      ];

      const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      
      if (Math.random() > 0.7) { // 30% chance every interval
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          ...randomNotification,
          timestamp: new Date(),
          actionCallback: () => console.log(`Action clicked for: ${randomNotification.title}`)
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 most recent
        setUnreadCount(prev => prev + 1);
      }
    }, 8000); // Check every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "info": return <Info className="w-5 h-5 text-blue-400" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "alert": return <TrendingUp className="w-5 h-5 text-red-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "success": return "border-green-400/30";
      case "info": return "border-blue-400/30";
      case "warning": return "border-yellow-400/30";
      case "alert": return "border-red-400/30";
      default: return "border-gray-400/30";
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const togglePanel = () => {
    setShowPanel(!showPanel);
    if (!showPanel) {
      setUnreadCount(0); // Mark as read when opened
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        onClick={togglePanel}
        variant="ghost"
        size="icon"
        className="relative hover:bg-cyan-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        aria-label="Open notifications panel"
      >
        <Bell className="text-cyan-400 w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="absolute right-0 top-12 w-80 max-h-96 bg-slate-900 border border-cyan-500/20 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-scale">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="font-semibold text-white">Notifications</h3>
            <div className="flex space-x-2">
              {notifications.length > 0 && (
                <Button
                  onClick={clearAll}
                  size="sm"
                  variant="ghost"
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Clear All
                </Button>
              )}
              <Button
                onClick={togglePanel}
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className={`p-4 border-l-2 ${getBorderColor(notification.type)} hover:bg-slate-800/50 transition-colors`}>
                  <div className="flex items-start space-x-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-white truncate">
                          {notification.title}
                        </h4>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-300 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                        {notification.actionLabel && (
                          <Button
                            onClick={notification.actionCallback}
                            size="sm"
                            className="text-xs bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-400/30"
                          >
                            {notification.actionLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showPanel && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={togglePanel}
        />
      )}
    </div>
  );
}