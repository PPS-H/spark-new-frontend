import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Play, 
  Heart, 
  MessageCircle, 
  DollarSign, 
  Image as ImageIcon,
  Edit,
  Camera,
  Plus
} from "lucide-react";
import InvestmentModal from "@/components/investment-modal";
import ProfessionalInbox from "@/components/professional-inbox";
import { useAuth } from "@/hooks/useAuthRTK";

interface Artist {
  id: number;
  name: string;
  username: string;
  genre: string;
  country: string;
  bio: string;
  description: string;
  image: string;
  imageUrl: string;
  stats: {
    streams: string;
    followers: string;
    revenue: string;
    growth: string;
    investmentRaised: string;
    activeProjects: number;
    roi: string;
  };
  portfolio: Array<{
    title: string;
    type: string;
    thumbnail: string;
    date: string;
    plays?: number;
    views?: number;
    likes?: number;
  }>;
  fundingGoal: number;
  currentFunding: number;
  expectedReturn: number;
  monthlyListeners: number;
  streamingLinks?: any;
}

// Mock component for real-time follower count
function RealFollowerCount({ artistId }: { artistId: string }) {
  const mockFollowers = parseInt(artistId) * 1234; // Generate based on ID
  return <span>{mockFollowers.toLocaleString()}</span>;
}

export default function ArtistProfile() {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showProfessionalInbox, setShowProfessionalInbox] = useState(false);
  const [selectedTab, setSelectedTab] = useState("portfolio");
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showBackgroundEdit, setShowBackgroundEdit] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState("");
  const [newBackgroundImage, setNewBackgroundImage] = useState("");
  const [newHeaderImage, setNewHeaderImage] = useState("");
  const [currentProfileImage, setCurrentProfileImage] = useState("");
  const [currentBackgroundImage, setCurrentBackgroundImage] = useState("");
  const [currentHeaderImage, setCurrentHeaderImage] = useState("");
  const [showHeaderEdit, setShowHeaderEdit] = useState(false);
  const { user } = useAuth();

  // Mock artists data (replacing useQuery API calls)
  const mockArtists: Artist[] = [
    {
      id: 1,
      name: "Sophia Martinez",
      username: "sophiamusic",
      genre: "Pop",
      country: "Spain",
      bio: "Pop artist from Madrid with a passion for storytelling through music.",
      description: "Pop artist from Madrid with a passion for storytelling through music.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b277?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
      imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b277?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
      stats: {
        streams: "1.2M",
        followers: "45.2K",
        revenue: "€8,500",
        growth: "+12%",
        investmentRaised: "€15,000",
        activeProjects: 3,
        roi: "8.5%"
      },
      portfolio: [
        {
          title: "Midnight Dreams",
          type: "audio",
          thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
          date: "2024-03-01",
          plays: 125000
        },
        {
          title: "Live in Madrid",
          type: "video",
          thumbnail: "https://images.unsplash.com/photo-1516575080321-4a8d13461c2e?w=400&h=400&fit=crop",
          date: "2024-02-15",
          views: 89000
        }
      ],
      fundingGoal: 50000,
      currentFunding: 15000,
      expectedReturn: 18,
      monthlyListeners: 125000
    },
    {
      id: 2,
      name: "Marcus Thompson",
      username: "marcusrb",
      genre: "R&B",
      country: "USA",
      bio: "Soulful R&B artist bringing modern vibes to classic sounds.",
      description: "Soulful R&B artist bringing modern vibes to classic sounds.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
      stats: {
        streams: "2.8M",
        followers: "62.1K",
        revenue: "€12,300",
        growth: "+18%",
        investmentRaised: "€25,000",
        activeProjects: 2,
        roi: "12.1%"
      },
      portfolio: [
        {
          title: "Soul Revival",
          type: "audio",
          thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
          date: "2024-02-28",
          plays: 187000
        }
      ],
      fundingGoal: 75000,
      currentFunding: 25000,
      expectedReturn: 22,
      monthlyListeners: 187000
    }
  ];

  // Get artist data function
  const getArtistData = (id: string) => {
    console.log('🔍 Searching for artist with ID:', id);
    console.log('📊 Available artists:', mockArtists.length);
    
    const realArtist = mockArtists.find(artist => artist.id.toString() === id);
    console.log('✅ Artist found:', realArtist?.name || 'NOT FOUND');
    
    return realArtist || null;
  };

  // Protection against undefined artistId
  if (!artistId) {
    console.log('❌ No artist ID provided, redirecting to home');
    navigate('/');
    return null;
  }

  const artist = getArtistData(artistId);
  
  console.log('🎯 FINAL CHECK - Artist ID:', artistId, 'Artist Data:', artist);
  
  // If no artist found, show error page
  if (!artist) {
    console.log('❌ ARTIST IS NULL - Showing error page');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Artiste introuvable</h1>
          <p className="text-gray-400 mb-6">L'artiste avec l'ID {artistId} n'existe pas dans la base de données.</p>
          <Button onClick={() => navigate('/')} className="bg-purple-500 hover:bg-purple-600">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }
  
  // Get current images (use updated ones if available)
  const displayProfileImage = currentProfileImage || artist.image;
  const displayBackgroundImage = currentBackgroundImage || artist.image;
  const displayHeaderImage = currentHeaderImage || artist.image;
  
  // Check if current user is the owner of this profile
  const isOwner = user?.role === 'artist' && user?._id === artist.id.toString();

  const handleProfileImageSave = () => {
    if (newProfileImage) {
      setTimeout(() => {
        setCurrentProfileImage(newProfileImage);
        setCurrentHeaderImage(newProfileImage);
        setCurrentBackgroundImage(newProfileImage);
        console.log("Updating all images with smooth transition to:", newProfileImage);
      }, 100);
      
      setShowProfileEdit(false);
      setNewProfileImage("");
    }
  };

  const handleHeaderImageSave = () => {
    if (newHeaderImage) {
      setTimeout(() => {
        setCurrentHeaderImage(newHeaderImage);
        setCurrentProfileImage(newHeaderImage);
        setCurrentBackgroundImage(newHeaderImage);
        console.log("Updating all images with smooth transition to:", newHeaderImage);
      }, 100);
      
      setShowHeaderEdit(false);
      setNewHeaderImage("");
    }
  };

  const handleBackgroundImageSave = () => {
    if (newBackgroundImage) {
      setTimeout(() => {
        setCurrentBackgroundImage(newBackgroundImage);
        setCurrentProfileImage(newBackgroundImage);
        setCurrentHeaderImage(newBackgroundImage);
        console.log("Updating all images with smooth transition to:", newBackgroundImage);
      }, 100);
      
      setShowBackgroundEdit(false);
      setNewBackgroundImage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-48">
      {/* Hero Section */}
      <div className="relative h-80 bg-gradient-to-r from-purple-900/80 to-pink-900/80 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out"
          style={{ backgroundImage: `url(${displayBackgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        {/* Header Avatar */}
        <div className="absolute top-4 left-4 z-20">
          <div className="relative">
            <img 
              src={displayHeaderImage} 
              alt={artist.name}
              className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover transition-all duration-500 ease-in-out"
            />
            {isOwner && (
              <Dialog open={showHeaderEdit} onOpenChange={setShowHeaderEdit}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="absolute -bottom-1 -right-1 rounded-full w-6 h-6 bg-purple-500 hover:bg-purple-600 shadow-lg border border-white p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Modifier Avatar du Header</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="header-url" className="text-white">URL de l'avatar du header</Label>
                      <Input
                        id="header-url"
                        value={newHeaderImage}
                        onChange={(e) => setNewHeaderImage(e.target.value)}
                        placeholder="https://example.com/header-avatar.jpg"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        Cet avatar apparaîtra dans la bannière supérieure
                      </p>
                    </div>
                    {newHeaderImage && (
                      <div className="mt-4">
                        <img 
                          src={newHeaderImage} 
                          alt="Aperçu" 
                          className="w-12 h-12 rounded-full object-cover border-2 border-purple-500 transition-all duration-300 ease-in-out"
                        />
                        <p className="text-sm text-gray-400 mt-2">Aperçu</p>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleHeaderImageSave} 
                        className="bg-purple-500 hover:bg-purple-600" 
                        disabled={!newHeaderImage}
                      >
                        Sauvegarder
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowHeaderEdit(false);
                          setNewHeaderImage("");
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto p-4 h-full flex items-end">
          <div className="flex items-center justify-between w-full mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {isOwner && (
              <Dialog open={showBackgroundEdit} onOpenChange={setShowBackgroundEdit}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white hover:bg-white/20 bg-black/50 backdrop-blur-sm border border-white/20"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier Fond
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Modifier Image de Fond</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="background-url" className="text-white">URL de la nouvelle image de fond</Label>
                      <Input
                        id="background-url"
                        value={newBackgroundImage}
                        onChange={(e) => setNewBackgroundImage(e.target.value)}
                        placeholder="https://example.com/background.jpg"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    {newBackgroundImage && (
                      <div className="mt-4">
                        <img 
                          src={newBackgroundImage} 
                          alt="Aperçu" 
                          className="w-32 h-20 object-cover rounded border-2 border-purple-500 transition-all duration-300 ease-in-out"
                        />
                        <p className="text-sm text-gray-400 mt-2">Aperçu</p>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleBackgroundImageSave} 
                        className="bg-purple-500 hover:bg-purple-600"
                        disabled={!newBackgroundImage}
                      >
                        Sauvegarder
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowBackgroundEdit(false);
                          setNewBackgroundImage("");
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {/* Artist Info */}
      <div className="max-w-7xl mx-auto p-4 -mt-16 relative z-20">
        <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <div className="relative">
            <button 
              onClick={() => setShowProfileEdit(true)}
              className="group relative focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full"
            >
              <img 
                src={displayProfileImage} 
                alt={artist.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover transition-all duration-500 ease-in-out group-hover:scale-105 cursor-pointer"
              />
            </button>
            {isOwner && (
              <Dialog open={showProfileEdit} onOpenChange={setShowProfileEdit}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 rounded-full w-12 h-12 bg-purple-500 hover:bg-purple-600 shadow-lg border-2 border-white"
                  >
                    <Camera className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Modifier Photo de Profil</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="profile-url" className="text-white">URL de la nouvelle photo</Label>
                      <Input
                        id="profile-url"
                        value={newProfileImage}
                        onChange={(e) => setNewProfileImage(e.target.value)}
                        placeholder="https://example.com/profile.jpg"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        Cette photo sera utilisée pour l'image de profil principale
                      </p>
                    </div>
                    {newProfileImage && (
                      <div className="mt-4">
                        <img 
                          src={newProfileImage} 
                          alt="Aperçu" 
                          className="w-20 h-20 rounded-full object-cover border-2 border-purple-500 transition-all duration-300 ease-in-out"
                        />
                        <p className="text-sm text-gray-400 mt-2">Aperçu</p>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleProfileImageSave} 
                        className="bg-purple-500 hover:bg-purple-600" 
                        disabled={!newProfileImage}
                      >
                        Sauvegarder
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowProfileEdit(false);
                          setNewProfileImage("");
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{artist.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <Badge className="bg-purple-500/20 text-purple-400">{artist.genre}</Badge>
              <Badge className="bg-blue-500/20 text-blue-400">{artist.country}</Badge>
            </div>
            <p className="text-gray-300 mb-4">{artist.bio}</p>
            
            {/* Stats Row */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
              <div className="text-center">
                <p className="text-white font-semibold">{artist.stats.streams}</p>
                <p className="text-gray-400 text-sm">Streams</p>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold" id="follower-count">
                  <RealFollowerCount artistId={artistId} />
                </p>
                <p className="text-gray-400 text-sm">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-green-400 font-semibold">{artist.stats.revenue}</p>
                <p className="text-gray-400 text-sm">Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">{artist.stats.investmentRaised}</p>
                <p className="text-gray-400 text-sm">Raised</p>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">{artist.stats.activeProjects}</p>
                <p className="text-gray-400 text-sm">Projects</p>
              </div>
              <div className="text-center">
                <p className="text-cyan-400 font-semibold">{artist.stats.roi}</p>
                <p className="text-gray-400 text-sm">ROI</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            {!isOwner ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (user?.role === 'fan') {
                      alert("Les messages sont réservés aux membres premium (Artiste, Investisseur, Label). Mettez à niveau votre compte pour débloquer cette fonctionnalité!");
                    } else {
                      setShowProfessionalInbox(true);
                    }
                  }}
                  className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
                  onClick={() => {
                    // Mock follow functionality
                    const newFollowerCount = parseInt(artistId) * 1234 + 1;
                    const followerElement = document.getElementById('follower-count');
                    if (followerElement) {
                      followerElement.textContent = newFollowerCount.toLocaleString();
                    }
                    alert(`Vous suivez maintenant ${artist.name}! (${newFollowerCount.toLocaleString()} followers)`);
                  }}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Follow
                </Button>
                <Button 
                  onClick={() => {
                    console.log("User role:", user?.role);
                    if (user?.role === 'fan') {
                      alert("L'investissement est réservé aux Investisseurs et Labels. Créez un compte Investisseur pour commencer à investir!");
                      return;
                    }
                    if (user?.role === 'investor' || user?.role === 'label') {
                      setShowInvestmentModal(true);
                    } else {
                      alert("L'investissement est réservé aux Investisseurs et Labels. Créez un compte Investisseur pour commencer à investir!");
                    }
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Invest Now
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Manage Profile
              </Button>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto bg-slate-800 border-slate-700">
            <TabsTrigger value="portfolio" className="text-white">Portfolio</TabsTrigger>
            <TabsTrigger value="projects" className="text-white">Projects</TabsTrigger>
            <TabsTrigger value="events" className="text-white">Events</TabsTrigger>
            <TabsTrigger value="about" className="text-white">About</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-4 pb-16">
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Artist Portfolio</h2>
                {isOwner && (
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="border-gray-500 text-gray-400 flex-shrink-0">All</Button>
                <Button variant="outline" size="sm" className="border-gray-500 text-gray-400 flex-shrink-0">Audio</Button>
                <Button variant="outline" size="sm" className="border-gray-500 text-gray-400 flex-shrink-0">Video</Button>
                <Button variant="outline" size="sm" className="border-gray-500 text-gray-400 flex-shrink-0">Photos</Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artist.portfolio.map((item, index) => (
                <Card key={index} className="bg-slate-800 border-slate-700 hover:scale-105 transition-all duration-300 group">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.type === "audio" && <Play className="w-12 h-12 text-white" />}
                        {item.type === "video" && <Play className="w-12 h-12 text-white" />}
                        {item.type === "image" && <ImageIcon className="w-12 h-12 text-white" />}
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className={`${
                          item.type === "audio" ? "bg-green-500/20 text-green-400" :
                          item.type === "video" ? "bg-blue-500/20 text-blue-400" :
                          "bg-purple-500/20 text-purple-400"
                        }`}>
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      <span>
                        {"plays" in item && `${item.plays} plays`}
                        {"views" in item && `${item.views} views`}
                        {"likes" in item && `${item.likes} likes`}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4 pb-24">
            <h2 className="text-2xl font-bold text-white mb-4">Active Projects</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">New Album Production</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">Working on a 12-track album with collaborators from around the world.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">75%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Extra bottom spacing to ensure content is not hidden behind navigation */}
            <div className="h-20"></div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4 pb-16">
            <h2 className="text-2xl font-bold text-white mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">Live Concert - Madrid</h3>
                      <p className="text-gray-400">Sala Apolo, Madrid</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">March 15, 2024</p>
                      <p className="text-gray-400">20:00 CET</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-4 pb-16">
            <h2 className="text-2xl font-bold text-white mb-4">About {artist.name}</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed">
                  {artist.bio} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Investment Modal */}
      {showInvestmentModal && (
        <InvestmentModal 
          artist={{
            id: artist.id,
            name: artist.name,
            genre: artist.genre,
            country: artist.country,
            description: artist.description,
            monthlyListeners: artist.monthlyListeners,
            fundingGoal: artist.fundingGoal.toString(),
            currentFunding: artist.currentFunding.toString(),
            expectedReturn: artist.expectedReturn.toString(),
            imageUrl: artist.imageUrl,
            isActive: true,
            isLiked: false,
            isFollowed: false
          }}
          isOpen={showInvestmentModal}
          onClose={() => setShowInvestmentModal(false)}
          onInvest={(amount, method) => {
            console.log(`Mock investment: ${amount} via ${method}`);
            setShowInvestmentModal(false);
          }}
        />
      )}

      {/* Professional Inbox Modal */}
      {showProfessionalInbox && (
        <ProfessionalInbox onClose={() => setShowProfessionalInbox(false)} />
      )}
    </div>
  );
}
