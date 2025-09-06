import { useState, useEffect } from "react";
import { Crown, Shield, TrendingUp, Globe, Users, MessageCircle, Handshake, Eye, DollarSign, Calendar, Target, Star, Zap, BarChart3, Map, Clock } from "lucide-react";
import SLogo from "@/components/s-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Artist } from "@/types/artist";

interface PremiumAnalytics {
  fundingRaised: number;
  fundingTimeframe: string;
  fundingCountries: { country: string; amount: number; percentage: number }[];
  audienceSegments: { segment: string; percentage: number; growth: number }[];
  totalStreams: number;
  totalViews: number;
  monthlyGrowth: number;
  projectedGrowth: number;
  engagementRate: number;
  geographicDistribution: { country: string; percentage: number; fans: number }[];
  platformData: { platform: string; streams: number; revenue: number; engagement: number }[];
  demographics: {
    age: { range: string; percentage: number }[];
    gender: { type: string; percentage: number }[];
    location: { city: string; percentage: number }[];
  };
  revenue: {
    total: number;
    platforms: { platform: string; amount: number }[];
    growth: number;
  };
  tours: {
    past: { venue: string; date: string; attendance: number; revenue: number }[];
    upcoming: { venue: string; date: string; expectedAttendance: number }[];
  };
  collaborations: { artist: string; track: string; streams: number; date: string }[];
  campaigns: { name: string; type: string; reach: number; engagement: number; roi: number }[];
}

interface PremiumDashboardProps {
  isPremiumUser: boolean;
  onUpgrade: () => void;
}

export default function PremiumDashboard({ isPremiumUser, onUpgrade }: PremiumDashboardProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [analytics, setAnalytics] = useState<PremiumAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  // Mock premium analytics data
  const generateAnalytics = (artist: Artist): PremiumAnalytics => ({
    fundingRaised: Math.floor(Math.random() * 5000000) + 100000,
    fundingTimeframe: "Last 18 months",
    fundingCountries: [
      { country: "United States", amount: 2500000, percentage: 45 },
      { country: "United Kingdom", amount: 1200000, percentage: 22 },
      { country: "Germany", amount: 800000, percentage: 14 },
      { country: "Japan", amount: 600000, percentage: 11 },
      { country: "Others", amount: 450000, percentage: 8 }
    ],
    audienceSegments: [
      { segment: "Gen Z (18-25)", percentage: 42, growth: 15 },
      { segment: "Millennials (26-35)", percentage: 35, growth: 8 },
      { segment: "Gen X (36-45)", percentage: 18, growth: 3 },
      { segment: "Boomers (45+)", percentage: 5, growth: -2 }
    ],
    totalStreams: Math.floor(Math.random() * 500000000) + 50000000,
    totalViews: Math.floor(Math.random() * 200000000) + 20000000,
    monthlyGrowth: Math.floor(Math.random() * 30) + 5,
    projectedGrowth: Math.floor(Math.random() * 50) + 20,
    engagementRate: Math.floor(Math.random() * 15) + 5,
    geographicDistribution: [
      { country: "United States", percentage: 28, fans: 14500000 },
      { country: "Brazil", percentage: 18, fans: 9200000 },
      { country: "United Kingdom", percentage: 12, fans: 6100000 },
      { country: "Germany", percentage: 10, fans: 5200000 },
      { country: "France", percentage: 8, fans: 4100000 },
      { country: "Others", percentage: 24, fans: 12300000 }
    ],
    platformData: [
      { platform: "Spotify", streams: 180000000, revenue: 450000, engagement: 92 },
      { platform: "Apple Music", streams: 95000000, revenue: 280000, engagement: 87 },
      { platform: "YouTube Music", streams: 120000000, revenue: 180000, engagement: 85 },
      { platform: "Amazon Music", streams: 45000000, revenue: 95000, engagement: 78 },
      { platform: "Deezer", streams: 25000000, revenue: 52000, engagement: 74 }
    ],
    demographics: {
      age: [
        { range: "16-24", percentage: 45 },
        { range: "25-34", percentage: 32 },
        { range: "35-44", percentage: 18 },
        { range: "45+", percentage: 5 }
      ],
      gender: [
        { type: "Female", percentage: 58 },
        { type: "Male", percentage: 40 },
        { type: "Non-binary", percentage: 2 }
      ],
      location: [
        { city: "Los Angeles", percentage: 8.5 },
        { city: "New York", percentage: 7.2 },
        { city: "London", percentage: 6.8 },
        { city: "São Paulo", percentage: 5.9 },
        { city: "Berlin", percentage: 4.3 }
      ]
    },
    revenue: {
      total: 1250000,
      platforms: [
        { platform: "Streaming", amount: 680000 },
        { platform: "Tours", amount: 420000 },
        { platform: "Merchandise", amount: 95000 },
        { platform: "Licensing", amount: 55000 }
      ],
      growth: 34
    },
    tours: {
      past: [
        { venue: "Madison Square Garden", date: "2024-03-15", attendance: 18500, revenue: 1250000 },
        { venue: "O2 Arena London", date: "2024-02-20", attendance: 16800, revenue: 980000 },
        { venue: "AccorHotels Arena", date: "2024-01-28", attendance: 15200, revenue: 850000 }
      ],
      upcoming: [
        { venue: "Coachella", date: "2025-04-15", expectedAttendance: 75000 },
        { venue: "Glastonbury", date: "2025-06-28", expectedAttendance: 85000 }
      ]
    },
    collaborations: [
      { artist: "Travis Scott", track: "Midnight Vibes", streams: 95000000, date: "2024-01-15" },
      { artist: "Dua Lipa", track: "Electric Dreams", streams: 180000000, date: "2023-11-22" },
      { artist: "The Weeknd", track: "Neon Nights", streams: 220000000, date: "2023-08-10" }
    ],
    campaigns: [
      { name: "Album Launch", type: "Social Media", reach: 25000000, engagement: 4.8, roi: 340 },
      { name: "Tour Announcement", type: "Video Ad", reach: 15000000, engagement: 6.2, roi: 280 },
      { name: "New Single Drop", type: "Influencer", reach: 8500000, engagement: 8.9, roi: 450 }
    ]
  });

  const loadArtistAnalytics = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsLoading(true);
    
    setTimeout(() => {
      setAnalytics(generateAnalytics(artist));
      setIsLoading(false);
    }, 1500);
  };

  const sendMessage = () => {
    // Simulate sending message
    console.log(`Sending message to ${selectedArtist?.name}: ${contactMessage}`);
    setShowContactModal(false);
    setContactMessage("");
  };

  if (!isPremiumUser) {
    return (
      <div className="relative overflow-hidden">
        {/* Blurred Premium Teaser */}
        <div className="backdrop-blur-md bg-slate-900/60 border border-yellow-500/30 rounded-xl p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl" />
          <div className="relative z-10 text-center">
            <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">PREMIUM ANALYTICS VAULT</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Unlock the complete artist intelligence system. Access funding data, audience insights, 
              revenue streams, tour analytics, and direct artist contact capabilities.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Funding Data</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Growth Analytics</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <MessageCircle className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Direct Contact</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <Globe className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Global Insights</p>
              </div>
            </div>
            <Button
              onClick={onUpgrade}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-8 py-3 text-lg hover:shadow-xl hover:shadow-yellow-400/30 transition-all duration-300 hover:scale-105"
            >
              Unlock Premium Access - $279/month
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-dashboard space-y-6">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Shield className="w-8 h-8 text-yellow-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">PREMIUM ANALYTICS VAULT</h2>
              <p className="text-yellow-300">Exclusive Label Intelligence System</p>
            </div>
          </div>
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">ACTIVE</Badge>
        </div>
      </div>

      {/* Artist Selection */}
      {!selectedArtist ? (
        <div className="glass-effect-dark rounded-xl p-6 border border-yellow-500/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-yellow-400" />
            Select Artist for Deep Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mock artist selection cards */}
            {["Léo", "Amara", "Kofi", "Mia", "Yuki", "Sofia"].map((name, index) => (
              <Card key={index} className="bg-slate-800/50 border-gray-700 hover:border-yellow-500/50 transition-all cursor-pointer group" onClick={() => loadArtistAnalytics({ id: index + 1, name, genre: "pop", country: "US" } as Artist)}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-${1500000000000 + index * 100000000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&crop=face`} 
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <span className="text-black font-bold hidden w-full h-full flex items-center justify-center">
                        {name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold group-hover:text-yellow-400 transition-colors">{name}</p>
                      <p className="text-gray-400 text-sm">Click for analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Artist Header */}
          <div className="glass-effect-dark rounded-xl p-6 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-xl overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&crop=face`} 
                    alt={selectedArtist.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <span className="text-black font-bold text-xl hidden w-full h-full flex items-center justify-center">
                    {selectedArtist.name[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedArtist.name}</h2>
                  <p className="text-yellow-300 capitalize">{selectedArtist.genre} • {selectedArtist.country}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowContactModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-400/25"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Artist
                </Button>
                <Button
                  onClick={() => setSelectedArtist(null)}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Back to Selection
                </Button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="glass-effect-dark rounded-xl p-12 border border-yellow-500/20 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-400 rounded-full animate-spin" />
                  <Zap className="absolute inset-0 m-auto w-6 h-6 text-yellow-400" />
                </div>
                <p className="text-white font-semibold">Accessing Deep Analytics...</p>
                <p className="text-gray-400 text-sm">Compiling comprehensive artist intelligence</p>
              </div>
            </div>
          ) : analytics && (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-slate-800 border border-gray-700">
                <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300">Overview</TabsTrigger>
                <TabsTrigger value="audience" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300">Audience</TabsTrigger>
                <TabsTrigger value="revenue" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300">Revenue</TabsTrigger>
                <TabsTrigger value="tours" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300">Tours & Events</TabsTrigger>
                <TabsTrigger value="collaborations" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300">Collaborations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-slate-800/50 border-green-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Total Funding</p>
                          <p className="text-2xl font-bold text-green-400">${(analytics.fundingRaised / 1000000).toFixed(1)}M</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-blue-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Total Streams</p>
                          <p className="text-2xl font-bold text-blue-400">{(analytics.totalStreams / 1000000).toFixed(0)}M</p>
                        </div>
                        <Music className="w-8 h-8 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Monthly Growth</p>
                          <p className="text-2xl font-bold text-purple-400">+{analytics.monthlyGrowth}%</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-orange-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Engagement</p>
                          <p className="text-2xl font-bold text-orange-400">{analytics.engagementRate}%</p>
                        </div>
                        <Star className="w-8 h-8 text-orange-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Funding Analysis */}
                <Card className="bg-slate-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Target className="w-5 h-5 mr-2 text-yellow-400" />
                      Funding Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Timeframe: {analytics.fundingTimeframe}</span>
                        <span className="text-green-400 font-semibold">${analytics.fundingRaised.toLocaleString()} raised</span>
                      </div>
                      {analytics.fundingCountries.map((country, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white">{country.country}</span>
                            <span className="text-gray-400">{country.percentage}% (${country.amount.toLocaleString()})</span>
                          </div>
                          <Progress value={country.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Platform Performance */}
                <Card className="bg-slate-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
                      Platform Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.platformData.map((platform, index) => (
                        <div key={index} className="bg-slate-700/50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-white font-semibold">{platform.platform}</h4>
                            <Badge className="bg-green-500/20 text-green-300">{platform.engagement}% engagement</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Streams</p>
                              <p className="text-white font-semibold">{(platform.streams / 1000000).toFixed(0)}M</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Revenue</p>
                              <p className="text-green-400 font-semibold">${platform.revenue.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audience" className="space-y-6">
                {/* Geographic Distribution */}
                <Card className="bg-slate-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-blue-400" />
                      Geographic Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.geographicDistribution.map((geo, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-white">{geo.country}</span>
                            <span className="text-gray-400">{geo.percentage}% ({geo.fans.toLocaleString()} fans)</span>
                          </div>
                          <Progress value={geo.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Demographics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-400" />
                        Age Demographics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics.demographics.age.map((age, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-white">{age.range}</span>
                            <span className="text-purple-400 font-semibold">{age.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Users className="w-5 h-5 mr-2 text-pink-400" />
                        Gender Split
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics.demographics.gender.map((gender, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-white">{gender.type}</span>
                            <span className="text-pink-400 font-semibold">{gender.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Audience Segments */}
                <Card className="bg-slate-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Target className="w-5 h-5 mr-2 text-yellow-400" />
                      Audience Segments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.audienceSegments.map((segment, index) => (
                        <div key={index} className="bg-slate-700/50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-semibold">{segment.segment}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-400">{segment.percentage}%</span>
                              <Badge className={segment.growth > 0 ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}>
                                {segment.growth > 0 ? "+" : ""}{segment.growth}%
                              </Badge>
                            </div>
                          </div>
                          <Progress value={segment.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="revenue" className="space-y-6">
                {/* Revenue Overview */}
                <Card className="bg-slate-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                      Revenue Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-green-400">${analytics.revenue.total.toLocaleString()}</span>
                        <Badge className="bg-green-500/20 text-green-300">+{analytics.revenue.growth}% growth</Badge>
                      </div>
                      <p className="text-gray-400">Total revenue (last 12 months)</p>
                    </div>
                    <div className="space-y-3">
                      {analytics.revenue.platforms.map((platform, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-white">{platform.platform}</span>
                          <span className="text-green-400 font-semibold">${platform.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Campaign Performance */}
                <Card className="bg-slate-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-orange-400" />
                      Campaign Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.campaigns.map((campaign, index) => (
                        <div key={index} className="bg-slate-700/50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-white font-semibold">{campaign.name}</h4>
                            <Badge className="bg-blue-500/20 text-blue-300">{campaign.type}</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Reach</p>
                              <p className="text-white font-semibold">{(campaign.reach / 1000000).toFixed(1)}M</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Engagement</p>
                              <p className="text-blue-400 font-semibold">{campaign.engagement}%</p>
                            </div>
                            <div>
                              <p className="text-gray-400">ROI</p>
                              <p className="text-green-400 font-semibold">{campaign.roi}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tours" className="space-y-6">
                {/* Past Tours */}
                <Card className="bg-slate-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                      Past Performances
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.tours.past.map((tour, index) => (
                        <div key={index} className="bg-slate-700/50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-white font-semibold">{tour.venue}</h4>
                            <span className="text-gray-400">{tour.date}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Attendance</p>
                              <p className="text-white font-semibold">{tour.attendance.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Revenue</p>
                              <p className="text-green-400 font-semibold">${tour.revenue.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Tours */}
                <Card className="bg-slate-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.tours.upcoming.map((tour, index) => (
                        <div key={index} className="bg-slate-700/50 p-4 rounded-lg border-l-4 border-yellow-400">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-white font-semibold">{tour.venue}</h4>
                            <span className="text-yellow-400">{tour.date}</span>
                          </div>
                          <div>
                            <p className="text-gray-400">Expected Attendance</p>
                            <p className="text-white font-semibold">{tour.expectedAttendance.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="collaborations" className="space-y-6">
                <Card className="bg-slate-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Handshake className="w-5 h-5 mr-2 text-purple-400" />
                      Artist Collaborations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.collaborations.map((collab, index) => (
                        <div key={index} className="bg-slate-700/50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-white font-semibold">{collab.track}</h4>
                            <span className="text-gray-400">{collab.date}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-400">with {collab.artist}</span>
                            <span className="text-green-400 font-semibold">{(collab.streams / 1000000).toFixed(0)}M streams</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-purple-400" />
              Contact {selectedArtist?.name}
            </h3>
            <textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Write your message or proposal..."
              className="w-full h-32 bg-slate-800 border border-gray-600 rounded-lg p-3 text-white resize-none"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                onClick={() => setShowContactModal(false)}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={sendMessage}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}