import { useAuth } from "@/hooks/useAuthRTK";
import { useNavigate } from "react-router-dom";
import ArtistProfilePage from "@/components/artist-profile-page";

export default function Create() {
  const { user } = useAuth(); // Re-enabled useAuth
  const navigate = useNavigate();

  // Mock user data as fallback (you can remove this if useAuth is working)
  const mockUser = {
    id: 1,
    username: "artist_user",
    role: "artist",
    bio: "This is the artist bio",
    genre: "pop"
  };

  // Use real user or fallback to mock user
  const currentUser = user || mockUser;

  // Artist users get their profile page in edit mode
  if (currentUser?.role === "artist") {
    return (
      <ArtistProfilePage
        artist={{
          id: currentUser.id || 1,
          name: currentUser.username || "Artist Name",
          genre: currentUser.genre || "pop",
          country: "france",
          monthlyListeners: 425000,
          fundingGoal: "50000",
          currentFunding: "32500",
          expectedReturn: "15-25%",
          riskLevel: "Medium",
          streamingLinks: { spotify: "#", youtube: "#" },
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
          isActive: true,
          createdAt: new Date(),
          description: currentUser.bio || "Rising artist creating innovative music"
        }}
        onBack={() => navigate("/")}
        onMessage={() => {}}
        onInvest={() => {}}
        onFollow={() => {}}
        isOwner={true} // Artist viewing their own profile
      />
    );
  }

  // Non-artist users or default fallback
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Access Restricted</h1>
        <p className="text-gray-400 mb-6">This page is only available for artist accounts.</p>
        <button 
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
