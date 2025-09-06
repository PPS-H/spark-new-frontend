import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Music, 
  Play, 
  Video, 
  Users, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  Zap
} from "lucide-react";

interface PlatformConnection {
  id: string;
  name: string;
  icon: any;
  connected: boolean;
  followers?: number;
  engagement?: number;
  color: string;
  description: string;
}

export default function PlatformConnections() {
  const { toast } = useToast();
  const [connections, setConnections] = useState<PlatformConnection[]>([
    {
      id: "spotify",
      name: "Spotify",
      icon: Music,
      connected: false,
      color: "from-green-500 to-green-600",
      description: "Connect for streaming analytics, playlist placements, and revenue tracking"
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Video,
      connected: false,
      color: "from-red-500 to-red-600",
      description: "Sync video content, subscriber metrics, and monetization data"
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: Zap,
      connected: false,
      color: "from-pink-500 to-pink-600",
      description: "Track viral content, audience demographics, and engagement rates"
    },
    {
      id: "deezer",
      name: "Deezer",
      icon: Play,
      connected: false,
      color: "from-orange-500 to-orange-600",
      description: "Monitor international streams, playlist adds, and global reach"
    }
  ]);

  const connectPlatform = async (platformId: string) => {
    try {
      const response = await fetch(`/api/${platformId}/connect`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to connect to ${platformId}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.redirectUrl) {
        // Show success message and open platform in new tab
        toast({
          title: "Redirecting to Platform",
          description: data.message,
          variant: "default"
        });
        
        // Open platform dashboard in new tab
        window.open(data.redirectUrl, '_blank');
        
        // Mark as connected for user feedback
        setConnections(prev => prev.map(conn => 
          conn.id === platformId 
            ? { ...conn, connected: true }
            : conn
        ));
      } else if (data.authUrl) {
        // Fallback for OAuth flow
        window.location.href = data.authUrl;
      } else {
        toast({
          title: "Connection Issue",
          description: `Unable to connect to ${platformId}. Please try again.`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || `Failed to connect to ${platformId}`,
        variant: "destructive"
      });
    }
  };

  const checkConnectionStatus = async (platformId: string) => {
    try {
      const response = await apiRequest("GET", `/api/${platformId}/status`);
      const data = await response.json();
      
      if (data.connected) {
        setConnections(prev => prev.map(conn => 
          conn.id === platformId 
            ? { ...conn, connected: true, followers: data.followers, engagement: data.engagement }
            : conn
        ));
        
        toast({
          title: "Connected Successfully",
          description: `${platformId} account linked to your SPARK profile`,
        });
      }
    } catch (error) {
      console.error(`Failed to check ${platformId} status:`, error);
    }
  };

  const disconnectPlatform = async (platformId: string) => {
    try {
      const response = await fetch(`/api/${platformId}/disconnect`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to disconnect from ${platformId}`);
      }
      
      setConnections(prev => prev.map(conn => 
        conn.id === platformId 
          ? { ...conn, connected: false, followers: undefined, engagement: undefined }
          : conn
      ));
      
      toast({
        title: "Disconnected",
        description: `${platformId} account disconnected successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Disconnect Failed",
        description: error.message || `Failed to disconnect from ${platformId}`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Platform Connections</h2>
          <p className="text-gray-400">Connect your music platforms to sync data and analytics</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-300">
          {connections.filter(c => c.connected).length}/{connections.length} Connected
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {connections.map((platform) => (
          <Card key={platform.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-full flex items-center justify-center`}>
                    <platform.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{platform.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {platform.connected ? (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-sm">Connected</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 text-sm">Not connected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={platform.connected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      connectPlatform(platform.id);
                    } else {
                      disconnectPlatform(platform.id);
                    }
                  }}
                />
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-400 text-sm mb-4">{platform.description}</p>
              
              {platform.connected && (platform.followers || platform.engagement) && (
                <div className="flex space-x-4 mb-4">
                  {platform.followers && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {platform.followers.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">Followers</div>
                    </div>
                  )}
                  {platform.engagement && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {platform.engagement}%
                      </div>
                      <div className="text-xs text-gray-400">Engagement</div>
                    </div>
                  )}
                </div>
              )}
              
              <Button
                variant={platform.connected ? "outline" : "default"}
                className={`w-full ${platform.connected ? 'border-slate-600' : `bg-gradient-to-r ${platform.color}`}`}
                onClick={() => {
                  if (platform.connected) {
                    disconnectPlatform(platform.id);
                  } else {
                    connectPlatform(platform.id);
                  }
                }}
              >
                {platform.connected ? (
                  "Disconnect"
                ) : (
                  <>
                    Connect {platform.name}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}