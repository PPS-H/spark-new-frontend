import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Music, 
  TrendingUp, 
  Users, 
  Calendar, 
  MessageSquare, 
  Share2, 
  Camera, 
  Mic, 
  Play, 
  Heart, 
  Eye, 
  DollarSign, 
  Globe, 
  Zap, 
  Target, 
  Award, 
  Briefcase,
  Send,
  Plus,
  Settings,
  BarChart3,
  UserPlus,
  MapPin,
  Clock,
  Star,
  Sparkles,
  Radio,
  Headphones,
  X
} from "lucide-react";
import { SiInstagram, SiYoutube, SiSpotify, SiApplemusic, SiTiktok, SiSoundcloud, SiTwitch, SiPatreon } from "react-icons/si";
import SmartAnalytics from "@/components/smart-analytics";

import MonetizationHub from "@/components/monetization-hub";
import AIInsights from "@/components/ai-insights";
import ProfessionalInbox from "@/components/professional-inbox";

interface ArtistDashboardProps {
  isArtistUser: boolean;
  onUpgrade: () => void;
}

interface PlatformConnection {
  id: string;
  name: string;
  icon: any;
  connected: boolean;
  followers: number;
  engagement: number;
  color: string;
}

interface CampaignData {
  totalRaised: number;
  goal: number;
  contributors: number;
  avgContribution: number;
  momentum: { month: string; amount: number; contributors: number }[];
  topChannels: { channel: string; amount: number; percentage: number }[];
}

interface FanbaseData {
  total: number;
  growth: { period: string; count: number; change: number }[];
  demographics: { age: string; percentage: number }[];
  locations: { country: string; percentage: number; fans: number }[];
  engagement: { metric: string; value: number; trend: number }[];
}

export default function ArtistDashboard({ isArtistUser, onUpgrade }: ArtistDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [showProfessionalInbox, setShowProfessionalInbox] = useState(false);
  const handleNewCampaign = () => {
    setShowNewCampaignModal(true);
  };

  const handleProfessionalInbox = () => {
    setShowProfessionalInbox(true);
  };

  const [platforms, setPlatforms] = useState<PlatformConnection[]>([
    { id: "instagram", name: "Instagram", icon: SiInstagram, connected: true, followers: 45200, engagement: 8.3, color: "from-pink-500 to-orange-500" },
    { id: "youtube", name: "YouTube", icon: SiYoutube, connected: true, followers: 12800, engagement: 12.1, color: "from-red-600 to-red-500" },
    { id: "spotify", name: "Spotify", icon: SiSpotify, connected: true, followers: 8950, engagement: 15.7, color: "from-green-500 to-green-400" },
    { id: "tiktok", name: "TikTok", icon: SiTiktok, connected: false, followers: 0, engagement: 0, color: "from-gray-800 to-black" },
    { id: "applemusic", name: "Apple Music", icon: SiApplemusic, connected: true, followers: 3240, engagement: 9.2, color: "from-gray-900 to-gray-700" },
    { id: "soundcloud", name: "SoundCloud", icon: SiSoundcloud, connected: false, followers: 0, engagement: 0, color: "from-orange-500 to-orange-400" },
    { id: "twitch", name: "Twitch", icon: SiTwitch, connected: false, followers: 0, engagement: 0, color: "from-purple-600 to-purple-500" },
    { id: "patreon", name: "Patreon", icon: SiPatreon, connected: false, followers: 0, engagement: 0, color: "from-orange-600 to-red-500" }
  ]);

  const [campaignData] = useState<CampaignData>({
    totalRaised: 24750,
    goal: 50000,
    contributors: 187,
    avgContribution: 132,
    momentum: [
      { month: "Jan", amount: 3200, contributors: 28 },
      { month: "Feb", amount: 4100, contributors: 35 },
      { month: "Mar", amount: 5800, contributors: 42 },
      { month: "Apr", amount: 7200, contributors: 58 },
      { month: "May", amount: 4450, contributors: 24 }
    ],
    topChannels: [
      { channel: "Instagram", amount: 12400, percentage: 50.1 },
      { channel: "YouTube", amount: 7350, percentage: 29.7 },
      { channel: "Spotify", amount: 3200, percentage: 12.9 },
      { channel: "Direct", amount: 1800, percentage: 7.3 }
    ]
  });

  const [fanbaseData] = useState<FanbaseData>({
    total: 78420,
    growth: [
      { period: "Today", count: 156, change: 12.3 },
      { period: "This Week", count: 987, change: 8.7 },
      { period: "This Month", count: 4200, change: 15.2 }
    ],
    demographics: [
      { age: "16-24", percentage: 42 },
      { age: "25-34", percentage: 35 },
      { age: "35-44", percentage: 18 },
      { age: "45+", percentage: 5 }
    ],
    locations: [
      { country: "United States", percentage: 38, fans: 29800 },
      { country: "United Kingdom", percentage: 22, fans: 17250 },
      { country: "Canada", percentage: 15, fans: 11763 },
      { country: "Australia", percentage: 12, fans: 9410 },
      { country: "Germany", percentage: 8, fans: 6274 },
      { country: "France", percentage: 5, fans: 3923 }
    ],
    engagement: [
      { metric: "Daily Active Fans", value: 12400, trend: 8.3 },
      { metric: "Avg. Session Time", value: 4.2, trend: 12.1 },
      { metric: "Content Saves", value: 2850, trend: -2.4 },
      { metric: "Shares", value: 1240, trend: 18.7 }
    ]
  });

  const togglePlatform = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId ? { ...p, connected: !p.connected } : p
    ));
  };

  if (!isArtistUser) {
    return (
      <div className="artist-control-hub">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 to-purple-900/60 backdrop-blur-xl border border-purple-500/30">
          {/* Scanning Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-pulse"></div>
          
          <div className="relative z-10 p-8 text-center">
            <div className="mb-6">
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Artist Control Hub</h2>
              <p className="text-purple-200 text-lg">Your creative and business cockpit</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="glass-effect-premium rounded-xl p-4">
                <Target className="w-8 h-8 text-purple-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Campaign Analytics</h3>
                <p className="text-sm text-purple-200">Track funding momentum and optimize your campaigns</p>
              </div>
              <div className="glass-effect-premium rounded-xl p-4">
                <Users className="w-8 h-8 text-purple-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Fanbase Intelligence</h3>
                <p className="text-sm text-purple-200">Understand your audience and grow strategically</p>
              </div>
              <div className="glass-effect-premium rounded-xl p-4">
                <Zap className="w-8 h-8 text-purple-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">AI Insights</h3>
                <p className="text-sm text-purple-200">Get personalized recommendations for growth</p>
              </div>
            </div>
            
            <Button 
              onClick={onUpgrade}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg shadow-purple-500/25"
            >
              Upgrade to Artist Hub - €39.99/month
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="artist-control-hub space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Artist Control Hub</h1>
          <p className="text-cyan-300">Your creative and business cockpit</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            Artist Pro
          </Badge>
          <Button variant="outline" size="sm" className="text-cyan-400 border-cyan-400/30">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 rounded-xl p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="monetization" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
            <DollarSign className="w-4 h-4 mr-2" />
            Monetization
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="artist-metric-card rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-green-400" />
                  <Badge className="bg-green-500/20 text-green-300">+12.3%</Badge>
                </div>
                <h3 className="text-2xl font-bold text-white">€{campaignData.totalRaised.toLocaleString()}</h3>
                <p className="text-green-300">Total Raised</p>
                <Progress value={(campaignData.totalRaised / campaignData.goal) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="artist-metric-card rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-blue-400" />
                  <Badge className="bg-blue-500/20 text-blue-300">+8.7%</Badge>
                </div>
                <h3 className="text-2xl font-bold text-white">{fanbaseData.total.toLocaleString()}</h3>
                <p className="text-blue-300">Total Fans</p>
              </CardContent>
            </Card>

            <Card className="artist-metric-card rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Heart className="w-8 h-8 text-pink-400" />
                  <Badge className="bg-pink-500/20 text-pink-300">+15.2%</Badge>
                </div>
                <h3 className="text-2xl font-bold text-white">87.3%</h3>
                <p className="text-pink-300">Engagement Rate</p>
              </CardContent>
            </Card>

            <Card className="artist-metric-card rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 text-purple-400" />
                  <Badge className="bg-purple-500/20 text-purple-300">Active</Badge>
                </div>
                <h3 className="text-2xl font-bold text-white">3</h3>
                <p className="text-purple-300">Active Campaigns</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="glass-effect-premium">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-cyan-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                  onClick={() => handleNewCampaign()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
                <Button 
                  variant="outline" 
                  className="border-purple-500/30 text-purple-300"
                  onClick={() => handleProfessionalInbox()}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Professional Inbox
                </Button>
                <Button variant="outline" className="border-green-500/30 text-green-300">
                  <Music className="w-4 h-4 mr-2" />
                  Upload Track
                </Button>
                <Button variant="outline" className="border-orange-500/30 text-orange-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <SmartAnalytics 
            timeframe="monthly"
            onTimeframeChange={() => {}}
          />
        </TabsContent>



        {/* Monetization Tab */}
        <TabsContent value="monetization" className="space-y-6">
          <MonetizationHub onCreateProduct={() => {}} />
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai" className="space-y-6">
          <AIInsights />
        </TabsContent>
      </Tabs>

      {/* New Campaign Modal */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Create New Campaign</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowNewCampaignModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Title</label>
                <Input 
                  type="text" 
                  placeholder="Enter campaign title"
                  className="w-full bg-slate-700 text-white border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Funding Goal (€)</label>
                <Input 
                  type="number" 
                  placeholder="50000"
                  className="w-full bg-slate-700 text-white border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Description</label>
                <Textarea 
                  placeholder="Describe your campaign and how you'll use the funds"
                  rows={4}
                  className="w-full bg-slate-700 text-white border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Duration</label>
                <Select>
                  <SelectTrigger className="w-full bg-slate-700 text-white border-gray-600">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="45">45 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowNewCampaignModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  // Handle campaign creation
                  console.log("Creating new campaign...");
                  setShowNewCampaignModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                Create Campaign
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Inbox Modal */}
      {showProfessionalInbox && (
        <ProfessionalInbox onClose={() => setShowProfessionalInbox(false)} />
      )}
    </div>
  );
}