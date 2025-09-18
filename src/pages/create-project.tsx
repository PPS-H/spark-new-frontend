import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Upload, 
  Music, 
  Youtube, 
  Headphones,
  X,
  AlertCircle
} from 'lucide-react';
import { useCreateProjectMutation } from '@/store/features/api/projectApi';
import { useToast } from '@/hooks/use-toast';

interface Milestone {
  name: string;
  amount: number;
  description: string;
  order: number;
}

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createProject, { isLoading }] = useCreateProjectMutation();

  // Basic campaign fields
  const [campaignTitle, setCampaignTitle] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [campaignDuration, setCampaignDuration] = useState("");

  // Song details
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [isrcCode, setIsrcCode] = useState("");
  const [upcCode, setUpcCode] = useState("");

  // Platform selection
  const [selectedPlatform, setSelectedPlatform] = useState("");

  // Platform-specific fields
  const [spotifyTrackLink, setSpotifyTrackLink] = useState("");
  const [spotifyTrackId, setSpotifyTrackId] = useState("");
  const [youtubeMusicLink, setYoutubeMusicLink] = useState("");
  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const [deezerTrackLink, setDeezerTrackLink] = useState("");
  const [deezerTrackId, setDeezerTrackId] = useState("");

  // Release details
  const [releaseType, setReleaseType] = useState("");
  const [expectedReleaseDate, setExpectedReleaseDate] = useState("");
  const [fundingDeadline, setFundingDeadline] = useState("");

  // File upload
  const [distrokidFile, setDistrokidFile] = useState<File | null>(null);
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImageDragOver, setIsImageDragOver] = useState(false);
  const [isInvoiceDragOver, setIsInvoiceDragOver] = useState(false);

  // Milestones
  const [milestones, setMilestones] = useState<Milestone[]>([
    { name: "Studio Recording", amount: 0, description: "Professional studio recording session", order: 1 },
    { name: "Music Video", amount: 0, description: "High-quality music video production", order: 2 },
    { name: "Marketing Campaign", amount: 0, description: "Digital marketing and promotion", order: 3 }
  ]);

  const addMilestone = () => {
    const newMilestone: Milestone = {
      name: "",
      amount: 0,
      description: "",
      order: milestones.length + 1
    };
    setMilestones([...milestones, newMilestone]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      const updatedMilestones = milestones.filter((_, i) => i !== index);
      // Reorder milestones
      const reorderedMilestones = updatedMilestones.map((milestone, i) => ({
        ...milestone,
        order: i + 1
      }));
      setMilestones(reorderedMilestones);
    }
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string | number) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: value
    };
    setMilestones(updatedMilestones);
  };

  const calculateTotalMilestones = () => {
    return milestones.reduce((total, milestone) => total + (milestone.amount || 0), 0);
  };

  const getRemainingAmount = () => {
    const total = parseInt(fundingGoal) || 0;
    const milestoneTotal = calculateTotalMilestones();
    return total - milestoneTotal;
  };

  const isMilestoneTotalValid = () => {
    const total = parseInt(fundingGoal) || 0;
    const milestoneTotal = calculateTotalMilestones();
    return total > 0 && milestoneTotal === total;
  };

  const handleCreateProject = async () => {
    // Basic validation
    if (!campaignTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Campaign title is required.",
        variant: "destructive",
      });
      return;
    }
    if (!fundingGoal.trim()) {
      toast({
        title: "Validation Error",
        description: "Funding goal is required.",
        variant: "destructive",
      });
      return;
    }
    if (isNaN(parseInt(fundingGoal)) || parseInt(fundingGoal) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid funding goal amount.",
        variant: "destructive",
      });
      return;
    }
    if (!campaignDescription.trim()) {
      toast({
        title: "Validation Error",
        description: "Campaign description is required.",
        variant: "destructive",
      });
      return;
    }
    if (!campaignDuration.trim()) {
      toast({
        title: "Validation Error",
        description: "Campaign duration is required.",
        variant: "destructive",
      });
      return;
    }
    if (!songTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Song title is required.",
        variant: "destructive",
      });
      return;
    }
    if (!artistName.trim()) {
      toast({
        title: "Validation Error",
        description: "Artist name is required.",
        variant: "destructive",
      });
      return;
    }
    if (!isrcCode.trim()) {
      toast({
        title: "Validation Error",
        description: "ISRC code is required.",
        variant: "destructive",
      });
      return;
    }
    if (!upcCode.trim()) {
      toast({
        title: "Validation Error",
        description: "UPC code is required.",
        variant: "destructive",
      });
      return;
    }
    if (!releaseType.trim()) {
      toast({
        title: "Validation Error",
        description: "Release type is required.",
        variant: "destructive",
      });
      return;
    }
    if (!expectedReleaseDate.trim()) {
      toast({
        title: "Validation Error",
        description: "Expected release date is required.",
        variant: "destructive",
      });
      return;
    }
    if (!fundingDeadline.trim()) {
      toast({
        title: "Validation Error",
        description: "Funding deadline is required.",
        variant: "destructive",
      });
      return;
    }

    // Validate milestones
    if (!isMilestoneTotalValid()) {
      toast({
        title: "Validation Error",
        description: "Total milestone amount must equal funding goal.",
        variant: "destructive",
      });
      return;
    }

    // Platform-specific validation
    if (selectedPlatform === "spotify" && (!spotifyTrackLink.trim() || !spotifyTrackId.trim())) {
      toast({
        title: "Validation Error",
        description: "Please fill in both Spotify track link and track ID.",
        variant: "destructive",
      });
      return;
    }
    if (selectedPlatform === "youtube" && (!youtubeMusicLink.trim() || !youtubeVideoId.trim())) {
      toast({
        title: "Validation Error",
        description: "Please fill in both YouTube music link and video ID.",
        variant: "destructive",
      });
      return;
    }
    if (selectedPlatform === "deezer" && (!deezerTrackLink.trim() || !deezerTrackId.trim())) {
      toast({
        title: "Validation Error",
        description: "Please fill in both Deezer track link and track ID.",
        variant: "destructive",
      });
      return;
    }

    try {
      const projectData = {
        title: campaignTitle,
        fundingGoal: parseInt(fundingGoal),
        description: campaignDescription,
        duration: campaignDuration,
        songTitle,
        artistName,
        isrcCode,
        upcCode,
        releaseType,
        expectedReleaseDate,
        fundingDeadline,
        ...(selectedPlatform === "spotify" && {
          spotifyTrackLink,
          spotifyTrackId
        }),
        ...(selectedPlatform === "youtube" && {
          youtubeMusicLink,
          youtubeVideoId
        }),
        ...(selectedPlatform === "deezer" && {
          deezerTrackLink,
          deezerTrackId
        }),
        distrokidFile,
        projectImage,
        invoiceFile,
        milestones: milestones.map(m => ({
          name: m.name,
          amount: m.amount,
          description: m.description,
          order: m.order
        }))
      };

      console.log("projectData::::::", projectData);
      const result = await createProject(projectData).unwrap();

      console.log("✅ Project created:", result);

      toast({
        title: "Success",
        description: "Project created successfully and submitted for admin approval!",
        variant: "default",
      });

      // Navigate back to artist profile
      navigate(-1);
    } catch (error: any) {
      console.error("❌ Error creating project:", error);
      const errorMessage = error?.data?.message || error?.message || "Error creating project.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, type: 'distrokid' | 'image' | 'invoice') => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (type === 'distrokid') {
        setDistrokidFile(files[0]);
        setIsDragOver(false);
      } else if (type === 'image') {
        setProjectImage(files[0]);
        setIsImageDragOver(false);
      } else if (type === 'invoice') {
        setInvoiceFile(files[0]);
        setIsInvoiceDragOver(false);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'distrokid' | 'image' | 'invoice') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (type === 'distrokid') {
        setDistrokidFile(files[0]);
      } else if (type === 'image') {
        setProjectImage(files[0]);
      } else if (type === 'invoice') {
        setInvoiceFile(files[0]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 pb-32">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">Create New Project</h1>
          <p className="text-slate-400 mt-2">Fill in the details below to create your project campaign</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            {/* Campaign Information */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Campaign Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Campaign Title *
                  </label>
                  <Input
                    type="text"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    placeholder="Enter campaign title"
                    className="w-full bg-slate-700 text-white border-gray-600"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Funding Goal (€) *
                  </label>
                  <Input
                    type="number"
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value)}
                    placeholder="50000"
                    className="w-full bg-slate-700 text-white border-gray-600"
                    disabled={isLoading}
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Campaign Description *
                  </label>
                  <Textarea
                    value={campaignDescription}
                    onChange={(e) => setCampaignDescription(e.target.value)}
                    placeholder="Describe your campaign"
                    rows={3}
                    className="w-full bg-slate-700 text-white border-gray-600"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Campaign Duration *
                  </label>
                  <select
                    value={campaignDuration}
                    onChange={(e) => setCampaignDuration(e.target.value)}
                    className="w-full bg-slate-700 text-white border-gray-600 border rounded px-3 py-2"
                    disabled={isLoading}
                  >
                    <option value="">Select duration</option>
                    <option value="30">30 days</option>
                    <option value="45">45 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Song Details */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Song Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Song Title *
                  </label>
                  <Input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="Shape of You"
                    className="w-full bg-slate-700 text-white border-gray-600"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Artist Name *
                  </label>
                  <Input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="Ed Sheeran"
                    className="w-full bg-slate-700 text-white border-gray-600"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ISRC Code *
                    </label>
                    <Input
                      type="text"
                      value={isrcCode}
                      onChange={(e) => setIsrcCode(e.target.value)}
                      placeholder="GBAHS1600463"
                      className="w-full bg-slate-700 text-white border-gray-600"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      UPC Code *
                    </label>
                    <Input
                      type="text"
                      value={upcCode}
                      onChange={(e) => setUpcCode(e.target.value)}
                      placeholder="190295851927"
                      className="w-full bg-slate-700 text-white border-gray-600"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Release Type *
                  </label>
                  <select
                    value={releaseType}
                    onChange={(e) => setReleaseType(e.target.value)}
                    className="w-full bg-slate-700 text-white border-gray-600 border rounded px-3 py-2"
                    disabled={isLoading}
                  >
                    <option value="">Select release type</option>
                    <option value="single">Single</option>
                    <option value="ep">EP</option>
                    <option value="album">Album</option>
                    <option value="mixtape">Mixtape</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Platform Integration */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Platform Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Platform *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPlatform("spotify")}
                      className={`p-3 rounded-lg border-2 transition-all ${selectedPlatform === "spotify"
                              ? "border-green-500 bg-green-500/20"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                      disabled={isLoading}
                    >
                      <Music className="w-6 h-6 mx-auto mb-2 text-green-400" />
                      <span className="text-sm text-white">Spotify</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPlatform("youtube")}
                      className={`p-3 rounded-lg border-2 transition-all ${selectedPlatform === "youtube"
                              ? "border-red-500 bg-red-500/20"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                      disabled={isLoading}
                    >
                      <Youtube className="w-6 h-6 mx-auto mb-2 text-red-400" />
                      <span className="text-sm text-white">YouTube</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPlatform("deezer")}
                      className={`p-3 rounded-lg border-2 transition-all ${selectedPlatform === "deezer"
                              ? "border-blue-500 bg-blue-500/20"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                      disabled={isLoading}
                    >
                      <Headphones className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                      <span className="text-sm text-white">Deezer</span>
                    </button>
                  </div>
                </div>

                {/* Platform-specific fields */}
                {selectedPlatform === "spotify" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Spotify Track Link *
                      </label>
                      <Input
                        type="url"
                        value={spotifyTrackLink}
                        onChange={(e) => setSpotifyTrackLink(e.target.value)}
                        placeholder="https://open.spotify.com/track/..."
                        className="w-full bg-slate-700 text-white border-gray-600"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Spotify Track ID *
                      </label>
                      <Input
                        type="text"
                        value={spotifyTrackId}
                        onChange={(e) => setSpotifyTrackId(e.target.value)}
                        placeholder="7qiZfU4dY1lWllzX7mPBI3"
                        className="w-full bg-slate-700 text-white border-gray-600"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {selectedPlatform === "youtube" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        YouTube Music Link *
                      </label>
                      <Input
                        type="url"
                        value={youtubeMusicLink}
                        onChange={(e) => setYoutubeMusicLink(e.target.value)}
                        placeholder="https://music.youtube.com/watch?v=..."
                        className="w-full bg-slate-700 text-white border-gray-600"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        YouTube Video ID *
                      </label>
                      <Input
                        type="text"
                        value={youtubeVideoId}
                        onChange={(e) => setYoutubeVideoId(e.target.value)}
                        placeholder="dQw4w9WgXcQ"
                        className="w-full bg-slate-700 text-white border-gray-600"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {selectedPlatform === "deezer" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Deezer Track Link *
                      </label>
                      <Input
                        type="url"
                        value={deezerTrackLink}
                        onChange={(e) => setDeezerTrackLink(e.target.value)}
                        placeholder="https://deezer.com/track/..."
                        className="w-full bg-slate-700 text-white border-gray-600"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Deezer Track ID *
                      </label>
                      <Input
                        type="text"
                        value={deezerTrackId}
                        onChange={(e) => setDeezerTrackId(e.target.value)}
                        placeholder="3135556"
                        className="w-full bg-slate-700 text-white border-gray-600"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Milestones and Files */}
          <div className="space-y-6">
            {/* Milestones */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Project Milestones</CardTitle>
                  <Button
                    onClick={addMilestone}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={isLoading}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Milestone
                  </Button>
                </div>
                <p className="text-sm text-gray-400">
                  Total milestone amount must equal funding goal: €{fundingGoal || 0}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">Milestone {milestone.order}</h4>
                      {milestones.length > 1 && (
                        <Button
                          onClick={() => removeMilestone(index)}
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-500/20"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Name *
                        </label>
                        <Input
                          type="text"
                          value={milestone.name}
                          onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                          placeholder="e.g., Studio Recording"
                          className="w-full bg-slate-700 text-white border-gray-600"
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Amount (€) *
                        </label>
                        <Input
                          type="number"
                          value={milestone.amount || ''}
                          onChange={(e) => updateMilestone(index, 'amount', parseInt(e.target.value) || 0)}
                          placeholder="15000"
                          className="w-full bg-slate-700 text-white border-gray-600"
                          disabled={isLoading}
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Description *
                        </label>
                        <Textarea
                          value={milestone.description}
                          onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                          placeholder="Describe what this milestone covers"
                          rows={2}
                          className="w-full bg-slate-700 text-white border-gray-600"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Milestone Summary */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Total Milestones:</span>
                    <span className="text-white font-medium">€{calculateTotalMilestones()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Funding Goal:</span>
                    <span className="text-white font-medium">€{fundingGoal || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Remaining:</span>
                    <span className={`font-medium ${getRemainingAmount() === 0 ? 'text-green-400' : 'text-red-400'}`}>
                      €{getRemainingAmount()}
                    </span>
                  </div>
                  
                  {!isMilestoneTotalValid() && (
                    <div className="flex items-center mt-3 p-2 bg-red-500/20 border border-red-500/50 rounded">
                      <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                      <span className="text-red-400 text-sm">
                        Milestone total must equal funding goal
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Release Dates */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Release & Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Expected Release Date *
                  </label>
                  <Input
                    type="datetime-local"
                    value={expectedReleaseDate}
                    onChange={(e) => setExpectedReleaseDate(e.target.value)}
                    className="w-full bg-slate-700 text-white border-gray-600"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Funding Deadline *
                  </label>
                  <Input
                    type="datetime-local"
                    value={fundingDeadline}
                    onChange={(e) => setFundingDeadline(e.target.value)}
                    className="w-full bg-slate-700 text-white border-gray-600"
                    disabled={isLoading}
                  />
                </div>

                {/* Project Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Image
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isImageDragOver
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-600 hover:border-gray-500"
                        }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsImageDragOver(true);
                    }}
                    onDragLeave={() => setIsImageDragOver(false)}
                    onDrop={(e) => handleFileDrop(e, 'image')}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    {projectImage ? (
                      <div className="text-white">
                        <p className="font-medium">{projectImage.name}</p>
                        <p className="text-sm text-gray-400">
                          {(projectImage.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-white mb-2">Drop your project image here</p>
                        <p className="text-sm text-gray-400">or click to browse</p>
                        <input
                          type="file"
                          onChange={(e) => handleFileSelect(e, 'image')}
                          className="hidden"
                          id="project-image"
                          accept="image/*"
                        />
                        <label
                          htmlFor="project-image"
                          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                        >
                          Choose Image
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* DistroKid File */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    DistroKid File
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragOver
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-gray-600 hover:border-gray-500"
                        }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => handleFileDrop(e, 'distrokid')}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    {distrokidFile ? (
                      <div className="text-white">
                        <p className="font-medium">{distrokidFile.name}</p>
                        <p className="text-sm text-gray-400">
                          {(distrokidFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-white mb-2">Drop your DistroKid file here</p>
                        <p className="text-sm text-gray-400">or click to browse</p>
                        <input
                          type="file"
                          onChange={(e) => handleFileSelect(e, 'distrokid')}
                          className="hidden"
                          id="distrokid-file"
                          accept=".pdf,.doc,.docx,.txt"
                        />
                        <label
                          htmlFor="distrokid-file"
                          className="inline-block mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700"
                        >
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Invoice File */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Invoice File *
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isInvoiceDragOver
                            ? "border-green-500 bg-green-500/10"
                            : "border-gray-600 hover:border-gray-500"
                        }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsInvoiceDragOver(true);
                    }}
                    onDragLeave={() => setIsInvoiceDragOver(false)}
                    onDrop={(e) => handleFileDrop(e, 'invoice')}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    {invoiceFile ? (
                      <div className="text-white">
                        <p className="font-medium">{invoiceFile.name}</p>
                        <p className="text-sm text-gray-400">
                          {(invoiceFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-white mb-2">Drop your invoice file here</p>
                        <p className="text-sm text-gray-400">or click to browse</p>
                        <input
                          type="file"
                          onChange={(e) => handleFileSelect(e, 'invoice')}
                          className="hidden"
                          id="invoice-file"
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        />
                        <label
                          htmlFor="invoice-file"
                          className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700"
                        >
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={isLoading || !isMilestoneTotalValid()}
          >
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
