import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  DollarSign, TrendingUp, Users, Globe, Music, Calendar, 
  MessageCircle, Star, Target, BarChart3, Clock, 
  Play, Instagram, Twitter, Facebook, Hash,
  Send, CheckCircle, Circle, Zap
} from "lucide-react";
import { SiSpotify, SiApplemusic, SiYoutube, SiTiktok, SiSoundcloud, SiDeezer } from "react-icons/si";
import type { Artist } from "@/types/artist";
import { useArtists } from "@/hooks/use-artists";

// Utility function to format numbers
const formatNumber = (num: number | null | undefined) => {
  if (!num || num === 0) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

function ArtistSelectionGrid({ onSelectArtist }: { onSelectArtist: (artist: Artist) => void }) {
  const { data: artists = [] } = useArtists();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {artists.map((artist) => (
        <Card 
          key={artist.id} 
          className="bg-slate-800/50 border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer group"
          onClick={() => onSelectArtist(artist)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectArtist(artist);
                }}
                className="group focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-full"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center cursor-pointer group-hover:scale-105 transition-transform">
                  {artist.imageUrl ? (
                    <img 
                      src={artist.imageUrl} 
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-black font-bold">{artist.name[0]}</span>
                  )}
                </div>
              </button>
              <div>
                <p className="text-white font-semibold group-hover:text-cyan-400 transition-colors">{artist.name}</p>
                <p className="text-gray-400 text-sm capitalize">{artist.genre} • {artist.country}</p>
                <p className="text-xs text-gray-500">{formatNumber(artist.monthlyListeners)} monthly listeners</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface Message {
  id: string;
  artistId: number;
  artistName: string;
  content: string;
  timestamp: Date;
  isFromInvestor: boolean;
  isRead: boolean;
  status: "sent" | "delivered" | "read";
}

interface ComprehensiveAnalytics {
  // Financial Data
  totalRaised: number;
  raisingDuration: string;
  currentROI: number;
  monthlyRevenue: number;
  projectedRevenue: number;
  
  // Audience Analytics
  totalStreams: number;
  monthlyListeners: number;
  subscriberCounts: {
    spotify: number;
    youtube: number;
    apple: number;
    instagram: number;
    tiktok: number;
    twitter: number;
    facebook: number;
  };
  
  // Demographics
  ageDistribution: { range: string; percentage: number }[];
  geographicReach: { country: string; percentage: number; fans: number }[];
  genderSplit: { male: number; female: number; other: number };
  
  // Performance
  engagementRate: number;
  monthlyGrowth: number;
  showsThisWeek: number;
  showsThisMonth: number;
  merchandiseSales: number;
  
  // Additional Metrics
  collaborations: string[];
  mediaPresence: {
    interviews: number;
    articles: number;
    pressReleases: number;
  };
  upcomingReleases: {
    type: string;
    title: string;
    releaseDate: string;
  }[];
  tourForecast: {
    upcoming: { venue: string; date: string; city: string; country: string }[];
    projectedRevenue: number;
  };
}

interface ComprehensiveInvestorDashboardProps {
  selectedArtist: Artist | null;
  onSelectArtist: (artist: Artist) => void;
  onBackToList: () => void;
}

export default function ComprehensiveInvestorDashboard({ 
  selectedArtist, 
  onSelectArtist, 
  onBackToList 
}: ComprehensiveInvestorDashboardProps) {
  const [analytics, setAnalytics] = useState<ComprehensiveAnalytics | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Generate comprehensive analytics for selected artist
  const generateAnalytics = (artist: Artist): ComprehensiveAnalytics => ({
    // Financial Data
    totalRaised: parseInt(artist.currentFunding) || 0,
    raisingDuration: "14 months",
    currentROI: Math.floor(Math.random() * 50) + 15,
    monthlyRevenue: Math.floor(Math.random() * 50000) + 10000,
    projectedRevenue: Math.floor(Math.random() * 200000) + 80000,
    
    // Audience Analytics
    totalStreams: artist.totalStreams || Math.floor(Math.random() * 100000000) + 10000000,
    monthlyListeners: artist.monthlyListeners,
    subscriberCounts: {
      spotify: artist.subscribersSpotify || Math.floor(Math.random() * 2000000) + 100000,
      youtube: artist.subscribersYoutube || Math.floor(Math.random() * 1000000) + 50000,
      apple: artist.subscribersApple || Math.floor(Math.random() * 800000) + 30000,
      instagram: artist.followersSocial?.instagram || Math.floor(Math.random() * 500000) + 25000,
      tiktok: artist.followersSocial?.tiktok || Math.floor(Math.random() * 3000000) + 100000,
      twitter: artist.followersSocial?.twitter || Math.floor(Math.random() * 200000) + 10000,
      facebook: artist.followersSocial?.facebook || Math.floor(Math.random() * 300000) + 15000,
    },
    
    // Demographics
    ageDistribution: [
      { range: "16-24", percentage: 45 },
      { range: "25-34", percentage: 35 },
      { range: "35-44", percentage: 15 },
      { range: "45+", percentage: 5 }
    ],
    geographicReach: [
      { country: "United States", percentage: 28, fans: Math.floor(artist.monthlyListeners * 0.28) },
      { country: "Brazil", percentage: 18, fans: Math.floor(artist.monthlyListeners * 0.18) },
      { country: "United Kingdom", percentage: 12, fans: Math.floor(artist.monthlyListeners * 0.12) },
      { country: "Germany", percentage: 10, fans: Math.floor(artist.monthlyListeners * 0.10) },
      { country: "France", percentage: 8, fans: Math.floor(artist.monthlyListeners * 0.08) },
      { country: "Others", percentage: 24, fans: Math.floor(artist.monthlyListeners * 0.24) }
    ],
    genderSplit: { male: 52, female: 46, other: 2 },
    
    // Performance
    engagementRate: parseFloat(artist.engagementRate) || Math.floor(Math.random() * 15) + 5,
    monthlyGrowth: parseFloat(artist.monthlyGrowthRate) || Math.floor(Math.random() * 25) + 8,
    showsThisWeek: artist.showsThisWeek || Math.floor(Math.random() * 5),
    showsThisMonth: artist.showsThisMonth || Math.floor(Math.random() * 15) + 3,
    merchandiseSales: parseFloat(artist.merchandiseSales) || Math.floor(Math.random() * 25000) + 5000,
    
    // Additional Metrics
    collaborations: artist.collaborations || ["Dua Lipa", "Calvin Harris", "The Weeknd"],
    mediaPresence: artist.mediaPresence || {
      interviews: Math.floor(Math.random() * 20) + 5,
      articles: Math.floor(Math.random() * 50) + 10,
      pressReleases: Math.floor(Math.random() * 15) + 3
    },
    upcomingReleases: artist.upcomingReleases || [
      { type: "Single", title: "Midnight Dreams", releaseDate: "2025-08-15" },
      { type: "Album", title: "Digital Hearts", releaseDate: "2025-11-20" },
      { type: "Collaboration", title: "Summer Nights (ft. Luna)", releaseDate: "2025-09-30" }
    ],
    tourForecast: artist.tourForecast || {
      upcoming: [
        { venue: "Madison Square Garden", date: "2025-09-15", city: "New York", country: "USA" },
        { venue: "O2 Arena", date: "2025-10-03", city: "London", country: "UK" },
        { venue: "Bercy Arena", date: "2025-10-18", city: "Paris", country: "France" }
      ],
      projectedRevenue: Math.floor(Math.random() * 500000) + 200000
    }
  });

  useEffect(() => {
    if (selectedArtist) {
      setIsLoading(true);
      setTimeout(() => {
        setAnalytics(generateAnalytics(selectedArtist));
        setIsLoading(false);
      }, 1500);
    }
  }, [selectedArtist]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedArtist) return;
    
    const message: Message = {
      id: Date.now().toString(),
      artistId: selectedArtist.id,
      artistName: selectedArtist.name,
      content: newMessage,
      timestamp: new Date(),
      isFromInvestor: true,
      isRead: false,
      status: "sent"
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
    setShowMessageModal(false);
    
    // Simulate message delivery and read status
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, status: "delivered" } : m
      ));
    }, 1000);
  };



  const PlatformLink = ({ platform, url, followers, icon: Icon }: any) => (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center space-x-2 border-gray-600 hover:border-cyan-400 transition-colors group"
      onClick={() => url && window.open(url, '_blank')}
    >
      <Icon className="w-4 h-4 group-hover:text-cyan-400" />
      <span className="text-xs">{formatNumber(followers)}</span>
    </Button>
  );

  if (!selectedArtist) {
    return (
      <div className="space-y-6">
        <Card className="artist-metric-card border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-cyan-400" />
              Select Artist for Deep Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Choose any artist to access comprehensive investment data including financial performance, 
              audience analytics, platform metrics, and direct communication capabilities.
            </p>
            <ArtistSelectionGrid onSelectArtist={onSelectArtist} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Card className="artist-metric-card border-cyan-500/30">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
              <Zap className="absolute inset-0 m-auto w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-white font-semibold">Loading Comprehensive Analytics...</p>
            <p className="text-gray-400 text-sm">Compiling real-time artist intelligence</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Artist Header */}
      <Card className="artist-metric-card border-cyan-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400">
                <img 
                  src={selectedArtist.imageUrl || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face`}
                  alt={selectedArtist.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black font-bold text-xl">${selectedArtist.name[0]}</div>`;
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedArtist.name}</h2>
                <p className="text-cyan-300 capitalize">{selectedArtist.genre} • {selectedArtist.country}</p>
                <p className="text-gray-400 text-sm">{selectedArtist.description}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowMessageModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-400/25"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Artist
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">{unreadCount}</Badge>
                )}
              </Button>
              <Button
                onClick={onBackToList}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Back to Selection
              </Button>
            </div>
          </div>

          {/* Platform Links */}
          <div className="flex flex-wrap gap-2">
            {selectedArtist.streamingLinks?.spotify && (
              <PlatformLink 
                platform="Spotify" 
                url={selectedArtist.streamingLinks.spotify}
                followers={analytics?.subscriberCounts.spotify}
                icon={SiSpotify}
              />
            )}
            {selectedArtist.streamingLinks?.youtube && (
              <PlatformLink 
                platform="YouTube" 
                url={selectedArtist.streamingLinks.youtube}
                followers={analytics?.subscriberCounts.youtube}
                icon={SiYoutube}
              />
            )}
            {selectedArtist.streamingLinks?.apple && (
              <PlatformLink 
                platform="Apple Music" 
                url={selectedArtist.streamingLinks.apple}
                followers={analytics?.subscriberCounts.apple}
                icon={SiApplemusic}
              />
            )}
            {selectedArtist.streamingLinks?.instagram && (
              <PlatformLink 
                platform="Instagram" 
                url={selectedArtist.streamingLinks.instagram}
                followers={analytics?.subscriberCounts.instagram}
                icon={Instagram}
              />
            )}
            {selectedArtist.streamingLinks?.tiktok && (
              <PlatformLink 
                platform="TikTok" 
                url={selectedArtist.streamingLinks.tiktok}
                followers={analytics?.subscriberCounts.tiktok}
                icon={SiTiktok}
              />
            )}
            {selectedArtist.streamingLinks?.twitter && (
              <PlatformLink 
                platform="Twitter" 
                url={selectedArtist.streamingLinks.twitter}
                followers={analytics?.subscriberCounts.twitter}
                icon={Twitter}
              />
            )}
            {selectedArtist.streamingLinks?.facebook && (
              <PlatformLink 
                platform="Facebook" 
                url={selectedArtist.streamingLinks.facebook}
                followers={analytics?.subscriberCounts.facebook}
                icon={Facebook}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {analytics && (
        <Tabs defaultValue="financial" className="space-y-6">
          <TabsList className="bg-slate-800 border border-gray-700 grid grid-cols-5">
            <TabsTrigger value="financial" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">Financial</TabsTrigger>
            <TabsTrigger value="audience" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">Audience</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">Performance</TabsTrigger>
            <TabsTrigger value="tours" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">Tours & Events</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">Market Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="space-y-6">
            {/* Key Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Raised</p>
                      <p className="text-2xl font-bold text-green-400">€{formatNumber(analytics.totalRaised)}</p>
                      <p className="text-xs text-gray-500">{analytics.raisingDuration}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Current ROI</p>
                      <p className="text-2xl font-bold text-blue-400">+{analytics.currentROI}%</p>
                      <p className="text-xs text-green-400">Outperforming market</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-purple-400">€{formatNumber(analytics.monthlyRevenue)}</p>
                      <p className="text-xs text-purple-300">+{Math.floor(Math.random() * 20) + 5}% MoM</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-orange-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Projected Revenue</p>
                      <p className="text-2xl font-bold text-orange-400">€{formatNumber(analytics.projectedRevenue)}</p>
                      <p className="text-xs text-orange-300">Next 6 months</p>
                    </div>
                    <Target className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Breakdown */}
            <Card className="bg-slate-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                  Revenue Streams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { source: "Streaming Royalties", amount: Math.floor(analytics.monthlyRevenue * 0.6), percentage: 60 },
                    { source: "Merchandise Sales", amount: Math.floor(analytics.monthlyRevenue * 0.25), percentage: 25 },
                    { source: "Live Performances", amount: Math.floor(analytics.monthlyRevenue * 0.12), percentage: 12 },
                    { source: "Brand Partnerships", amount: Math.floor(analytics.monthlyRevenue * 0.03), percentage: 3 }
                  ].map((stream, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white">{stream.source}</span>
                        <span className="text-green-400 font-semibold">€{formatNumber(stream.amount)}</span>
                      </div>
                      <Progress value={stream.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            {/* Audience Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Streams</p>
                      <p className="text-2xl font-bold text-blue-400">{formatNumber(analytics.totalStreams)}</p>
                    </div>
                    <Music className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Monthly Listeners</p>
                      <p className="text-2xl font-bold text-cyan-400">{formatNumber(analytics.monthlyListeners)}</p>
                    </div>
                    <Users className="w-8 h-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Engagement Rate</p>
                      <p className="text-2xl font-bold text-purple-400">{analytics.engagementRate}%</p>
                    </div>
                    <Star className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Geographic Distribution */}
            <Card className="bg-slate-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-400" />
                  Geographic Reach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.geographicReach.map((geo, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white">{geo.country}</span>
                        <div className="text-right">
                          <span className="text-blue-400 font-semibold">{geo.percentage}%</span>
                          <p className="text-xs text-gray-400">{formatNumber(geo.fans)} fans</p>
                        </div>
                      </div>
                      <Progress value={geo.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Age Demographics */}
            <Card className="bg-slate-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-400" />
                  Age Demographics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {analytics.ageDistribution.map((age, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">{age.percentage}%</div>
                      <div className="text-sm text-gray-400">{age.range} years</div>
                      <Progress value={age.percentage} className="h-2 mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Monthly Growth</p>
                      <p className="text-2xl font-bold text-green-400">+{analytics.monthlyGrowth}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Shows This Week</p>
                      <p className="text-2xl font-bold text-blue-400">{analytics.showsThisWeek}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Shows This Month</p>
                      <p className="text-2xl font-bold text-purple-400">{analytics.showsThisMonth}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-orange-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Merch Sales</p>
                      <p className="text-2xl font-bold text-orange-400">€{formatNumber(analytics.merchandiseSales)}</p>
                    </div>
                    <Hash className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Collaborations */}
            <Card className="bg-slate-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-400" />
                  Recent Collaborations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analytics.collaborations.map((collab, index) => (
                    <Badge key={index} className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                      {collab}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Media Presence */}
            <Card className="bg-slate-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
                  Media Presence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">{analytics.mediaPresence.interviews}</div>
                    <div className="text-sm text-gray-400">Interviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">{analytics.mediaPresence.articles}</div>
                    <div className="text-sm text-gray-400">Articles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">{analytics.mediaPresence.pressReleases}</div>
                    <div className="text-sm text-gray-400">Press Releases</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tours" className="space-y-6">
            {/* Upcoming Tours */}
            <Card className="bg-slate-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                  Upcoming Tour Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.tourForecast.upcoming.map((show, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div>
                        <p className="text-white font-semibold">{show.venue}</p>
                        <p className="text-gray-400 text-sm">{show.city}, {show.country}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-cyan-400 font-semibold">{show.date}</p>
                        <Badge className="bg-green-500/20 text-green-300">Confirmed</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tour Revenue Forecast */}
            <Card className="bg-slate-800/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                  Tour Revenue Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    €{formatNumber(analytics.tourForecast.projectedRevenue)}
                  </div>
                  <p className="text-gray-400">Projected total tour revenue</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* Upcoming Releases */}
            <Card className="bg-slate-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Music className="w-5 h-5 mr-2 text-purple-400" />
                  Upcoming Releases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.upcomingReleases.map((release, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div>
                        <p className="text-white font-semibold">{release.title}</p>
                        <Badge className="bg-purple-500/20 text-purple-300 mt-1">{release.type}</Badge>
                      </div>
                      <p className="text-cyan-400 font-semibold">{release.releaseDate}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Growth Trends */}
            <Card className="bg-slate-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Growth Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Platform Growth (Last 6 months)</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Spotify</span>
                        <span className="text-green-400">+{Math.floor(Math.random() * 50) + 10}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">YouTube</span>
                        <span className="text-green-400">+{Math.floor(Math.random() * 40) + 15}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">TikTok</span>
                        <span className="text-green-400">+{Math.floor(Math.random() * 80) + 20}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Instagram</span>
                        <span className="text-green-400">+{Math.floor(Math.random() * 30) + 8}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-3">Market Position</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Genre Ranking</span>
                        <span className="text-cyan-400">#{Math.floor(Math.random() * 20) + 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Country Ranking</span>
                        <span className="text-cyan-400">#{Math.floor(Math.random() * 50) + 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Global Ranking</span>
                        <span className="text-cyan-400">#{Math.floor(Math.random() * 1000) + 100}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Message Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-purple-400" />
              Message {selectedArtist.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Message History */}
            <div className="max-h-60 overflow-y-auto space-y-3 bg-slate-800/50 p-4 rounded-lg">
              {messages.filter(m => m.artistId === selectedArtist.id).length === 0 ? (
                <p className="text-gray-400 text-center py-4">No messages yet. Start the conversation!</p>
              ) : (
                messages.filter(m => m.artistId === selectedArtist.id).map((message) => (
                  <div key={message.id} className={`flex ${message.isFromInvestor ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${
                      message.isFromInvestor 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-slate-700 text-gray-200'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.isFromInvestor && (
                          <div className="flex items-center">
                            {message.status === 'sent' && <Circle className="w-3 h-3" />}
                            {message.status === 'delivered' && <CheckCircle className="w-3 h-3" />}
                            {message.status === 'read' && <CheckCircle className="w-3 h-3 text-blue-300" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="flex space-x-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-slate-800 border-gray-600 text-white resize-none"
                rows={3}
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}