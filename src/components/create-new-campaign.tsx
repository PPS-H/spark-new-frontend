import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { X, Upload, Music, Youtube, Headphones } from 'lucide-react';
import { useCreateProjectMutation } from '@/store/features/api/projectApi';

interface Campaign {
    id: number;
    title: string;
    status: string;
    currentFunding: string;
    fundingGoal: string;
    maxInvestmentDuration: string;
}

interface CreateNewCampaignProps {
    onClose: () => void;
    onCampaignCreated?: (campaign: Campaign) => void;
}

const CreateNewCampaign: React.FC<CreateNewCampaignProps> = ({ onClose, onCampaignCreated }) => {
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
    const [isDragOver, setIsDragOver] = useState(false);
    const [isImageDragOver, setIsImageDragOver] = useState(false);


    const handleCreateCampaign = async () => {
        // Basic validation
        if (!campaignTitle || !fundingGoal || !campaignDescription || !campaignDuration ||
            !songTitle || !artistName || !isrcCode || !upcCode || !releaseType ||
            !expectedReleaseDate || !fundingDeadline) {
            alert("Please fill in all required fields.");
            return;
        }

        // Platform-specific validation
        if (selectedPlatform === "spotify" && (!spotifyTrackLink || !spotifyTrackId)) {
            alert("Please fill in Spotify track link and ID.");
            return;
        }
        if (selectedPlatform === "youtube" && (!youtubeMusicLink || !youtubeVideoId)) {
            alert("Please fill in YouTube music link and video ID.");
            return;
        }
        if (selectedPlatform === "deezer" && (!deezerTrackLink || !deezerTrackId)) {
            alert("Please fill in Deezer track link and ID.");
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
                projectImage
            };
            console.log("projectData::::::", projectData);
            const result = await createProject(projectData).unwrap();

            console.log("✅ Project created:", result);

            // Call parent callback if provided
            if (onCampaignCreated) {
                onCampaignCreated({
                    id: Date.now(), // Temporary ID for compatibility
                    title: result.data.title,
                    status: result.data.status,
                    currentFunding: "0",
                    fundingGoal: result.data.fundingGoal.toString(),
                    maxInvestmentDuration: result.data.duration
                });
            }

            // Trigger custom event
            window.dispatchEvent(new CustomEvent('campaignCreated', {
                detail: result.data
            }));

            // Reset form
            resetForm();

            // Close modal
            onClose();

            alert("Project created successfully!");
        } catch (error: any) {
            console.error("❌ Error creating project:", error);
            const errorMessage = error?.data?.message || error?.message || "Error creating project.";
            alert(errorMessage);
        }
    };

    const resetForm = () => {
        setCampaignTitle("");
        setFundingGoal("");
        setCampaignDescription("");
        setCampaignDuration("");
        setSongTitle("");
        setArtistName("");
        setIsrcCode("");
        setUpcCode("");
        setSelectedPlatform("");
        setSpotifyTrackLink("");
        setSpotifyTrackId("");
        setYoutubeMusicLink("");
        setYoutubeVideoId("");
        setDeezerTrackLink("");
        setDeezerTrackId("");
        setReleaseType("");
        setExpectedReleaseDate("");
        setFundingDeadline("");
        setDistrokidFile(null);
        setProjectImage(null);
    };

    const handleClose = () => {
        // Reset form when closing
        resetForm();
        onClose();
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            setDistrokidFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setDistrokidFile(files[0]);
        }
    };

    const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsImageDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            setProjectImage(files[0]);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setProjectImage(files[0]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 pb-20">
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto pb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Create New Campaign</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Campaign Information */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Campaign Information</h4>

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
                                placeholder="5000"
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
                    </div>

                    {/* Song Details */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Song Details</h4>

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
                    </div>

                    {/* Platform Selection */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Platform Integration</h4>

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

                        {/* Spotify Fields */}
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

                        {/* YouTube Fields */}
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

                        {/* Deezer Fields */}
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
                    </div>

                    {/* Release Dates & File Upload */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Release & Files</h4>

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
                                onDrop={handleImageDrop}
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
                                            onChange={handleImageSelect}
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

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Distrokid File
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
                                onDrop={handleFileDrop}
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
                                        <p className="text-white mb-2">Drop your Distrokid file here</p>
                                        <p className="text-sm text-gray-400">or click to browse</p>
                                        <input
                                            type="file"
                                            onChange={handleFileSelect}
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
                    </div>
                </div>
                <div className="flex space-x-3 mt-6 mb-8">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateCampaign}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create Campaign"}
                    </Button>
                </div>
                {/* Extra bottom spacing to ensure buttons are not hidden behind navigation */}
                <div className="h-16"></div>
            </div>
        </div>
    )
}

export default CreateNewCampaign
