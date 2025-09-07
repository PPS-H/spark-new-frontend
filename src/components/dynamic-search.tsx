import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  Play,
  Volume2,
  Heart,
  Share,
  Users,
  Flame,
} from "lucide-react";
import SLogo from "@/components/s-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLikeDislikeContentMutation, useLikeDislikeArtistMutation, useFollowUnfollowArtistMutation, useGetUserContentSearchHistoryQuery } from "@/store/features/api/searchApi";
import type { GetTrendingContentResponse, ContentItem, Artist } from "@/store/features/api/searchApi";

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  overlay: string;
  text: string;
  textSecondary: string;
  background: string;
  backgroundSecondary: string;
}

interface SearchResult {
  id: string;
  type: "artist" | "song" | "video" | "playlist";
  title: string;
  artist: string;
  thumbnail: string;
  duration?: string;
  views?: string;
  genre?: string;
  description?: string;
  verified?: boolean;
}

interface ExtendedArtist {
  id: number;
  name: string;
  genre: string;
  country?: string;
  monthlyListeners?: number;
  streams?: number;
  revenue?: number;
  imageUrl?: string;
  description?: string;
}

export default function DynamicSearch({
  userRole,
  trendingData,
  isLoading,
  error,
  activeTab,
  onTabChange,
  onSearch,
  onSearchInputChange,
  searchInputValue,
  hasSearched,
  searchQuery: parentSearchQuery,
}: {
  userRole?: string;
  trendingData?: GetTrendingContentResponse;
  isLoading?: boolean;
  error?: any;
  activeTab: 'top' | 'songs' | 'artists';
  onTabChange: (tab: 'top' | 'songs' | 'artists') => void;
  onSearch?: (query: string) => void;
  onSearchInputChange?: (query: string) => void;
  searchInputValue?: string;
  hasSearched?: boolean;
  searchQuery?: string;
}) {
  console.log("enter here");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Like/Dislike mutations
  const [likeDislikeContent, { isLoading: isLikeDislikeContentLoading }] = useLikeDislikeContentMutation();
  const [likeDislikeArtist, { isLoading: isLikeDislikeArtistLoading }] = useLikeDislikeArtistMutation();
  const [followUnfollowArtist, { isLoading: isFollowUnfollowArtistLoading }] = useFollowUnfollowArtistMutation();

  // Search history query with debouncing
  const currentSearchValue = searchInputValue || searchQuery;
  const { data: searchHistoryData } = useGetUserContentSearchHistoryQuery(
    { search: debouncedSearchQuery },
    { skip: !debouncedSearchQuery || debouncedSearchQuery.length < 2 } // Only search when query is at least 2 characters
  );

  // Debouncing effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(currentSearchValue);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [currentSearchValue]);

  // Debug: Log when trendingData changes
  useEffect(() => {
    if (trendingData?.data && 'artists' in trendingData.data) {
      console.log("Trending artists data updated:", trendingData.data.artists);
    }
  }, [trendingData]);

  // Handle like/dislike content
  const handleLikeContent = async (contentId: string) => {
    try {
      await likeDislikeContent({ contentId }).unwrap();
      console.log("Content like/dislike toggled successfully");
    } catch (error) {
      console.error("Error toggling content like:", error);
    }
  };

  // Handle like/dislike artist
  const handleLikeArtist = async (artistId: string) => {
    try {
      await likeDislikeArtist({ artistId }).unwrap();
      console.log("Artist like/dislike toggled successfully");
    } catch (error) {
      console.error("Error toggling artist like:", error);
    }
  };

  // Handle follow/unfollow artist
  const handleFollowArtist = async (artistId: string) => {
    try {
      const result = await followUnfollowArtist({ artistId }).unwrap();
      console.log("Artist follow/unfollow toggled successfully:", result);
      console.log("Current artist data before update:", trendingData?.data);
    } catch (error) {
      console.error("Error toggling artist follow:", error);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchHistory(value.length >= 2);
    // Notify parent component about input change
    if (onSearchInputChange) {
      onSearchInputChange(value);
    }
  };

  // Handle search history item click
  const handleSearchHistoryClick = (searchTerm: string) => {
    console.log("Search history clicked:", searchTerm);
    setSearchQuery(searchTerm);
    setShowSearchHistory(false);
    // Notify parent component about input change
    if (onSearchInputChange) {
      onSearchInputChange(searchTerm);
    }
    // Focus back to input after setting the value
    setTimeout(() => {
      const input = document.querySelector('input[placeholder="Search artists, songs, videos..."]') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    const currentValue = searchInputValue || searchQuery;
    if (currentValue.length >= 2) {
      setShowSearchHistory(true);
    }
  };

  // Handle artist card click
  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`);
  };

  // Handle search input blur
  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    // Delay hiding search history to allow clicks on history items
    setTimeout(() => setShowSearchHistory(false), 300);
  };

  // Handle search input key press (Enter key)
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setShowSearchHistory(false);
      // Call the parent's search handler to trigger API call
      if (onSearch) {
        onSearch(currentSearchValue);
      }
      console.log("Search triggered with query:", currentSearchValue);
    }
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    if (tab === "Top") onTabChange("top");
    else if (tab === "Songs") onTabChange("songs");
    else if (tab === "Artists") onTabChange("artists");
  };

  // Generate dummy profile image URL
  const getDummyProfileImage = (username: string) => {
    const colors = ['purple', 'blue', 'green', 'red', 'yellow', 'pink', 'indigo', 'orange'];
    const color = colors[username.length % colors.length];
    return `https://ui-avatars.com/api/?name=${username}&background=${color}&color=fff&size=128&rounded=true`;
  };

  // Render content based on type
  const renderContent = (item: ContentItem) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const fileUrl = `${baseUrl}/${item.file}`;


    if (item.type === 'image') {
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#17153f00' }}>
          <img
            src={fileUrl}
            alt={item.title}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      );
    } else if (item.type === 'video') {
      return (
        <video
          className="w-full h-full object-cover"
          controls
          preload="metadata"
          onError={(e) => {
            console.error('Video load error:', e);
          }}
        >
          <source src={fileUrl} type="video/mp4" />
        </video>
      );
    } else if (item.type === 'audio') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col items-center justify-center relative">
          <div className="absolute top-4 left-4 flex items-center space-x-2 pointer-events-none">
            <Volume2 className="w-6 h-6 text-white/80" />
            <p className="text-sm font-medium text-white/80">{item.title}</p>
          </div>
          <audio
            className="w-4/5 h-12 z-10"
            controls
            preload="metadata"
            onError={(e) => {
              console.error('Audio load error:', e);
            }}
          >
            <source src={fileUrl} type="audio/mpeg" />
            <source src={fileUrl} type="audio/wav" />
            <source src={fileUrl} type="audio/ogg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }
    return null;
  };


  // Use prop artists or empty array
  const artists: ExtendedArtist[] = [];



  // Thème d'origine avec couleurs dynamiques
  const themeColors: ThemeColors = useMemo(() => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.random() * 20;
    const lightness = 45 + Math.random() * 15;

    return {
      primary: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      secondary: `hsl(${(hue + 30) % 360}, ${saturation - 10}%, ${
        lightness - 5
      }%)`,
      accent: `hsl(${(hue + 60) % 360}, ${saturation + 10}%, ${
        lightness + 10
      }%)`,
      gradient: `linear-gradient(135deg, hsl(${hue}, ${saturation}%, ${lightness}%) 0%, hsl(${
        (hue + 30) % 360
      }, ${saturation - 10}%, ${lightness - 5}%) 100%)`,
      overlay: `linear-gradient(to bottom, transparent 0%, hsla(${hue}, 30%, 10%, 0.8) 100%)`,
      text: `hsl(${hue}, 10%, 95%)`,
      textSecondary: `hsl(${hue}, 15%, 70%)`,
      background: `hsl(${hue}, 20%, 8%)`,
      backgroundSecondary: `hsl(${hue}, 25%, 12%)`,
    };
  }, []);

  // Appliquer le thème
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeColors).forEach(([key, value]) =>
      root.style.setProperty(`--search-${key}`, value)
    );
  }, [themeColors]);


  // Générer des résultats de recherche avec données statiques - TOUS les artistes recherchables
  const generateSearchResults = (query: string): SearchResult[] => {
    if (!query.trim()) return [];
    // Combiner toutes les sources d'artistes pour une recherche exhaustive (using mock data)
    const allArtists = [...(artists || [])];
    const results: SearchResult[] = [];

    allArtists
      .filter(
        (artist) =>
          artist.name.toLowerCase().includes(query.toLowerCase()) ||
          artist.genre.toLowerCase().includes(query.toLowerCase()) ||
          (artist.country &&
            artist.country.toLowerCase().includes(query.toLowerCase()))
      )
      .slice(0, 10) // Limite à 10 vrais artistes maximum
      .forEach((artist) => {
        results.push({
          id: `real-artist-${artist.id}-${Math.random()}`,
          type: "artist",
          title: artist.name,
          artist: artist.monthlyListeners
            ? `${artist.monthlyListeners.toLocaleString()} monthly listeners`
            : `${artist.genre} artist from ${artist.country}`,
          thumbnail: artist.imageUrl || `/api/placeholder/300/300`,
          genre: artist.genre,
          description:
            artist.description ||
            `${artist.genre} artist from ${artist.country}`,
          verified: false, // Pas de statut vérifié fictif
        });

        // SUPPRIMÉ: Plus de fausses vidéos/chansons - uniquement les vrais artistes
      });

    return results.slice(0, 20);
  };

  const searchResults = generateSearchResults(searchQuery);

  console.log("searchResults::::", searchResults);

  // Filtrer les résultats selon l'onglet actif et le rôle utilisateur
  const filteredResults = useMemo(() => {
    if (activeTab === "top") return searchResults;
    return searchResults.filter((result) => {
      switch (activeTab) {
        case "artists":
          return result.type === "artist";
        case "songs":
          return result.type === "song";
        default:
          return true;
      }
    });
  }, [searchResults, activeTab, userRole]);

  // SUPPRIMÉ: Plus de contenu fictif trending

  // Fonctions utilitaires
  const getRoleAction = () => (userRole === "investor" ? "Invest" : "Follow");

  // Tabs basés sur le rôle utilisateur
  const getRoleTabs = () => {
    return ["Top", "Songs", "Artists"];
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white">
      {/* Gradient background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${themeColors.primary} 0%, transparent 70%), radial-gradient(circle at 70% 80%, ${themeColors.secondary} 0%, transparent 70%)`,
        }}
      />

      {/* Plus de bannière temps réel */}

      {/* Header with search */}
      <div className="relative z-0 p-4 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-cyan-500/20 text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search artists, songs, videos..."
            value={searchInputValue || searchQuery}
            onChange={handleSearchInputChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onKeyPress={handleSearchKeyPress}
            className={`pl-12 pr-12 h-12 text-lg rounded-full border-2 transition-all duration-300 bg-slate-900/50 ${
              isSearchFocused ? "border-cyan-500" : "border-transparent"
            } text-white ${
              isSearchFocused ? "shadow-lg shadow-cyan-500/20" : ""
            }`}
          />
          {(searchInputValue || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                if (onSearchInputChange) {
                  onSearchInputChange("");
                }
                // Also clear the search state in parent
                if (onSearch) {
                  onSearch("");
                }
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-cyan-500/20 text-white"
            >
              ✕
            </Button>
          )}
        </div>
        {/* <Button
          variant="ghost"
          size="sm"
          className="hover:bg-white/10"
          style={{ color: themeColors.text }}
        >
          <MoreVertical className="w-5 h-5" />
        </Button> */}
      </div>

      {/* Search History Dropdown - Positioned absolutely to appear above tabs */}
      {showSearchHistory && searchHistoryData?.data?.history && searchHistoryData.data.history.length > 0 && (
        <div className="absolute top-20 left-20 right-4 z-[9999] bg-slate-900/95 backdrop-blur-sm rounded-lg border border-cyan-500/20 shadow-2xl max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-cyan-400 mb-2 px-2 font-medium">Recent searches</div>
            {searchHistoryData.data.history.map((item) => (
              <button
                key={item._id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSearchHistoryClick(item.searchTerm);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="w-full text-left px-3 py-3 hover:bg-cyan-500/10 rounded-md transition-all duration-200 flex items-center space-x-3 group cursor-pointer"
              >
                <div className="flex-shrink-0">
                  <Search className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-white text-sm font-medium group-hover:text-cyan-100">
                    {item.searchTerm}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-cyan-500/30 group-hover:bg-cyan-400/50"></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* User type badge */}
      {/* <div className="relative z-10 px-4 mb-4">
        <Badge
          className="text-xs px-3 py-1"
          style={{
            background: themeColors.gradient,
            color: themeColors.text,
            border: "none",
          }}
        >
          {getUserTypeLabel()}
        </Badge>
      </div> */}

        {/* Navigation tabs - Centered */}
        <div className="relative z-0 px-4 mb-8 flex justify-center">
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/50">
          <Tabs value={activeTab === 'top' ? 'Top' : activeTab === 'songs' ? 'Songs' : 'Artists'} onValueChange={handleTabChange} className="w-auto">
          <TabsList
              className="grid h-12 p-1 rounded-full grid-cols-3 w-auto min-w-[320px] relative overflow-hidden"
            style={{ backgroundColor: themeColors.backgroundSecondary }}
          >
            {getRoleTabs().map((tab) => {
              const isActive = (activeTab === 'top' && tab === 'Top') || 
                              (activeTab === 'songs' && tab === 'Songs') || 
                              (activeTab === 'artists' && tab === 'Artists');
              
              return (
              <TabsTrigger
                key={tab}
                value={tab}
                  className={`rounded-full text-sm font-semibold transition-all duration-300 px-6 py-2 ${
                    isActive 
                      ? 'text-white shadow-lg transform scale-105' 
                      : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                  }`}
                style={{
                    backgroundColor: isActive ? themeColors.primary : "transparent",
                    color: isActive ? themeColors.text : themeColors.textSecondary,
                    boxShadow: isActive ? `0 4px 20px ${themeColors.primary}50` : 'none',
                    border: isActive ? `2px solid ${themeColors.primary}` : '2px solid transparent',
                }}
              >
                {tab}
              </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
        </div>
      </div>

      {/* Add to music app suggestion */}
      {/* {searchQuery && (
        <div className="relative z-10 px-4 mb-4">
          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{ backgroundColor: themeColors.backgroundSecondary }}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded-sm flex items-center justify-center"
                style={{ backgroundColor: themeColors.primary }}
              >
                <SLogo size={16} />
              </div>
              <span className="text-sm" style={{ color: themeColors.text }}>
                Ajouter à une application musicale
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-white/10"
              style={{ color: themeColors.textSecondary }}
            >
              →
            </Button>
          </div>
        </div>
      )} */}

      {/* Main content */}
      <div className="relative z-0 px-4 pb-20">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading trending content...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Failed to load trending content</p>
            <p className="text-gray-500 text-sm">Please try again later</p>
          </div>
        ) : activeTab === "artists" ? (
          // Artists tab - Show artists from API
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" style={{ color: themeColors.accent }} />
              <h3 className="text-lg font-bold" style={{ color: themeColors.text }}>
                {hasSearched && parentSearchQuery ? `Search Results for "${parentSearchQuery}"` : 'Trending Artists'}
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {trendingData?.data && 'artists' in trendingData.data && trendingData.data.artists.length > 0 ? 
                trendingData.data.artists.map((artist: Artist) => {
                  console.log("Rendering artist:", artist.username, "isFollowed:", artist.isFollowed);
                  return (
                  <div 
                    key={artist._id} 
                    className="bg-gray-900 rounded-lg p-4 space-y-3 cursor-pointer"
                    onClick={() => handleArtistClick(artist._id)}
                  >
                    <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                      {(artist as any).profilePicture ? (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${(artist as any).profilePicture}`}
                          alt={artist.username}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <span 
                        className={`text-2xl font-bold text-gray-400 ${(artist as any).profilePicture ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}
                        style={{ display: (artist as any).profilePicture ? 'none' : 'flex' }}
                      >
                        {artist.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{artist.username}</h4>
                      <p className="text-gray-400 text-xs">{artist.favoriteGenre}</p>
                    </div>
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`flex-1 text-xs ${
                          artist.isLiked ? 'text-red-500 border-red-500' : 'text-gray-400'
                        }`}
                        onClick={() => handleLikeArtist(artist._id)}
                        disabled={isLikeDislikeArtistLoading}
                      >
                        <Heart className={`w-3 h-3 mr-1 ${artist.isLiked ? 'fill-current' : ''}`} />
                        Like
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`flex-1 text-xs ${
                          artist.isFollowed ? 'text-green-500 border-green-500' : 'text-gray-400'
                        }`}
                        onClick={() => handleFollowArtist(artist._id)}
                        disabled={isFollowUnfollowArtistLoading}
                      >
                        {artist.isFollowed ? 'Following' : 'Follow'}
                      </Button>
                    </div>
                  </div>
                  );
                }) : (
                  <div className="col-span-full text-center py-20">
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{ color: themeColors.text }}
                    >
                      No results found
                    </h3>
                    <p style={{ color: themeColors.textSecondary }}>
                      Try searching for different keywords
                    </p>
                  </div>
                )
              }
            </div>
          </div>
        ) : hasSearched && parentSearchQuery ? (
          // Search results
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search
                  className="w-5 h-5"
                  style={{ color: themeColors.accent }}
                />
                <h3
                  className="text-lg font-bold"
                  style={{ color: themeColors.text }}
                >
                  Search Results for "{parentSearchQuery}"
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
                {trendingData?.data && Array.isArray(trendingData.data) && trendingData.data.length > 0 ? 
                  trendingData.data.map((item: ContentItem) => (
                    <div
                      key={item._id}
                      className="rounded-lg shadow-lg overflow-hidden max-w-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/30"
                    >
                      {/* Instagram-style layout for all content types */}
                      <>
                        {/* User header */}
                        <div className="flex items-center p-3 border-b" style={{ borderColor: themeColors.primary + '20' }}>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <img 
                                src={getDummyProfileImage(item.user.username)} 
                                alt={item.user.username}
                                className="w-full h-full object-cover"
                              />
                              <AvatarFallback className="text-xs">
                                {item.user.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium" style={{ color: themeColors.text }}>
                                {item.user.username}
                              </p>
                              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                                {item.user.favoriteGenre} • {item.user.country || 'Unknown City'}
                              </p>
                      </div>
                    </div>
                        </div>

                        {/* Content area */}
                        <div className="relative" style={{ backgroundColor: '#17153f00' }}>
                          <div className="aspect-video flex items-center justify-center">
                            {renderContent(item)}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-3 border-b" style={{ borderColor: themeColors.primary + '20' }}>
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`p-2 ${
                                item.isLiked ? 'text-red-500' : 'text-gray-400'
                              }`}
                              onClick={() => handleLikeContent(item._id)}
                              disabled={isLikeDislikeContentLoading}
                            >
                              <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-current' : ''}`} />
                            </Button>
                            <span className="text-sm" style={{ color: themeColors.textSecondary }}>
                              {item.likeCount || 0} likes
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-3">
                          <h4 className="font-semibold mb-1" style={{ color: themeColors.text }}>
                          {item.title}
                        </h4>
                          <p className="text-sm mb-2" style={{ color: themeColors.textSecondary }}>
                            {item.description}
                          </p>
                          {item.genre && (
                            <Badge
                              className="text-xs rounded-full"
                              style={{
                                backgroundColor: `${themeColors.accent}40`,
                                color: "white",
                                border: `1px solid ${themeColors.accent}60`,
                              }}
                            >
                              #{item.genre}
                            </Badge>
                          )}
                      </div>
                      </>
                    </div>
                  )) : (
                    <div className="text-center py-20 col-span-full">
                      <h3
                        className="text-xl font-semibold mb-2"
                        style={{ color: themeColors.text }}
                      >
                        No results found
                      </h3>
                      <p style={{ color: themeColors.textSecondary }}>
                        Try searching for different keywords
                      </p>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        ) : !parentSearchQuery && !hasSearched ? (
          // Trending content when no search
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Flame
                  className="w-5 h-5"
                  style={{ color: themeColors.accent }}
                />
                <h3
                  className="text-lg font-bold"
                  style={{ color: themeColors.text }}
                >
                  {activeTab === 'top' ? 'Trending Now' : activeTab === 'songs' ? 'Trending Songs' : 'Trending Artists'}
                </h3>
                      </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
                {trendingData?.data && Array.isArray(trendingData.data) ? 
                  trendingData.data.map((item: ContentItem) => (
                    <div
                      key={item._id}
                      className="rounded-lg shadow-lg overflow-hidden max-w-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/30"
                    >
                      {/* Instagram-style layout for all content types */}
                      <>
                        {/* User header */}
                        <div className="flex items-center p-3 border-b" style={{ borderColor: themeColors.primary + '20' }}>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <img 
                                src={getDummyProfileImage(item.user.username)} 
                                alt={item.user.username}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-semibold">
                                {item.user.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm" style={{ color: themeColors.text }}>{item.user.username}</p>
                              <p className="text-xs" style={{ color: themeColors.textSecondary }}>{item.user.favoriteGenre} • {item.user.country || 'Unknown City'}</p>
                    </div>
                  </div>
              </div>
                        
                        {/* Content */}
                        <div className="relative aspect-video overflow-hidden">
                          {renderContent(item)}
                        </div>
                        
                        {/* Actions */}
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`p-1 ${
                                  item.isLiked ? 'text-red-500' : ''
                                }`}
                                style={{ color: item.isLiked ? '#ef4444' : themeColors.textSecondary }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLikeContent(item._id);
                                }}
                                disabled={isLikeDislikeContentLoading}
                              >
                                <Heart className={`w-6 h-6 ${item.isLiked ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
                            <div className="text-sm" style={{ color: themeColors.textSecondary }}>
                              {item.likeCount || 0} likes
                      </div>
                    </div>
                          
                          {/* Content details */}
                      <div className="space-y-1">
                            <p className="text-sm font-semibold" style={{ color: themeColors.text }}>{item.title}</p>
                            <p className="text-sm" style={{ color: themeColors.textSecondary }}>{item.description}</p>
                            <p className="text-xs" style={{ color: themeColors.textSecondary }}>{item.genre}</p>
                          </div>
                        </div>
                      </>
                    </div>
                  )) : null
                }
              </div>
            </div>
          </div>
        ) : filteredResults.length === 0 ? (
          // No results found
          <div className="text-center py-20">
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: themeColors.text }}
            >
              No results found
            </h3>
            <p style={{ color: themeColors.textSecondary }}>
              Try searching for different keywords
            </p>
          </div>
        ) : (
          // Search results
          <div className="grid grid-cols-2 gap-2">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                onClick={() => {
                  if (result.type === "artist") {
                    // Extraire l'ID de l'artiste du résultat
                    const artistId = result.id.split("-")[2]; // real-artist-{id}-{random}
                    if (artistId) {
                      // Navigation vers le profil de l'artiste
                      window.location.href = `/artist/${artistId}`;
                    }
                  }
                }}
                className="relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
                style={{ background: themeColors.gradient }}
              >
                <div className="absolute inset-0">
                  <div
                    className="absolute inset-0 animate-pulse"
                    style={{ background: themeColors.overlay }}
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Avatar className="w-8 h-8 border-2 border-white/50">
                    <AvatarFallback
                      className="text-white font-bold text-xs"
                      style={{ background: themeColors.accent }}
                    >
                      {result.artist[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute inset-0 p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    {result.duration && (
                      <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                        {result.duration}
                      </div>
                    )}
                    {result.verified && (
                      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        ✓
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    {(result.type === "video" || result.type === "song") && (
                      <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Play
                          className="w-8 h-8 text-white ml-1"
                          fill="white"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm truncate">
                          {result.title}
                        </h4>
                        <p className="text-white/80 text-xs truncate">
                          {result.artist}
                        </p>
                        {result.views && (
                          <p className="text-white/60 text-xs">
                            {result.views}
                          </p>
                        )}
                      </div>
                      <div className="ml-2">
                        {userRole === "investor" || userRole === "label" ? (
                          <Button
                            size="sm"
                            className="text-xs h-8 px-3 rounded-full"
                            style={{
                              background: themeColors.accent,
                              color: "white",
                              border: "none",
                            }}
                          >
                            {getRoleAction()}
                          </Button>
                        ) : (
                          <div className="flex flex-col items-center space-y-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(
                                  `Vous suivez maintenant ${result.artist}!`
                                );
                              }}
                            >
                              <Heart className="w-4 h-4 text-white" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 p-0"
                            >
                              <Share className="w-4 h-4 text-white" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    {result.genre && (
                      <Badge
                        className="text-xs rounded-full"
                        style={{
                          backgroundColor: `${themeColors.accent}40`,
                          color: "white",
                          border: `1px solid ${themeColors.accent}60`,
                        }}
                      >
                        #{result.genre}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating action button for artists */}
      {userRole === "artist" && (
        <div className="fixed bottom-20 right-4 z-20">
          <Button
            className="w-14 h-14 rounded-full shadow-lg"
            style={{
              background: themeColors.gradient,
              color: themeColors.text,
            }}
          >
            +
          </Button>
        </div>
      )}
    </div>
  );
}
