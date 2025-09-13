import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Pause,
  Heart,
  Share2,
  MoreVertical,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLikeDislikeContentMutation, useGetTrendingContentQuery } from "@/store/features/api/searchApi";
import type { ContentItem } from "@/store/features/api/searchApi";

export default function SongDetail() {
  const { songId } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Music player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Like mutation
  const [likeDislikeContent, { isLoading: isLikeDislikeLoading }] = useLikeDislikeContentMutation();
  
  // Fetch songs data to find the specific song
  const { data: songsData, isLoading: isSongsLoading, error: songsError } = useGetTrendingContentQuery({
    page: 1,
    limit: 100, // Get more songs to find the specific one
    type: 'songs'
  });
  
  // Find the specific song from the API data
  const song = songsData?.data && Array.isArray(songsData.data) 
    ? songsData.data.find((item: ContentItem) => item._id === songId)
    : null;

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [song]);

  // Play/Pause handler
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  // Progress bar handler
  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Volume handler
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Mute handler
  const handleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Like handler
  const handleLike = async () => {
    if (!song) return;
    try {
      await likeDislikeContent({ contentId: song._id }).unwrap();
      setSong(prev => prev ? { ...prev, isLiked: !prev.isLiked } : null);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (isSongsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading song...</p>
        </div>
      </div>
    );
  }

  if (songsError || !song) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Song not found</p>
          <p className="text-gray-500 text-sm mb-4">The song you're looking for doesn't exist or has been removed</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-4 py-8">
        {/* Album Art */}
        <div className="w-80 h-80 mb-8 relative group">
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-2xl flex items-center justify-center">
            {song.user.profilePicture ? (
              <img
                src={song.user.profilePicture}
                alt={song.user.username}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-6xl font-bold text-white">
                  {song.user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="lg"
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
              onClick={handlePlayPause}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </Button>
          </div>
        </div>

        {/* Song Info */}
        <div className="text-center mb-8 max-w-2xl">
          <h1 className="text-4xl font-bold text-white mb-2">{song.title}</h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Avatar className="w-8 h-8">
              <img
                src={song.user.profilePicture || `https://ui-avatars.com/api/?name=${song.user.username}&background=random&color=fff&size=100`}
                alt={song.user.username}
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="text-sm">
                {song.user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-lg text-gray-300">{song.user.username}</span>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {song.genre}
            </Badge>
          </div>
          <p className="text-gray-400 text-lg">{song.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-2xl mb-8">
          <div
            className="w-full h-1 bg-gray-600 rounded-full cursor-pointer group"
            onClick={handleProgressChange}
          >
            <div
              className="h-full bg-white rounded-full transition-all duration-200 group-hover:bg-green-400"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsShuffle(!isShuffle)}
            className={`text-gray-400 hover:text-white ${isShuffle ? 'text-green-400' : ''}`}
          >
            <Shuffle className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <SkipBack className="w-6 h-6" />
          </Button>
          
          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-white text-black hover:bg-gray-200"
            onClick={handlePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <SkipForward className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRepeat(!isRepeat)}
            className={`text-gray-400 hover:text-white ${isRepeat ? 'text-green-400' : ''}`}
          >
            <Repeat className="w-5 h-5" />
          </Button>
        </div>

        {/* Volume and Actions */}
        <div className="flex items-center space-x-4 w-full max-w-2xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMute}
            className="text-gray-400 hover:text-white"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLikeDislikeLoading}
              className={`${song.isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
            >
              <Heart className={`w-5 h-5 ${song.isLiked ? 'fill-current' : ''}`} />
            </Button>
            <span className="text-sm text-gray-400">{song.likeCount}</span>
          </div>
        </div>

        {/* Artist Bio */}
        {song.user.artistBio && (
          <div className="mt-12 max-w-2xl text-center">
            <h3 className="text-xl font-semibold text-white mb-4">About {song.user.username}</h3>
            <p className="text-gray-400 leading-relaxed">{song.user.artistBio}</p>
          </div>
        )}

        {/* Social Links */}
        {song.user.socialMediaLinks && (
          <div className="mt-8 flex space-x-4">
            {song.user.socialMediaLinks.instagram && (
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-white/10"
                onClick={() => window.open(song.user.socialMediaLinks.instagram, '_blank')}
              >
                Instagram
              </Button>
            )}
            {song.user.socialMediaLinks.youtube && (
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-white/10"
                onClick={() => window.open(song.user.socialMediaLinks.youtube, '_blank')}
              >
                YouTube
              </Button>
            )}
            {song.user.socialMediaLinks.spotify && (
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-white/10"
                onClick={() => window.open(song.user.socialMediaLinks.spotify, '_blank')}
              >
                Spotify
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={song.file.startsWith('http') ? song.file : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/${song.file}`}
        preload="metadata"
        onError={(e) => {
          console.error('Audio loading error:', e);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
