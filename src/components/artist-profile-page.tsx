import { useState, useRef, useEffect } from "react";
import { Play, Pause, MessageCircle, Heart, DollarSign, Calendar, MapPin, TrendingUp, ArrowLeft, Video, Edit3, Plus, Upload, Settings, RefreshCw, Edit, Trash2, MoreHorizontal, Image } from "lucide-react";
import SLogo from "@/components/s-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ContentUploadModal } from "./content-upload-modal";
import { useGetContentQuery } from "@/store/features/api/authApi";
import type { Artist } from "@/types/artist";
import CreateNewCampaign from "./create-new-campaign";

interface ArtistProfilePageProps {
  artist: Artist;
  onBack: () => void;
  onMessage: (artist: Artist) => void;
  onInvest: (artist: Artist) => void;
  onFollow: (artist: Artist) => void;
  isOwner?: boolean;
  onProfileUpdate?: (newData: any) => void;
}

export default function ArtistProfilePage({
  artist,
  onBack,
  onMessage,
  onInvest,
  onFollow,
  isOwner = false,
  onProfileUpdate
}: ArtistProfilePageProps) {

  const [activeTab, setActiveTab] = useState("portfolio");
  const [contentFilter, setContentFilter] = useState("all");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddContent, setShowAddContent] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showFundingSettings, setShowFundingSettings] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  
  const [profileData, setProfileData] = useState({
    name: artist.name,
    genre: artist.genre,
    description: artist.description,
    imageUrl: artist.imageUrl
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const eventTypes = [
    "Concert", "Show", "Album", "EP", "Single", "Tour", "Festival", "Live Stream",
    "Recording Session", "Music Video", "Collaboration", "Remix", "Acoustic Session",
    "DJ Set", "Opening Act", "Headliner", "Private Event", "Corporate Event",
    "Wedding", "Birthday", "Anniversary", "Launch Party", "Release Party",
    "Listening Party", "Meet & Greet", "Signing Event", "Workshop", "Masterclass",
    "Interview", "Podcast", "Radio Show", "TV Appearance", "Press Conference",
    "Photo Shoot", "Video Shoot", "Studio Session", "Rehearsal", "Sound Check",
    "Open Mic", "Battle", "Competition", "Charity Event", "Fundraiser",
    "Benefit Concert", "Autres"
  ];

  // Mock campaigns data (replacing useQuery API call)
  const mockCampaigns = [
    {
      id: 1,
      title: "Summer Album Production",
      description: "Funding needed for professional recording, mixing, and mastering of my upcoming summer album.",
      status: "active",
      currentFunding: "32500",
      fundingGoal: "50000",
      maxInvestmentDuration: "45"
    },
    {
      id: 2,
      title: "European Tour 2024",
      description: "Support my first European tour across 12 cities to connect with international fans.",
      status: "active",
      currentFunding: "18000",
      fundingGoal: "75000",
      maxInvestmentDuration: "60"
    }
  ];

  const [campaigns] = useState(mockCampaigns);
  const campaignsLoading = false;

  // Get content from API based on filter
  const getContentType = () => {
    if (contentFilter === "all") return undefined;
    if (contentFilter === "photo") return "image";
    return contentFilter as 'audio' | 'video' | 'image';
  };

  const { 
    data: contentResponse, 
    isLoading: contentLoading, 
    refetch: refetchContent 
  }:any = useGetContentQuery(getContentType() ? { type: getContentType() } : undefined);
  const contentItems:any = contentResponse?.data?.content || [];

  useEffect(() => {
    console.log('📊 Campaigns loaded:', campaigns);
  }, [campaigns]);

  // Mock refetch functions (replacing React Query)
  const refetch = () => {
    console.log('🔄 Mock refetch campaigns');
  };

  useEffect(() => {
    const handleCampaignCreated = () => {
      console.log('🔄 Nouvelle campagne détectée - rafraîchissement instantané');
      refetch();
    };

    const handleContentUploaded = () => {
      console.log('🔄 Nouveau contenu détecté - rafraîchissement instantané');
      refetchContent();
    };

    window.addEventListener('campaignCreated', handleCampaignCreated);
    window.addEventListener('contentUploaded', handleContentUploaded);

    return () => {
      window.removeEventListener('campaignCreated', handleCampaignCreated);
      window.removeEventListener('contentUploaded', handleContentUploaded);
    };
  }, []);

  // Content is already filtered by the API based on contentFilter
  const filteredContent = contentItems;

  const playAudio = (id: string, url: string) => {
    if (currentlyPlaying === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        setCurrentlyPlaying(null);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setCurrentlyPlaying(id);
      }
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow(artist);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setProfileData(prev => ({ ...prev, imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Mock API call simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Profile updated successfully');
      setShowEditProfile(false);
      
      if (onProfileUpdate) {
        onProfileUpdate(profileData);
      }

      // Update artist object directly (mock behavior)
      Object.assign(artist, {
        name: profileData.name,
        genre: profileData.genre,
        description: profileData.description,
        imageUrl: profileData.imageUrl
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error('Error saving profile:', error);
      alert("Failed to update profile");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleCampaignCreated = (campaign: any) => {
    console.log('Campaign created from profile page:', campaign);
    // Here you could add the campaign to the campaigns list or trigger a refetch
    // For now, just show success message
    alert("Campaign created successfully!");
  };


  
  const totalRaisedFromCampaigns = campaigns.reduce((sum: number, campaign: any) =>
    sum + parseFloat(campaign.currentFunding), 0
  );
  
  const totalGoalFromCampaigns = campaigns.reduce((sum: number, campaign: any) =>
    sum + parseFloat(campaign.fundingGoal), 0
  );
  
  const activeProjects = campaigns.filter((campaign: any) => campaign.status === 'active').length;
  const monthlyROI = totalGoalFromCampaigns > 0 ? (totalRaisedFromCampaigns / totalGoalFromCampaigns) * 100 : 0;

  const renderContentCard = (item: any) => {
    const displayDate = new Date(item.createdAt).toLocaleDateString();
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const fileUrl = `${backendUrl}/${item.file}`;

    switch (item.type) {
      case "audio":
        return (
          <Card key={item._id} className="bg-slate-800/70 backdrop-blur-sm border-0 rounded-2xl overflow-hidden hover:bg-slate-700/70 transition-all duration-300 shadow-lg group">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                  <SLogo className="text-white" size={24} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg leading-tight">{item.title}</h3>
                  <p className="text-gray-400 text-sm mt-1 leading-tight">{item.description || 'New single from upcoming album'}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-xs text-gray-500">{displayDate}</span>
                    {item.genre && <span className="text-xs text-purple-400 font-medium">{item.genre}</span>}
                  </div>
                  
                  {currentlyPlaying === item._id && (
                    <div className="mt-3">
                      <div className="w-full bg-slate-600/30 rounded-full h-1">
                        <div className="bg-white h-1 rounded-full transition-all duration-300" style={{ width: '45%' }} />
                      </div>
                    </div>
                  )}
                </div>
                
                {isOwner && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2">
                    <button className="w-8 h-8 rounded-full bg-slate-600/40 hover:bg-slate-500/40 text-white flex items-center justify-center transition-all">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-red-600/40 hover:bg-red-500/40 text-white flex items-center justify-center transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => playAudio(item._id, fileUrl)}
                  className="w-12 h-12 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-white flex items-center justify-center transition-all hover:scale-105 shadow-lg"
                >
                  {currentlyPlaying === item._id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
              </div>
            </CardContent>
          </Card>
        );

      case "video":
        return (
          <Card key={item._id} className="bg-slate-800/80 backdrop-blur-sm border-0 rounded-2xl overflow-hidden hover:bg-slate-700/80 transition-all duration-300 shadow-xl group">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={fileUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    // Fallback to gradient background if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hidden">
                  <Video className="w-12 h-12 text-white" />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
                  <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-lg">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </button>
                </div>
                
                {isOwner && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-white flex items-center justify-center transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-base">{item.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{item.description || 'Recording process for my latest track'}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs text-gray-500">{displayDate}</span>
                      {item.genre && <span className="text-xs text-purple-400 font-medium">{item.genre}</span>}
                    </div>
                  </div>
                  
                  {isOwner && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2 ml-2">
                      <button className="w-8 h-8 rounded-full bg-slate-600/40 hover:bg-slate-500/40 text-white flex items-center justify-center transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-red-600/40 hover:bg-red-500/40 text-white flex items-center justify-center transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "image":
        return (
          <Card key={item._id} className="bg-slate-800/80 backdrop-blur-sm border-0 rounded-2xl overflow-hidden hover:bg-slate-700/80 transition-all duration-300 shadow-xl group">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={fileUrl}
                  alt={item.title}
                  className="w-full h-64 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => window.open(fileUrl, '_blank')}
                  onError={(e) => {
                    // Fallback to gradient background if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-full h-64 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hidden">
                  <Image className="w-12 h-12 text-white" />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                
                {isOwner && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-white flex items-center justify-center transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-base">{item.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{item.description || 'Behind the scenes moment'}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs text-gray-500">{displayDate}</span>
                      {item.genre && <span className="text-xs text-purple-400 font-medium">{item.genre}</span>}
                    </div>
                  </div>
                  
                  {isOwner && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2 ml-2">
                      <button className="w-8 h-8 rounded-full bg-slate-600/40 hover:bg-slate-500/40 text-white flex items-center justify-center transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-red-600/40 hover:bg-red-500/40 text-white flex items-center justify-center transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <audio ref={audioRef} onEnded={() => setCurrentlyPlaying(null)} />
      
      <div className="h-full overflow-y-auto">
        {/* Hero Section */}
        <div className="relative h-80 overflow-hidden flex-shrink-0">
          <img 
            src={artist.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop"} 
            alt={artist.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div className="flex items-end space-x-6">
                <div className="relative">
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="group focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
                  >
                    <Avatar className="w-24 h-24 border-4 border-white/20 cursor-pointer group-hover:scale-105 transition-transform">
                      <AvatarImage 
                        src={profileData.imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"} 
                        alt={profileData.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gray-600 text-2xl">
                        {profileData.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                  
                  {isOwner && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowEditProfile(true)}
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm p-0"
                    >
                      <Edit3 className="w-4 h-4 text-white" />
                    </Button>
                  )}
                </div>
                
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{profileData.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-300">
                    <Badge className="bg-purple-500/20 text-purple-300 capitalize">
                      {profileData.genre}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span className="capitalize">{artist.country}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 mt-4">
                    <div className="text-center">
                      <div className="text-white font-bold text-lg">€{totalRaisedFromCampaigns.toLocaleString()}</div>
                      <div className="text-gray-400 text-xs">Raised</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold text-lg">{activeProjects}</div>
                      <div className="text-gray-400 text-xs">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-bold text-lg">{monthlyROI.toFixed(1)}%</div>
                      <div className="text-gray-400 text-xs">Monthly ROI</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {isOwner ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFundingSettings(true)}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-300 backdrop-blur-sm"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Funding Settings
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCreateEvent(true)}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 backdrop-blur-sm"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddContent(true)}
                      className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 backdrop-blur-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Content
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMessage(artist)}
                      className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFollow}
                      className={`backdrop-blur-sm ${
                        isFollowing
                          ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onInvest(artist)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Invest Now
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-800/50 border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-transparent h-14">
                <TabsTrigger
                  value="portfolio"
                  className="text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none bg-transparent"
                >
                  Portfolio
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none bg-transparent"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none bg-transparent"
                >
                  Events
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none bg-transparent"
                >
                  About
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="portfolio" className="mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold text-white">Artist Portfolio</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  {isOwner && (
                    <Button
                      onClick={() => setShowAddContent(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Content
                    </Button>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setContentFilter("all")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        contentFilter === "all"
                          ? 'bg-white text-black'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setContentFilter("audio")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        contentFilter === "audio"
                          ? 'bg-white text-black'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      Audio
                    </button>
                    <button
                      onClick={() => setContentFilter("video")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        contentFilter === "video"
                          ? 'bg-white text-black'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      Video
                    </button>
                    <button
                      onClick={() => setContentFilter("photo")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        contentFilter === "photo"
                          ? 'bg-white text-black'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      Photos
                    </button>
                  </div>
                </div>
              </div>

              {contentLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-gray-400 mt-4">Loading content...</p>
                </div>
              ) : filteredContent.length === 0 ? (
                <div className="text-center py-16">
                  <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {contentFilter === "all" ? "No Content Yet" : `No ${contentFilter === "photo" ? "photo" : contentFilter} content`}
                  </h3>
                  <p className="text-gray-400">
                    {isOwner
                      ? "Upload your first content to showcase your work"
                      : "This artist hasn't shared any content yet"}
                  </p>
                  {isOwner && (
                    <Button
                      onClick={() => setShowAddContent(true)}
                      className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Content
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredContent?.map(renderContentCard)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-white">Active Projects</h2>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => refetch()}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    {isOwner && (
                      <Button
                        onClick={() => setShowCreateCampaign(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Project
                      </Button>
                    )}
                  </div>
                </div>

                {campaignsLoading ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading projects...</p>
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center py-16">
                    <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
                    <p className="text-gray-400">
                      {isOwner
                        ? "Start your first project to connect with investors"
                        : "This artist hasn't created any projects yet"}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {campaigns.map((campaign: any) => (
                      <Card
                        key={`campaign-${campaign.id}`}
                        className="bg-slate-800/50 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-white mb-2">{campaign.title}</h3>
                              <p className="text-gray-300 mb-4">{campaign.description}</p>
                              
                              <div className="flex flex-wrap gap-4 mb-4">
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="w-4 h-4 text-green-400" />
                                  <span className="text-sm text-gray-300">
                                    €{parseFloat(campaign.currentFunding).toLocaleString()} / €{parseFloat(campaign.fundingGoal).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4 text-blue-400" />
                                  <span className="text-sm text-gray-300">
                                    {campaign.maxInvestmentDuration} days
                                  </span>
                                </div>
                                <Badge
                                  className={`${
                                    campaign.status === 'active'
                                      ? 'bg-green-500/20 text-green-300'
                                      : campaign.status === 'funded'
                                      ? 'bg-blue-500/20 text-blue-300'
                                      : 'bg-gray-500/20 text-gray-300'
                                  }`}
                                >
                                  {campaign.status}
                                </Badge>
                              </div>
                              
                              <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-400">Funding Progress</span>
                                  <span className="text-white">
                                    {(parseFloat(campaign.currentFunding) / parseFloat(campaign.fundingGoal) * 100).toFixed(1)}%
                                  </span>
                                </div>
                                <Progress 
                                  value={parseFloat(campaign.currentFunding) / parseFloat(campaign.fundingGoal) * 100} 
                                  className="h-2"
                                />
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-2">
                              {!isOwner && (
                                <Button
                                  onClick={() => onInvest(artist)}
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                >
                                  <DollarSign className="w-4 h-4 mr-2" />
                                  Invest Now
                                </Button>
                              )}
                              {isOwner && (
                                <Button
                                  variant="outline"
                                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                                >
                                  <Settings className="w-4 h-4 mr-2" />
                                  Manage
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Upcoming Events</h3>
                <p className="text-gray-400">Event calendar features coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="about" className="mt-0">
              <Card className="bg-slate-800/50 border border-gray-700/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">About {artist.name}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {artist.description || `${artist.name} is a talented ${artist.genre} artist from ${artist.country}. With ${artist.monthlyListeners.toLocaleString()} monthly listeners, they're making waves in the music industry with their unique sound and creative vision.`}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Stats</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Monthly Listeners</span>
                          <span className="text-white">{artist.monthlyListeners.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Funding Goal</span>
                          <span className="text-white">€{artist.fundingGoal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current Funding</span>
                          <span className="text-green-400">€{artist.currentFunding}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Expected Return</span>
                          <span className="text-purple-400">{artist.expectedReturn}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-semibold mb-2">Links</h4>
                      <div className="space-y-2">
                        {artist.streamingLinks?.spotify && (
                          <a
                            href={artist.streamingLinks.spotify}
                            className="block text-green-400 hover:text-green-300 text-sm"
                          >
                            Spotify Profile
                          </a>
                        )}
                        {artist.streamingLinks?.youtube && (
                          <a
                            href={artist.streamingLinks.youtube}
                            className="block text-red-400 hover:text-red-300 text-sm"
                          >
                            YouTube Channel
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">Edit Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Profile Photo</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="w-full p-2 bg-slate-700 text-white rounded border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Artist Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-2 bg-slate-700 text-white rounded border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                  <input
                    type="text"
                    value={profileData.genre}
                    onChange={(e) => handleInputChange('genre', e.target.value)}
                    className="w-full p-2 bg-slate-700 text-white rounded border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={profileData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full p-2 bg-slate-700 text-white rounded border border-gray-600"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-purple-500 hover:bg-purple-600"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Create Event Modal */}
        {showCreateEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">Create Event</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Name</label>
                  <Select value={eventName} onValueChange={setEventName}>
                    <SelectTrigger className="w-full bg-slate-700 text-white border-gray-600">
                      <SelectValue placeholder="Sélectionnez le type d'événement" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-gray-600">
                      {eventTypes.map((type) => (
                        <SelectItem 
                          key={type} 
                          value={type.toLowerCase()} 
                          className="text-white hover:bg-slate-600"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-2 bg-slate-700 text-white rounded border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Venue name and address"
                    className="w-full p-2 bg-slate-700 text-white rounded border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Event details"
                    rows={3}
                    className="w-full p-2 bg-slate-700 text-white rounded border border-gray-600"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateEvent(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (eventName && eventDate) {
                      console.log('Creating event:', {
                        eventName,
                        eventDate,
                        eventLocation,
                        eventDescription
                      });
                      setEventName("");
                      setEventDate("");
                      setEventLocation("");
                      setEventDescription("");
                      setShowCreateEvent(false);
                      alert("Event created successfully!");
                    } else {
                      alert('Veuillez remplir au moins le type d\'événement et la date');
                    }
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                  disabled={!eventName || !eventDate}
                >
                  Create Event
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Funding Settings Modal */}
        {showFundingSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">Funding Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Funding Goal (€)</label>
                  <input
                    type="number"
                    defaultValue={artist.fundingGoal}
                    className="w-full p-2 bg-slate-700 text-white rounded border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Expected Return (%)</label>
                  <input
                    type="text"
                    defaultValue={artist.expectedReturn}
                    placeholder="e.g., 15-25%"
                    className="w-full p-2 bg-slate-700 text-white rounded border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Risk Level</label>
                  <select
                    defaultValue={artist.riskLevel}
                    className="w-full p-2 bg-slate-700 text-white rounded border border-gray-600"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Description</label>
                  <textarea
                    placeholder="Describe how you'll use the funding"
                    rows={3}
                    className="w-full p-2 bg-slate-700 text-white rounded border border-gray-600"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowFundingSettings(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowFundingSettings(false);
                    alert("Funding settings updated successfully!");
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  Update Funding
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Create Campaign Modal */}
        {showCreateCampaign && (
          <CreateNewCampaign 
            onClose={() => setShowCreateCampaign(false)}
            onCampaignCreated={handleCampaignCreated}
          />
        )}

        {/* Content Upload Modal */}
        <ContentUploadModal
          isOpen={showAddContent}
          onClose={() => setShowAddContent(false)}
          onUploadSuccess={() => {
            refetchContent();
            window.dispatchEvent(new CustomEvent('contentUploaded'));
            console.log('✅ Contenu uploadé avec succès - rafraîchissement global');
          }}
        />
      </div>
    </div>
  );
}
