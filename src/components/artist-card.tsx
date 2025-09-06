import { Artist } from "@/types/artist";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ExternalLink } from "lucide-react";
import AudioPreview from "@/components/audio-preview";

interface ArtistCardProps {
  artist: Artist;
  onInvest: () => void;
}

export default function ArtistCard({ artist, onInvest }: ArtistCardProps) {
  const fundingProgress = (parseFloat(artist.currentFunding) / parseFloat(artist.fundingGoal)) * 100;
  const isFullyFunded = fundingProgress >= 100;
  
  const getBorderColor = () => {
    switch (artist.genre) {
      case 'rap': return 'border-cyan-400/30';
      case 'pop': return 'border-pink-500/30';
      case 'afrobeats': return 'border-yellow-400/30';
      case 'k-pop': return 'border-purple-400/30';
      case 'j-pop': return 'border-pink-400/30';
      case 'indie': return 'border-green-400/30';
      default: return 'border-cyan-400/30';
    }
  };

  const getProgressColor = () => {
    switch (artist.genre) {
      case 'rap': return 'from-cyan-400 to-pink-500';
      case 'pop': return 'from-pink-500 to-purple-500';
      case 'afrobeats': return 'from-yellow-400 to-orange-500';
      case 'k-pop': return 'from-purple-400 to-pink-500';
      case 'j-pop': return 'from-pink-400 to-purple-500';
      case 'indie': return 'from-green-400 to-emerald-500';
      default: return 'from-cyan-400 to-pink-500';
    }
  };

  const getButtonGradient = () => {
    if (isFullyFunded) return 'bg-gray-600';
    return `bg-gradient-to-r ${getProgressColor()}`;
  };

  return (
    <div className={`investment-card-hover glass-effect-dark rounded-xl p-6 border ${getBorderColor()} animate-slide-up`}>
      <img 
        src={artist.imageUrl || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250`}
        alt={`${artist.name} performing`}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-xl font-bold text-white">{artist.name}</h4>
          <p className="text-gray-400 capitalize">
            {artist.genre} • {artist.country.charAt(0).toUpperCase() + artist.country.slice(1)}
          </p>
        </div>
        <div className="flex space-x-2">
          {artist.streamingLinks?.spotify && (
            <a href={artist.streamingLinks.spotify} target="_blank" rel="noopener noreferrer" 
               className="text-green-500 hover:text-green-400 transition-all duration-300 p-1 rounded hover:bg-green-500/10 focus:outline-none focus:ring-2 focus:ring-green-400/50"
               aria-label={`Listen to ${artist.name} on Spotify`}>
              <ExternalLink size={16} />
            </a>
          )}
          {artist.streamingLinks?.youtube && (
            <a href={artist.streamingLinks.youtube} target="_blank" rel="noopener noreferrer"
               className="text-red-500 hover:text-red-400 transition-all duration-300 p-1 rounded hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-400/50"
               aria-label={`Watch ${artist.name} on YouTube`}>
              <ExternalLink size={16} />
            </a>
          )}
          {artist.streamingLinks?.apple && (
            <a href={artist.streamingLinks.apple} target="_blank" rel="noopener noreferrer"
               className="text-blue-500 hover:text-blue-400 transition-all duration-300 p-1 rounded hover:bg-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
               aria-label={`Listen to ${artist.name} on Apple Music`}>
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Funding Progress</span>
          <span className="text-cyan-400">{Math.round(fundingProgress)}%</span>
        </div>
        <Progress value={fundingProgress} className="h-2 mb-2" />
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">${parseFloat(artist.currentFunding).toLocaleString()} raised</span>
          <span className="text-gray-400">Goal: ${parseFloat(artist.fundingGoal).toLocaleString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-400">Monthly Listeners</p>
          <p className="text-white font-semibold">{(artist.monthlyListeners / 1000).toFixed(0)}K</p>
        </div>
        <div>
          <p className="text-gray-400">Expected Return</p>
          <p className="text-green-400 font-semibold">{artist.expectedReturn}</p>
        </div>
      </div>

      {/* Audio Preview */}
      <div className="mb-4">
        <AudioPreview 
          artistName={artist.name}
          className="animate-fade-in-scale"
        />
      </div>
      
      <Button 
        onClick={onInvest}
        disabled={isFullyFunded}
        className={`w-full py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${getButtonGradient()} ${
          isFullyFunded 
            ? 'text-gray-400 cursor-not-allowed opacity-60' 
            : 'text-black font-semibold hover:shadow-lg hover:shadow-cyan-400/25 hover:scale-105 neon-glow-hover'
        }`}
        aria-label={isFullyFunded ? `${artist.name} funding is complete` : `Invest in ${artist.name}`}
      >
        {isFullyFunded ? 'Funding Complete' : 'Invest Now'}
      </Button>
    </div>
  );
}
