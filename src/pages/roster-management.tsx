import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search, MessageCircle, DollarSign, TrendingUp, Star, ArrowLeft, Plus, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfessionalInbox from "@/components/professional-inbox";

export default function RosterManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfessionalInbox, setShowProfessionalInbox] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock artists data (replacing useQuery API call)
  const mockArtists = [
    {
      id: 1,
      name: "Sophia Martinez",
      genre: "Pop",
      imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b277?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
    },
    {
      id: 2,
      name: "Marcus Thompson",
      genre: "R&B",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      genre: "Electronic",
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
    },
    {
      id: 4,
      name: "James Wilson",
      genre: "Hip Hop",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
    },
    {
      id: 5,
      name: "Aria Chen",
      genre: "Indie",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
    },
    {
      id: 6,
      name: "Diego Santos",
      genre: "Latin",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
    }
  ];

  // Map mock artists to roster data
  const signedArtists = mockArtists.slice(0, 4).map((artist, index) => ({
    id: artist.id,
    name: artist.name,
    genre: artist.genre,
    status: index % 3 === 0 ? "pending" : index % 3 === 1 ? "active" : "inactive",
    contract: `${2 + index} years`,
    revenue: `€${(15000 + index * 3000).toLocaleString()}`,
    streams: `${(1.5 + index * 0.5).toFixed(1)}M`,
    image: artist.imageUrl || "https://images.unsplash.com/photo-1494790108755-2616c9c20e51?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextMilestone: ["Album release", "Tour planning", "Contract renewal", "Studio session"][index % 4]
  }));

  const filteredArtists = signedArtists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         artist.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || artist.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Mock loading state (set to false to show content immediately)
  const isLoading = false;

  // Show loading state (keeping original UI element)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des artistes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-white">Manage Roster</h1>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Plus className="w-4 h-4 mr-2" />
            Sign New Artist
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search artists by name or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Artists Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700 hover:scale-105 transition-all duration-300 group cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={artist.image} 
                      alt={artist.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
                    />
                    <div>
                      <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors">
                        {artist.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{artist.genre}</p>
                    </div>
                  </div>
                  <Badge 
                    className={`${
                      artist.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      artist.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {artist.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Revenue</p>
                    <p className="text-green-400 font-bold text-xl">{artist.revenue}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Streams</p>
                    <p className="text-white font-bold text-xl">{artist.streams}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Contract</p>
                    <p className="text-white font-semibold text-base">{artist.contract}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Joined</p>
                    <p className="text-white font-semibold text-base">{new Date(artist.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-gray-400 text-sm mb-2">Next Milestone:</p>
                  <p className="text-cyan-400 font-medium text-sm">{artist.nextMilestone}</p>
                </div>

                <div className="flex space-x-2 pt-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-xs"
                    onClick={() => navigate(`/artist/${artist.id}`)}
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Profile
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-green-400 text-green-400 hover:bg-green-400 hover:text-white text-xs"
                    onClick={() => setShowProfessionalInbox(true)}
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredArtists.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Artists Found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filter settings"
                : "Start building your roster by signing new artists"
              }
            </p>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={() => navigate('/search')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Discover New Talent
            </Button>
          </div>
        )}
      </div>

      {/* Professional Inbox Modal */}
      {showProfessionalInbox && (
        <ProfessionalInbox onClose={() => setShowProfessionalInbox(false)} />
      )}
    </div>
  );
}
