import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider";
import { useArtists } from "@/hooks/use-artists";
import { useInvestments } from "@/hooks/use-investments";
import ArtistCard from "@/components/artist-card";
import InvestmentModal from "@/components/investment-modal";
import LoginModal from "@/components/login-modal";
import PortfolioDashboard from "@/components/portfolio-dashboard";
import LiveTicker from "@/components/live-ticker";
import AIRecommendations from "@/components/ai-recommendations";
import AdvancedSearch from "@/components/advanced-search";
import MarketInsights from "@/components/market-insights";
import NotificationSystem from "@/components/notification-system";
import FloatingActions from "@/components/floating-actions";
import PremiumDashboard from "@/components/premium-dashboard";
import ArtistDashboard from "@/components/artist-dashboard";
import SLogo from "@/components/s-logo";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuthRTK";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { user: authUser, isAuthenticated } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ id: number; username: string; email: string } | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("trending");
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isArtistUser, setIsArtistUser] = useState(false); // In real app, this would come from user context

  const { data: artists = [], isLoading } = useArtists();
  const { createInvestment } = useInvestments();

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = countryFilter === "all" || artist.country === countryFilter;
    const matchesGenre = genreFilter === "all" || artist.genre === genreFilter;
    return matchesSearch && matchesCountry && matchesGenre;
  });

  const handleLogin = (userData: { id: number; username: string; email: string }) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    toast({
      title: "Login Successful",
      description: `Welcome back, ${userData.username}!`,
    });
  };

  const handleInvestment = async (artistId: number, amount: number) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      await createInvestment.mutateAsync({
        userId: user.id,
        artistId,
        amount: amount.toString(),
      });
      
      toast({
        title: "Investment Successful",
        description: `Successfully invested $${amount} in ${selectedArtist?.name}!`,
      });
      
      setShowInvestmentModal(false);
    } catch (error) {
      toast({
        title: "Investment Failed",
        description: "There was an error processing your investment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openInvestmentModal = (artist: any) => {
    // Check if user is authenticated
    if (!isAuthenticated || !authUser) {
      setShowLoginModal(true);
      return;
    }

    // Check if user has Pro subscription for labels and investors
    if ((authUser.role === 'label' || authUser.role === 'investor') && !(authUser as any)?.isProMember) {
      toast({
        title: "Pro Subscription Required",
        description: "Pro subscription required to make investments. Please upgrade to Pro to access this feature.",
        variant: "destructive",
      });
      return;
    }

    setSelectedArtist(artist);
    setShowInvestmentModal(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + D for discover section
      if (event.altKey && event.key === 'd') {0
        event.preventDefault();
        scrollToSection('discover');
      }
      // Alt + P for portfolio section
      if (event.altKey && event.key === 'p' && isLoggedIn) {
        event.preventDefault();
        scrollToSection('portfolio');
      }
      // Alt + A for analytics section
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        scrollToSection('analytics');
      }
      // Alt + L for login
      if (event.altKey && event.key === 'l' && !isLoggedIn) {
        event.preventDefault();
        setShowLoginModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 dark:from-slate-950 dark:to-slate-900 text-white">
      {/* Live Market Ticker */}
      <LiveTicker />
      
      {/* Navigation */}
      <nav className="glass-effect-dark border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <SLogo className="animate-neon-pulse" size={32} />
              <h1 className="text-2xl font-bold gradient-text">SPARK</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('discover')}
                className="text-gray-300 hover:text-cyan-400 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-cyan-400/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                aria-label="Navigate to Discover section"
              >
                Discover
              </button>
              {isLoggedIn && (
                <button 
                  onClick={() => scrollToSection('portfolio')}
                  className="text-gray-300 hover:text-cyan-400 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-cyan-400/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  aria-label="Navigate to Portfolio section"
                >
                  Portfolio
                </button>
              )}
              <button 
                onClick={() => scrollToSection('analytics')}
                className="text-gray-300 hover:text-cyan-400 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-cyan-400/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                aria-label="Navigate to Analytics section"
              >
                Analytics
              </button>
              <button 
                onClick={() => scrollToSection('premium')}
                className="text-gray-300 hover:text-yellow-400 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-yellow-400/10 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 flex items-center space-x-2"
                aria-label="Navigate to Premium section"
              >
                <Crown className="w-4 h-4" />
                <span>Premium</span>
              </button>
              <button 
                onClick={() => scrollToSection('artist')}
                className="text-gray-300 hover:text-purple-400 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-purple-400/10 focus:outline-none focus:ring-2 focus:ring-purple-400/50 flex items-center space-x-2"
                aria-label="Navigate to Artist section"
              >
                <SLogo size={16} />
                <span>Artist Hub</span>
              </button>
            </div>
            
            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              <NotificationSystem />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:bg-cyan-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              >
                {theme === "dark" ? 
                  <Sun className="text-cyan-400" /> : 
                  <Moon className="text-cyan-400" />
                }
              </Button>
              
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="text-cyan-400">Welcome, {user?.username}</div>
                  <Button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setUser(null);
                      toast({
                        title: "Logged Out",
                        description: "You have been successfully logged out.",
                      });
                    }}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400/50"
                    aria-label="Logout from account"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-medium hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  aria-label="Open login modal"
                >
                  Login
                </Button>
              )}
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                aria-label={showMobileMenu ? "Close mobile menu" : "Open mobile menu"}
                aria-expanded={showMobileMenu}
              >
                {showMobileMenu ? <X className="text-cyan-400" /> : <Menu className="text-cyan-400" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden bg-slate-900/90 border-t border-cyan-500/20">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => { scrollToSection('discover'); setShowMobileMenu(false); }}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-cyan-400 transition-all duration-300 rounded-lg hover:bg-cyan-400/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                aria-label="Navigate to Discover section"
              >
                Discover
              </button>
              {isLoggedIn && (
                <button 
                  onClick={() => { scrollToSection('portfolio'); setShowMobileMenu(false); }}
                  className="block w-full text-left px-3 py-2 text-gray-300 hover:text-cyan-400 transition-all duration-300 rounded-lg hover:bg-cyan-400/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  aria-label="Navigate to Portfolio section"
                >
                  Portfolio
                </button>
              )}
              <button 
                onClick={() => { scrollToSection('analytics'); setShowMobileMenu(false); }}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-cyan-400 transition-all duration-300 rounded-lg hover:bg-cyan-400/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                aria-label="Navigate to Analytics section"
              >
                Analytics
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden hero-section">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Concert crowd" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <SLogo className="animate-neon-pulse" size={80} />
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 animate-neon-pulse gradient-text hero-title" style={{fontFamily: 'Inter, sans-serif'}}>
            INVEST IN MUSIC
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover emerging artists, support their journey, and earn returns from their musical success
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => scrollToSection('discover')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-semibold text-lg hover:shadow-xl hover:shadow-cyan-400/30 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              aria-label="Navigate to artist discovery section"
            >
              Start Investing
            </Button>
            <Button 
              onClick={() => isLoggedIn ? scrollToSection('portfolio') : setShowLoginModal(true)}
              variant="outline"
              className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-semibold text-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              aria-label={isLoggedIn ? "Navigate to portfolio section" : "Login to view portfolio"}
            >
              View Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio Dashboard */}
      {isLoggedIn && user && (
        <PortfolioDashboard userId={user.id} />
      )}

      {/* Artist Discovery Section */}
      <section id="discover" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4 gradient-text">Discover Artists</h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore talented musicians from around the world and invest in their future success
            </p>
          </div>
          
          {/* Quick Filter Buttons */}
          <div className="mb-6 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setGenreFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
                genreFilter === "all" 
                  ? "bg-gradient-to-r from-cyan-400 to-pink-500 text-black shadow-lg" 
                  : "bg-slate-800/60 text-gray-300 hover:bg-cyan-400/20 hover:text-cyan-400"
              }`}
              aria-label="Show all genres"
            >
              All Genres
            </button>
            {["rap", "pop", "afrobeats", "k-pop", "j-pop", "indie"].map((genre) => (
              <button
                key={genre}
                onClick={() => setGenreFilter(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
                  genreFilter === genre 
                    ? "bg-gradient-to-r from-cyan-400 to-pink-500 text-black shadow-lg" 
                    : "bg-slate-800/60 text-gray-300 hover:bg-cyan-400/20 hover:text-cyan-400"
                }`}
                aria-label={`Filter by ${genre} genre`}
              >
                {genre === "k-pop" ? "K-Pop" : genre === "j-pop" ? "J-Pop" : genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>

          {/* Advanced Filters */}
          <div className="mb-8 glass-effect-dark rounded-xl p-6 border border-cyan-500/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Advanced Search</label>
                <AdvancedSearch 
                  onSearch={setSearchTerm}
                  onFilter={(filters) => {
                    console.log('Advanced filters:', filters);
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Country</label>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger className="bg-slate-800 border-gray-600 text-white focus:border-cyan-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="france">France</SelectItem>
                    <SelectItem value="usa">USA</SelectItem>
                    <SelectItem value="nigeria">Nigeria</SelectItem>
                    <SelectItem value="southkorea">South Korea</SelectItem>
                    <SelectItem value="japan">Japan</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Genre</label>
                <Select value={genreFilter} onValueChange={setGenreFilter}>
                  <SelectTrigger className="bg-slate-800 border-gray-600 text-white focus:border-cyan-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    <SelectItem value="rap">Rap</SelectItem>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="afrobeats">Afrobeats</SelectItem>
                    <SelectItem value="k-pop">K-pop</SelectItem>
                    <SelectItem value="j-pop">J-pop</SelectItem>
                    <SelectItem value="indie">Indie Folk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Sort By</label>
                <Select value={sortFilter} onValueChange={setSortFilter}>
                  <SelectTrigger className="bg-slate-800 border-gray-600 text-white focus:border-cyan-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="funding">Funding Progress</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Filter Actions */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                {filteredArtists.length} artist{filteredArtists.length !== 1 ? 's' : ''} found
              </div>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setCountryFilter("all");
                  setGenreFilter("all");
                  setSortFilter("trending");
                }}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400/50"
                aria-label="Clear all filters"
              >
                Clear Filters
              </Button>
            </div>
          </div>
          
          {/* Artist Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading artists...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  onInvest={() => openInvestmentModal(artist)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Recommendations Section */}
      {isLoggedIn && user && (
        <section className="py-12 px-4 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <AIRecommendations 
              userId={user.id} 
              onInvest={openInvestmentModal}
            />
          </div>
        </section>
      )}

      {/* Analytics Section */}
      <section id="analytics" className="py-12 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold mb-8 text-center gradient-text">Market Analytics</h3>
          
          {/* Advanced Market Insights */}
          <div className="mb-12">
            <MarketInsights />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Investment Performance Chart */}
            <div className="glass-effect-dark rounded-xl p-6 border border-cyan-500/20">
              <h4 className="text-lg font-semibold mb-4 text-white">Investment Performance Trends</h4>
              <img 
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300" 
                alt="Investment charts and graphs" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            {/* Genre Distribution */}
            <div className="glass-effect-dark rounded-xl p-6 border border-pink-500/20">
              <h4 className="text-lg font-semibold mb-4 text-white">Investment by Genre</h4>
              <img 
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300" 
                alt="Music studio equipment" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            {/* Top Performing Artists */}
            <div className="glass-effect-dark rounded-xl p-6 border border-yellow-400/20 lg:col-span-2">
              <h4 className="text-lg font-semibold mb-4 text-white">Top Performing Artists This Month</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="Music artist" 
                    className="w-12 h-12 rounded-full object-cover" 
                  />
                  <div>
                    <p className="text-white font-semibold">Luna</p>
                    <p className="text-green-400 text-sm">+45% returns</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="Female vocalist" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-semibold">Kemi</p>
                    <p className="text-green-400 text-sm">+32% returns</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="DJ performing" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-semibold">Mia</p>
                    <p className="text-green-400 text-sm">+28% returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section id="premium" className="py-12 px-4 bg-gradient-to-br from-slate-900/50 to-yellow-900/20">
        <div className="max-w-7xl mx-auto">
          <PremiumDashboard 
            isPremiumUser={isPremiumUser}
            onUpgrade={() => {
              setIsPremiumUser(true);
              toast({
                title: "Premium Activated",
                description: "Welcome to the exclusive artist intelligence vault!",
              });
            }}
          />
        </div>
      </section>

      {/* Artist Section */}
      <section id="artist" className="py-12 px-4 bg-gradient-to-br from-slate-900/50 to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <ArtistDashboard 
            isArtistUser={isArtistUser}
            onUpgrade={() => {
              setIsArtistUser(true);
              toast({
                title: "Artist Hub Activated",
                description: "Welcome to your creative and business cockpit!",
              });
            }}
          />
        </div>
      </section>

      {/* Modals */}
      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal}
        onLogin={handleLogin}
      />
      
      <InvestmentModal
        open={showInvestmentModal}
        onOpenChange={setShowInvestmentModal}
        artist={selectedArtist}
        onInvest={handleInvestment}
        isProcessing={createInvestment.isPending}
      />

      {/* Floating Action Button */}
      <FloatingActions
        onQuickInvest={() => {
          if (artists.length > 0) {
            const randomArtist = artists[Math.floor(Math.random() * artists.length)];
            openInvestmentModal(randomArtist);
          }
        }}
        onShowSearch={() => scrollToSection('discover')}
        onShowAnalytics={() => scrollToSection('analytics')}
      />
    </div>
  );
}
