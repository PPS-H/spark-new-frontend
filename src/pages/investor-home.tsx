import { useState } from "react";
import { TrendingUp, DollarSign, Users, Target, Crown, Star, LogOut, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuthRTK";
import PortfolioDashboard from "@/components/portfolio-dashboard";
import AIRecommendations from "@/components/ai-recommendations";
import MarketInsights from "@/components/market-insights";
import RealTimeMetrics from "@/components/RealTimeMetrics";
import ConnectionStatus from "@/components/ConnectionStatus";
import ComprehensiveInvestorDashboard from "@/components/comprehensive-investor-dashboard";
import DirectMessaging from "@/components/direct-messaging";
import ProfessionalInbox from "@/components/professional-inbox";
import ArtistProfilePage from "@/components/artist-profile-page";
import InvestmentModal from "@/components/investment-modal";
import { useArtists } from "@/hooks/use-artists";
import type { Artist } from "@/types/artist";

export default function InvestorHome() {
  const { user, logout, isLogoutLoading }:any = useAuth();
  const { data: artists = [] } = useArtists();
  // Plus de données temps réel - système désactivé
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [activeView, setActiveView] = useState<"overview" | "analytics" | "messages" | "profile">("overview");
  const [showProfessionalInbox, setShowProfessionalInbox] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);

  const portfolioStats = [
    { label: "Portfolio Value", value: "€45,280", change: "+12.4%", icon: DollarSign, color: "text-green-400" },
    { label: "Total Investments", value: "23", change: "+3", icon: Target, color: "text-blue-400" },
    { label: "Active Artists", value: "18", change: "+2", icon: Users, color: "text-purple-400" },
    { label: "Monthly Return", value: "8.7%", change: "+1.2%", icon: TrendingUp, color: "text-cyan-400" }
  ];

  const topPerformers = [
    { name: "Zara Moon", genre: "Pop", return: "+34.2%", invested: "€2,500" },
    { name: "Kris Wave", genre: "Afrobeats", return: "+28.9%", invested: "€1,800" },
    { name: "Luna Sky", genre: "Indie", return: "+22.1%", invested: "€3,200" }
  ];

  const recentActivity = [
    { action: "Investment Return", detail: "€1,250 from Zara Moon", time: "2 hours ago", type: "profit" },
    { action: "New Investment", detail: "€800 in Kris Wave", time: "1 day ago", type: "investment" },
    { action: "Milestone Reached", detail: "Luna Sky hit 1M streams", time: "2 days ago", type: "milestone" }
  ];

  const handleInvest = (artist: any) => {
    setSelectedArtist(artist);
    setShowInvestmentModal(true);
  };

  const handleInvestmentComplete = (amount: number, method: string) => {
    console.log(`Investment completed: €${amount} via ${method} for ${selectedArtist?.name}`);
    setShowInvestmentModal(false);
    setSelectedArtist(null);
  };

  const handleMessage = (artist: any) => {
    // Open professional inbox with direct message to artist
    setShowProfessionalInbox(true);
    console.log("Messaging artist:", artist.name);
  };

  const handleViewProfile = (artist: Artist) => {
    setSelectedArtist(artist);
    setActiveView("profile");
  };

  const handleFollow = (artist: Artist) => {
    console.log("Following artist:", artist.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 pb-20">
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Plus de bannière temps réel */}
        {/* Welcome Header */}
        <div 
          className="text-center space-y-4 pt-8 rounded-2xl mx-4 sm:mx-0 p-6 sm:p-8"
          style={{
            background: 'radial-gradient(ellipse at 20% 30%, rgba(255, 107, 53, 0.4) 0%, rgba(255, 107, 53, 0.2) 30%, rgba(255, 107, 53, 0.1) 50%, rgba(0, 0, 0, 0.9) 70%, #000000 100%)'
          }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <TrendingUp className="text-cyan-400 text-3xl animate-neon-pulse" />
            <Crown className="text-yellow-400 text-2xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            WELCOME {user?.firstName?.toUpperCase() || 'INVESTOR'}
          </h1>
          <p className="text-xl text-gray-400">Your investment command center</p>
          <div className="flex items-center space-x-4">
            <Badge className="bg-cyan-500/20 text-cyan-300 px-4 py-2">
              <Crown className="w-4 h-4 mr-2" />
              Premium Investor - €279/month
            </Badge>
            <ConnectionStatus />
            <Button
              variant="outline"
              onClick={() => logout()}
              disabled={isLogoutLoading}
              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLogoutLoading ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {portfolioStats.map((stat, index) => (
            <Card key={index} className="artist-metric-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                    <div className={`text-xs ${stat.color}`}>{stat.change}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Real-Time Data Section */}
        <RealTimeMetrics className="w-full" />

        {/* Quick Actions */}
        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-cyan-400" />
              Investment Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => setActiveView("analytics")}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 h-20 flex-col"
              >
                <Target className="w-6 h-6 mb-2" />
                Deep Analytics
              </Button>
              <Button 
                onClick={() => setShowProfessionalInbox(true)}
                variant="outline" 
                className="border-green-500/30 text-green-300 h-20 flex-col hover:bg-green-500/10"
              >
                <MessageCircle className="w-6 h-6 mb-2" />
                Professional Inbox
              </Button>
              <Button variant="outline" className="border-purple-500/30 text-purple-300 h-20 flex-col">
                <Star className="w-6 h-6 mb-2" />
                AI Recommendations
              </Button>
              <Button variant="outline" className="border-yellow-500/30 text-yellow-300 h-20 flex-col">
                <DollarSign className="w-6 h-6 mb-2" />
                Withdraw Profits
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white">Top Performing Investments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{performer.name}</h3>
                    <p className="text-gray-400 text-sm">{performer.genre}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">{performer.return}</div>
                  <div className="text-gray-400 text-sm">{performer.invested} invested</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Conditional Content: Overview or Deep Analytics */}
        {activeView === "overview" ? (
          <>
            {/* Recent Activity */}
            <Card className="artist-metric-card">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'profit' ? 'bg-green-400' :
                          activity.type === 'investment' ? 'bg-blue-400' : 'bg-purple-400'
                        }`}></div>
                        <div>
                          <div className="text-white font-medium">{activity.action}</div>
                          <div className="text-gray-400 text-sm">{activity.detail}</div>
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Dashboard */}
            <div className="bg-slate-800/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-cyan-400" />
                Portfolio Overview
              </h2>
              <PortfolioDashboard userId={user?.id || 1} />
            </div>

            {/* AI Recommendations */}
            <div className="bg-slate-800/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Star className="w-6 h-6 mr-3 text-purple-400" />
                AI Investment Recommendations
              </h2>
              <AIRecommendations 
                userId={user?.id}
                onInvest={handleInvest}
                onMessage={handleMessage}
                onViewProfile={handleViewProfile}
              />
            </div>

            {/* Market Insights */}
            <div className="bg-slate-800/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
                Market Intelligence
              </h2>
              <MarketInsights />
            </div>
          </>
        ) : activeView === "analytics" ? (
          /* Deep Analytics View */
          <ComprehensiveInvestorDashboard
            selectedArtist={selectedArtist}
            onSelectArtist={setSelectedArtist}
            onBackToList={() => {
              setSelectedArtist(null);
              setActiveView("overview");
            }}
          />
        ) : activeView === "messages" ? (
          /* Messages View */
          <Card className="artist-metric-card h-[600px]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-green-400" />
                Artist Communications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <DirectMessaging userId={user?.id?.toString() || "1"} />
            </CardContent>
          </Card>
        ) : (
          /* Artist Profile View - Full Screen */
          <div></div>
        )}
      </div>

      {/* Professional Inbox Modal */}
      {showProfessionalInbox && (
        <ProfessionalInbox onClose={() => setShowProfessionalInbox(false)} />
      )}

      {/* Artist Profile Page - Full Screen Overlay */}
      {activeView === "profile" && selectedArtist && (
        <div className="fixed inset-0 z-50 bg-slate-900">
          <ArtistProfilePage
            artist={selectedArtist}
            onBack={() => setActiveView("overview")}
            onMessage={handleMessage}
            onInvest={handleInvest}
            onFollow={handleFollow}
            isOwner={false} // Investors viewing other artists' profiles
          />
        </div>
      )}

      {/* Investment Modal */}
      {selectedArtist && showInvestmentModal && (
        <InvestmentModal
          artist={selectedArtist}
          isOpen={showInvestmentModal}
          onClose={() => setShowInvestmentModal(false)}
          onInvest={handleInvestmentComplete}
        />
      )}
    </div>
  );
}