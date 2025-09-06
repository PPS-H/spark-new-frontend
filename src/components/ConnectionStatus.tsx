import { Badge } from "@/components/ui/badge";
import { WifiOff, Database } from "lucide-react";

interface ConnectionStatusProps {
  className?: string;
}

export const ConnectionStatus = ({ className }: ConnectionStatusProps) => {
  // Static offline state - no connections
  const isWebSocketConnected = true;
  const isFirebaseConnected = true;
  const streamingCount = 0;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Static WebSocket Status - Always Offline */}
      <Badge 
        variant="secondary"
        className="flex items-center gap-1 bg-red-500/20 text-red-300 border-red-500/30"
      >
        <WifiOff className="w-3 h-3" />
        <span className="text-xs">Offline</span>
      </Badge>

      {/* Firebase Status - Always Hidden */}
      {isFirebaseConnected && (
        <Badge 
          variant="outline" 
          className="flex items-center gap-1 bg-blue-500/20 text-blue-300 border-blue-500/30"
        >
          <Database className="w-3 h-3" />
          <span className="text-xs">Firebase</span>
        </Badge>
      )}

      {/* Static Demo Mode Indicator */}
      <Badge 
        variant="outline" 
        className="flex items-center gap-1 bg-gray-500/20 text-gray-300 border-gray-500/30"
      >
        <Database className="w-3 h-3" />
        <span className="text-xs">Demo Mode</span>
      </Badge>
    </div>
  );
};

export default ConnectionStatus;
