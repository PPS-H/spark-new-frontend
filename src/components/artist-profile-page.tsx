import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Calendar, MapPin, TrendingUp, ArrowLeft, Video, Plus, Upload, Trash2, Image, ChevronLeft, ChevronRight, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { ContentUploadModal } from "./content-upload-modal";
import { useGetContentQuery, useDeleteContentMutation } from "@/store/features/api/authApi";
import { useGetAllProjectsQuery } from "@/store/features/api/labelApi";
import { useUpdateProjectMutation } from "@/store/features/api/projectApi";
import { useFollowUnfollowArtistMutation } from "@/store/features/api/searchApi";
import { useAuth } from "@/hooks/useAuthRTK";
import { useToast } from "@/hooks/use-toast";
import type { Artist } from "@/types/artist";
import CreateNewCampaign from "./create-new-campaign";

interface ArtistProfilePageProps {
  artist: Artist;
  onBack: () => void;
  onFollow: (artist: Artist) => void;
  isOwner?: boolean;
  onProfileUpdate?: (newData: any) => void;
}

export default function ArtistProfilePage({
  artist,
  onBack,
  onFollow,
  isOwner = false,
  onProfileUpdate
}: ArtistProfilePageProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("portfolio");
  const [contentFilter, setContentFilter] = useState("all");
  const [songDurations] = useState<{ [key: string]: number }>({});
  const [isFollowing, setIsFollowing] = useState(artist.isFollowed || false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddContent, setShowAddContent] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showFundingSettings, setShowFundingSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string, title: string } | null>(null);

  // Edit project form state
  const [editFormData, setEditFormData] = useState({
    title: '',
    fundingGoal: 0,
    description: '',
    duration: ''
  });
  const [editProjectImage, setEditProjectImage] = useState<File | null>(null);
  const [isEditImageDragOver, setIsEditImageDragOver] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [profileData, setProfileData] = useState({
    name: artist.name,
    genre: artist.genre,
    description: artist.description,
    imageUrl: artist.imageUrl
  });

  // Update profileData when artist prop changes
  useEffect(() => {
    setProfileData({
      name: artist.name,
      genre: artist.genre,
      description: artist.description,
      imageUrl: artist.imageUrl
    });
    // Update isFollowing state when artist prop changes
    setIsFollowing(artist.isFollowed || false);
  }, [artist]);

  // Determine user role and whether to show Invest button
  const userRole = user?.role || 'fan';
  const shouldShowInvestButton = userRole === 'fan' || userRole === 'label';

  // Handle invest button click
  const handleInvestClick = (projectId: string) => {
    navigate(`/invest/${projectId}`);
  };

  // Debug: Log the image URL to see what we're getting
  useEffect(() => {
    console.log('Artist imageUrl:', artist.imageUrl);
    console.log('ProfileData imageUrl:', profileData.imageUrl);
  }, [artist.imageUrl, profileData.imageUrl]);

  const fileInputRef = useRef<HTMLInputElement>(null);


  // Fetch projects using labelApi
  const {
    data: projectsData,
    isLoading: campaignsLoading,
    error: campaignsError,
    refetch: refetchProjects
  } = useGetAllProjectsQuery({
    page: currentPage,
    limit: 10,
  });

  const campaigns = projectsData?.data?.projects || [];

  // Update project mutation
  const [updateProject, { isLoading: isUpdatingProject }] = useUpdateProjectMutation();

  // Follow/Unfollow artist mutation
  const [followUnfollowArtist, { isLoading: isFollowUnfollowLoading }] = useFollowUnfollowArtistMutation();

  // Delete content mutation
  const [deleteContent, { isLoading: isDeletingContent }] = useDeleteContentMutation();

  // Handle edit project button click
  const handleEditProjectClick = (project: any) => {
    setSelectedProject(project);
    setEditFormData({
      title: project.title,
      fundingGoal: project.fundingGoal,
      description: project.description,
      duration: project.duration
    });
    setShowEditProject(true);
  };

  // Handle update project
  const handleUpdateProject = async () => {
    if (!selectedProject) return;

    try {
      await updateProject({
        projectId: selectedProject._id,
        title: editFormData.title,
        fundingGoal: editFormData.fundingGoal,
        description: editFormData.description,
        duration: editFormData.duration,
        image: editProjectImage,
      }).unwrap();

      // Close modal and refresh projects
      setShowEditProject(false);
      setSelectedProject(null);
      setEditProjectImage(null);
      refetchProjects();
    } catch (error) {
      console.error('Failed to update project:', error);
      // You can add toast notification here if needed
    }
  };

  // Handle edit image drop
  const handleEditImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsEditImageDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setEditProjectImage(files[0]);
    }
  };

  // Handle edit image select
  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setEditProjectImage(files[0]);
    }
  };

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
  }: any = useGetContentQuery(getContentType() ? { type: getContentType() } : undefined);
  const contentItems: any = contentResponse?.data?.content || [];

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

  // Audio player functions (copied from Search component)

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFollow = async () => {
    try {
      await followUnfollowArtist({ artistId: artist.artistId || artist.id.toString() }).unwrap();
      setIsFollowing(!isFollowing);
      // Call the parent onFollow callback if provided
      if (onFollow) {
        onFollow(artist);
      }
    } catch (error) {
      console.error('Failed to follow/unfollow artist:', error);
      // You can add toast notification here if needed
    }
  };

  // Handle delete content
  const handleDeleteContent = (contentId: string) => {
    setContentToDelete(contentId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteContent = async () => {
    if (!contentToDelete) return;

    try {
      await deleteContent({ contentId: contentToDelete }).unwrap();
      // Refresh content after successful deletion
      refetchContent();
      setShowDeleteConfirm(false);
      setContentToDelete(null);
      toast({
        title: "Success",
        description: "Content deleted successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to delete content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cancelDeleteContent = () => {
    setShowDeleteConfirm(false);
    setContentToDelete(null);
  };

  // Handle image click to open full screen
  const handleImageClick = (imageUrl: string, imageTitle: string) => {
    setSelectedImage({ url: imageUrl, title: imageTitle });
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
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



  // Use real data from artist prop instead of calculating from campaigns
  const totalRaisedFromCampaigns = parseFloat(artist.currentFunding) || 0;
  const totalGoalFromCampaigns = parseFloat(artist.fundingGoal) || 0;
  const monthlyROI = parseFloat(artist.expectedReturn?.replace('%', '') || '0') || 0;

  const renderContentCard = (item: any) => {
    const displayDate = new Date(item.createdAt).toLocaleDateString();
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const fileUrl = `${backendUrl}/${item.file}`;

    switch (item.type) {
      case "audio":
        return (
          <div
            key={item._id}
            className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-800/50 transition-all duration-200 cursor-pointer"
            onClick={() => navigate(`/song/${item._id}`)}
          >
            {/* Track Number */}
            <div className="w-8 flex justify-center">
              <span className="text-gray-400 text-sm">
                <Music className="w-4 h-4" />
              </span>
            </div>

            {/* Album Art / Thumbnail */}
            <div className="w-12 h-12 bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium truncate text-gray-100">
                  {item.title}
                </h4>
              </div>
              <p className="text-sm text-gray-400 truncate">
                {item.description || 'New single from upcoming album'}
              </p>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-xs text-gray-500">{displayDate}</span>
                {item.genre && <span className="text-xs text-purple-400 font-medium">{item.genre}</span>}
              </div>
            </div>

            {/* Duration */}
            <div className="w-12 text-right">
              <span className="text-sm text-gray-400">
                {formatTime(songDurations[item._id] || 180)}
              </span>
            </div>

            {/* Actions */}
            {isOwner && (
              <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleDeleteContent(item._id)}
                  disabled={isDeletingContent}
                  className="w-8 h-8 rounded-full bg-red-600/40 hover:bg-red-500/40 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeletingContent ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        );

      case "video":
        return (
          <Card key={item._id} className="bg-slate-800/80 backdrop-blur-sm border-0 rounded-2xl overflow-hidden hover:bg-slate-700/80 transition-all duration-300 shadow-xl group">
            <CardContent className="p-0">
              <div className="relative">
                <video
                  src={fileUrl}
                  className="w-full h-48 object-cover"
                  controls
                  preload="metadata"
                  onError={(e) => {
                    console.error('Video loading error:', e);
                    // Fallback to gradient background if video fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hidden">
                  <Video className="w-12 h-12 text-white" />
                </div>
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
                      <button
                        onClick={() => handleDeleteContent(item._id)}
                        disabled={isDeletingContent}
                        className="w-8 h-8 rounded-full bg-red-600/40 hover:bg-red-500/40 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeletingContent ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
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
              <div
                className="relative cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(fileUrl, item.title);
                }}
              >
                <img
                  src={fileUrl}
                  alt={item.title}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.error('Image loading error:', e);
                    console.error('Image URL:', fileUrl);
                    // Fallback to gradient background if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', fileUrl);
                  }}
                />
                <div className="w-full h-64 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hidden">
                  <Image className="w-12 h-12 text-white" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
                      <button
                        onClick={() => handleDeleteContent(item._id)}
                        disabled={isDeletingContent}
                        className="w-8 h-8 rounded-full bg-red-600/40 hover:bg-red-500/40 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeletingContent ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
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

  console.log('Artist imageUrl:', artist);
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">

      <div className="h-full overflow-y-auto">
        {/* Hero Section */}
        <div className="relative h-80 overflow-hidden flex-shrink-0">
          <img
            src={artist.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop"}
            alt={artist.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Hero image failed to load:', artist.imageUrl);
              console.error('Error event:', e);
            }}
            onLoad={() => {
              console.log('Hero image loaded successfully:', artist.imageUrl);
            }}
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

          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
            <div className="flex flex-col space-y-4">
              {/* Top row: Avatar and basic info */}
              <div className="flex flex-col sm:flex-row sm:items-end space-y-3 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-4 border-white/20 cursor-pointer group-hover:scale-105 transition-transform">
                      <AvatarImage
                        src={artist.imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"}
                        alt={artist.name}
                        className="object-cover"
                        onError={(e) => {
                          console.error('Avatar image failed to load:', artist.imageUrl);
                          console.error('Error event:', e);
                        }}
                        onLoad={() => {
                          console.log('Avatar image loaded successfully:', artist.imageUrl);
                        }}
                      />
                      <AvatarFallback className="bg-gray-600 text-lg sm:text-xl lg:text-2xl">
                        {artist.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 truncate">{artist.name}</h1>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-300">
                      <Badge className="bg-purple-500/20 text-purple-300 capitalize text-xs sm:text-sm">
                        {artist.genre}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs sm:text-sm">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="capitalize">{artist.country}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons - only show on larger screens or move to bottom */}
                <div className="flex items-center space-x-2 sm:space-x-3 sm:ml-auto">
                {isOwner ? (
                  <>
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFundingSettings(true)}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-300 backdrop-blur-sm"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Funding Settings
                    </Button> */}
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddContent(true)}
                      className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 backdrop-blur-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Content
                    </Button> */}
                  </>
                ) : (
                  <>
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMessage(artist)}
                      className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button> */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFollow}
                      disabled={isFollowUnfollowLoading}
                      className={`backdrop-blur-sm text-xs sm:text-sm ${isFollowing
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                        } ${isFollowUnfollowLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Heart className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                      {isFollowUnfollowLoading ? 'Loading...' : (isFollowing ? 'Following' : 'Follow')}
                    </Button>
                    {/* <Button
                      size="sm"
                      onClick={() => onInvest(artist)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Invest Now
                    </Button> */}
                  </>
                )}
                </div>
              </div>

              {/* Stats section - responsive grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
                <div className="text-center p-2 sm:p-3 bg-black/20 rounded-lg backdrop-blur-sm">
                  <div className="text-white font-bold text-sm sm:text-lg">${totalRaisedFromCampaigns.toLocaleString()}</div>
                  <div className="text-gray-400 text-xs">Total Raised</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-black/20 rounded-lg backdrop-blur-sm">
                  <div className="text-white font-bold text-sm sm:text-lg">${totalGoalFromCampaigns.toLocaleString()}</div>
                  <div className="text-gray-400 text-xs">Funding Goal</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-black/20 rounded-lg backdrop-blur-sm">
                  <div className="text-green-400 font-bold text-sm sm:text-lg">{monthlyROI.toFixed(1)}%</div>
                  <div className="text-gray-400 text-xs">Monthly ROI</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-800/50 border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-transparent h-14">
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
            <TabsContent value="portfolio" className="mt-0 pb-16">
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
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${contentFilter === "all"
                        ? 'bg-white text-black'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                        }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setContentFilter("audio")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${contentFilter === "audio"
                        ? 'bg-white text-black'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                        }`}
                    >
                      Audio
                    </button>
                    <button
                      onClick={() => setContentFilter("video")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${contentFilter === "video"
                        ? 'bg-white text-black'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                        }`}
                    >
                      Video
                    </button>
                    <button
                      onClick={() => setContentFilter("photo")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${contentFilter === "photo"
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
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {filteredContent?.map(renderContentCard)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects" className="mt-0 pb-16">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-white">Active Projects</h2>
                  <div className="flex gap-2">
                    {/* <Button
                      onClick={() => refetchProjects()}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button> */}
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
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading projects...</p>
                  </div>
                ) : campaignsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-400 mb-2">Failed to load projects</p>
                    <p className="text-gray-500 text-sm">Please try again later</p>
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">No projects found</p>
                    <p className="text-gray-500 text-sm">Create your first project to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {campaigns.map((project: any) => (
                      <div
                        key={project._id}
                        className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-600/40 transition-all duration-300 group"
                      >
                        {/* Project Image */}
                        {project.image && (
                          <div className="mb-4">
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${project.image}`}
                              alt={project.title}
                              className="w-full h-48 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors capitalize">
                                {project.title}
                              </h4>
                              <Badge
                                className={`capitalize text-xs ${project.status === 'active'
                                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                  : project.status === 'completed'
                                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                    : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                  }`}
                              >
                                {project.status}
                              </Badge>
                              {project.isVerified && (
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2 capitalize">
                              {project.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Music className="w-4 h-4" />
                                <span>{project.songTitle} - {project.artistName}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(project.expectedReleaseDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">${project.fundingGoal.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">Funding Goal</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-cyan-400">{project.expectedROIPercentage}%</p>
                            <p className="text-xs text-gray-400">Expected ROI</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-400">{project.duration} days</p>
                            <p className="text-xs text-gray-400">Duration</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-orange-400 capitalize">{project.releaseType}</p>
                            <p className="text-xs text-gray-400">Release Type</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-400">
                            <p>Deadline: {new Date(project.fundingDeadline).toLocaleDateString()}</p>
                            <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex space-x-2">
                            {isOwner && (
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                                onClick={() => handleEditProjectClick(project)}
                              >
                                Edit Project
                              </Button>
                            )}
                            {!isOwner && shouldShowInvestButton && (
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                                onClick={() => handleInvestClick(project._id)}
                              >
                                Invest
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {projectsData?.pagination && projectsData.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-500 text-gray-300 hover:bg-gray-600"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-400">
                      {currentPage} / {projectsData.pagination.totalPages}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-500 text-gray-300 hover:bg-gray-600"
                      onClick={() => setCurrentPage(prev => Math.min(projectsData.pagination.totalPages, prev + 1))}
                      disabled={currentPage === projectsData.pagination.totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
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
                        {/* <div className="flex justify-between">
                          <span className="text-gray-400">Monthly Listeners</span>
                          <span className="text-white">{artist.monthlyListeners.toLocaleString()}</span>
                        </div> */}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Funding Goal</span>
                          <span className="text-white">${totalGoalFromCampaigns.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Raised</span>
                          <span className="text-green-400">${totalRaisedFromCampaigns.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Monthly ROI</span>
                          <span className="text-purple-400">{monthlyROI.toFixed(1)}%</span>
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

        {/* Edit Project Modal */}
        {showEditProject && selectedProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Edit Project</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowEditProject(false);
                      setSelectedProject(null);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campaign Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Campaign Information</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
                      <input
                        type="text"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full p-3 bg-slate-700 text-white rounded border border-gray-600 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Funding Goal ($)</label>
                      <input
                        type="number"
                        value={editFormData.fundingGoal}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, fundingGoal: Number(e.target.value) }))}
                        className="w-full p-3 bg-slate-700 text-white rounded border border-gray-600 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea
                        value={editFormData.description}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full p-3 bg-slate-700 text-white rounded border border-gray-600 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Duration (days)</label>
                      <input
                        type="number"
                        value={editFormData.duration}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full p-3 bg-slate-700 text-white rounded border border-gray-600 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Project Image Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Project Image</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Update Project Image</label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isEditImageDragOver
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-gray-600 hover:border-gray-500"
                            }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsEditImageDragOver(true);
                        }}
                        onDragLeave={() => setIsEditImageDragOver(false)}
                        onDrop={handleEditImageDrop}
                      >
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        {editProjectImage ? (
                          <div className="text-white">
                            <p className="font-medium">{editProjectImage.name}</p>
                            <p className="text-sm text-gray-400">
                              {(editProjectImage.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-white mb-2">Drop your project image here</p>
                            <p className="text-sm text-gray-400">or click to browse</p>
                            <input
                              type="file"
                              onChange={handleEditImageSelect}
                              className="hidden"
                              id="edit-project-image"
                              accept="image/*"
                            />
                            <label
                              htmlFor="edit-project-image"
                              className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                            >
                              Choose Image
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Song Details - Read Only */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Song Details</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Song Title</label>
                      <input
                        type="text"
                        value={selectedProject.songTitle}
                        disabled
                        className="w-full p-3 bg-slate-600 text-gray-400 rounded border border-gray-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Artist Name</label>
                      <input
                        type="text"
                        value={selectedProject.artistName}
                        disabled
                        className="w-full p-3 bg-slate-600 text-gray-400 rounded border border-gray-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">ISRC Code</label>
                      <input
                        type="text"
                        value={selectedProject.isrcCode}
                        disabled
                        className="w-full p-3 bg-slate-600 text-gray-400 rounded border border-gray-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">UPC Code</label>
                      <input
                        type="text"
                        value={selectedProject.upcCode}
                        disabled
                        className="w-full p-3 bg-slate-600 text-gray-400 rounded border border-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Platform Integration - Read Only */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Platform Integration</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Spotify Track Link</label>
                      <input
                        type="url"
                        value={selectedProject.spotifyTrackLink || ''}
                        disabled
                        className="w-full p-3 bg-slate-600 text-gray-400 rounded border border-gray-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">YouTube Music Link</label>
                      <input
                        type="url"
                        value={selectedProject.youtubeMusicLink || ''}
                        disabled
                        className="w-full p-3 bg-slate-600 text-gray-400 rounded border border-gray-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Deezer Track Link</label>
                      <input
                        type="url"
                        value={selectedProject.deezerTrackLink || ''}
                        disabled
                        className="w-full p-3 bg-slate-600 text-gray-400 rounded border border-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Release Information - Read Only */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Release Information</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Release Type</label>
                      <select
                        value={selectedProject.releaseType}
                        disabled
                        className="w-full p-3 bg-slate-600 text-gray-400 rounded border border-gray-600 cursor-not-allowed"
                      >
                        <option value="single">Single</option>
                        <option value="ep">EP</option>
                        <option value="album">Album</option>
                        <option value="mixtape">Mixtape</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Expected Release Date</label>
                      <input
                        type="datetime-local"
                        value={new Date(selectedProject.expectedReleaseDate).toISOString().slice(0, 16)}
                        disabled
                        className="w-full p-3 bg-slate-600 text-gray-400 rounded border border-gray-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Funding Deadline</label>
                      <input
                        type="datetime-local"
                        value={new Date(selectedProject.fundingDeadline).toISOString().slice(0, 16)}
                        disabled
                        className="w-full p-3 bg-slate-600 text-gray-400 rounded border border-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditProject(false);
                      setSelectedProject(null);
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateProject}
                    disabled={isUpdatingProject}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white disabled:opacity-50"
                  >
                    {isUpdatingProject ? 'Updating...' : 'Update Project'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Delete Content</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to permanently delete this content? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={cancelDeleteContent}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  disabled={isDeletingContent}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeleteContent}
                  disabled={isDeletingContent}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                >
                  {isDeletingContent ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    'Yes, Delete'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Full Screen Image Modal */}
        {showImageModal && selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={closeImageModal}
          >
            <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
              >
                <span className="text-2xl">&times;</span>
              </button>

              {/* Image Container */}
              <div
                className="relative max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  onError={(e) => {
                    console.error('Full screen image loading error:', e);
                    // Fallback to a placeholder
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDIyNVYxNzVIMTc1VjEyNVoiIGZpbGw9IiM2QjcyODAiLz4KPHN2Zz4K';
                  }}
                />

                {/* Image Title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                  <h3 className="text-white text-lg font-semibold">{selectedImage.title}</h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
