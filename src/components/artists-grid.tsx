import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuthRTK";
import { useNavigate } from "react-router-dom";

interface Artist {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  genre: string;
  country?: string;
  bio?: string;
  imageUrl?: string;
  monthlyListeners?: number;
}

interface ArtistStats {
  followers: number;
  streams: number;
  monthlyListeners: number;
  revenue: string;
  funding: string;
  projects: number;
}

export default function ArtistsGrid() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState<{[key: number]: boolean}>({});
  const [isInvesting, setIsInvesting] = useState<{[key: number]: boolean}>({});

  // Mock toast function
  const toast = ({ title, description, variant }: { 
    title: string; 
    description: string; 
    variant?: string 
  }) => {
    console.log(`Toast: ${title} - ${description}`);
    alert(`${title}: ${description}`);
  };

  // Mock artist data (replacing useQuery API call)
  const mockArtists: Artist[] = [
    {
      id: 1,
      name: "Sophia Martinez",
      username: "sophiamusic",
      email: "sophia@example.com",
      role: "artist",
      genre: "Pop",
      country: "Spain",
      monthlyListeners: 37000,
      imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b277?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Pop artist from Madrid with a passion for storytelling through music."
    },
    {
      id: 2,
      name: "Marcus Thompson",
      username: "marcusrb",
      email: "marcus@example.com",
      role: "artist",
      genre: "R&B",
      country: "USA",
      monthlyListeners: 52000,
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Soulful R&B artist bringing modern vibes to classic sounds."
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      username: "elenabeats",
      email: "elena@example.com",
      role: "artist",
      genre: "Electronic",
      country: "Germany",
      monthlyListeners: 41000,
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Electronic music producer creating atmospheric soundscapes."
    },
    {
      id: 4,
      name: "James Wilson",
      username: "jameswilsonhh",
      email: "james@example.com",
      role: "artist",
      genre: "Hip Hop",
      country: "UK",
      monthlyListeners: 29000,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      bio: "UK-based hip hop artist with socially conscious lyrics."
    },
    {
      id: 5,
      name: "Aria Chen",
      username: "ariaindiemusic",
      email: "aria@example.com",
      role: "artist",
      genre: "Indie",
      country: "Canada",
      monthlyListeners: 33000,
      imageUrl: "", // This will show initials
      bio: "Indie singer-songwriter from Vancouver with ethereal melodies."
    },
    {
      id: 6,
      name: "Diego Santos",
      username: "diegolatin",
      email: "diego@example.com",
      role: "artist",
      genre: "Latin",
      country: "Mexico",
      monthlyListeners: 45000,
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Latin music artist blending traditional and contemporary sounds."
    }
  ];

  // Mock loading state
  const isLoading = false;

  // Filter only users with role "artist"
  const artistUsers = mockArtists.filter(artist => artist.role === "artist");

  const handleArtistClick = (artistId: number) => {
    navigate(`/artist/${artistId}`);
  };

  const handleFollow = (e: React.MouseEvent, artistId: number) => {
    e.stopPropagation();
    setIsFollowing(prev => ({ ...prev, [artistId]: true }));
    
    // Simulate follow API call
    setTimeout(() => {
      const artist = artistUsers.find(a => a.id === artistId);
      toast({
        title: "✅ Suivi ajouté",
        description: `Vous suivez maintenant ${artist?.name}`,
      });
      setIsFollowing(prev => ({ ...prev, [artistId]: false }));
    }, 1000);
  };

  const handleInvest = (e: React.MouseEvent, artistId: number) => {
    e.stopPropagation();
    
    // Check user role
    if (user?.role === "fan") {
      toast({
        title: "❌ Accès refusé",
        description: "L'investissement est réservé aux Investisseurs et Labels",
        variant: "destructive",
      });
      return;
    }

    setIsInvesting(prev => ({ ...prev, [artistId]: true }));

    // Simulate investment API call
    setTimeout(() => {
      const artist = artistUsers.find(a => a.id === artistId);
      const defaultAmount = 1000; // €1000
      
      toast({
        title: "🎉 Investissement réussi !",
        description: `Vous avez investi €${defaultAmount} dans ${artist?.name}`,
      });
      setIsInvesting(prev => ({ ...prev, [artistId]: false }));
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-white text-lg font-semibold">Artists ({artistUsers.length})</h2>
        <p className="text-gray-400 text-sm">Profils d'artistes • Données démo</p>
      </div>
      
      {/* Liste verticale avec photos de profil */}
      <div className="space-y-4">
        {artistUsers.map((artist) => (
          <div
            key={artist.id}
            onClick={() => handleArtistClick(artist.id)}
            className="flex items-center p-4 bg-slate-900/50 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors duration-200"
          >
            {/* Photo de profil */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-lg mr-4 flex-shrink-0">
              {artist.imageUrl ? (
                <img 
                  src={artist.imageUrl} 
                  alt={artist.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>
                  {artist.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            {/* Informations artiste */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-lg truncate">{artist.name}</h3>
              <p className="text-gray-400 text-sm mb-1">{artist.genre || "Musique"}</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-500 text-xs">
                  {artist.monthlyListeners ? `${artist.monthlyListeners.toLocaleString()} auditeurs mensuels` : "Nouveau artiste"}
                </p>
                {artist.country && (
                  <span className="text-gray-600 text-xs">• {artist.country}</span>
                )}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-2 ml-4">
              <Button
                size="sm"
                onClick={(e) => handleFollow(e, artist.id)}
                disabled={isFollowing[artist.id]}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs px-3 py-1"
              >
                {isFollowing[artist.id] ? "..." : "Suivre"}
              </Button>
              <Button
                size="sm"
                onClick={(e) => handleInvest(e, artist.id)}
                disabled={isInvesting[artist.id]}
                className="bg-green-500 hover:bg-green-600 text-white border-0 text-xs px-3 py-1 font-medium"
              >
                {isInvesting[artist.id] ? "..." : "Investir"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {artistUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">Aucun artiste trouvé</p>
          <p className="text-gray-500 text-sm mt-2">Les nouveaux artistes apparaîtront ici automatiquement</p>
        </div>
      )}
    </div>
  );
}
