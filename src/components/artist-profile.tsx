import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Camera, 
  Link, 
  Eye, 
  EyeOff, 
  Edit3, 
  Save,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Music,
  Star,
  Heart,
  Share2
} from "lucide-react";

interface ArtistProfileProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
}

export default function ArtistProfile({ isEditing, onEdit, onSave }: ArtistProfileProps) {
  const [profileData, setProfileData] = useState({
    displayName: "Luna Skyward",
    bio: "Indie pop artist blending ethereal melodies with urban beats. Creating soundscapes that transport listeners to otherworldly dimensions.",
    location: "Berlin, Germany",
    website: "https://lunaskyward.com",
    email: "hello@lunaskyward.com",
    phone: "+49 30 12345678",
    genres: ["Indie Pop", "Electronic", "Dream Pop"],
    influences: ["Björk", "FKA twigs", "Grimes", "Radiohead"],
    achievements: [
      "500K+ streams on Spotify",
      "Featured in Apple Music New Artists",
      "Performed at Berlin Music Week 2024",
      "Collaboration with Grammy-winning producer"
    ]
  });

  const [isPublic, setIsPublic] = useState(true);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="artist-metric-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Music className="w-12 h-12 text-white" />
                </div>
                {isEditing && (
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-purple-500 hover:bg-purple-600"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div>
                {isEditing ? (
                  <Input
                    value={profileData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    className="text-xl font-bold bg-slate-800/50 border-slate-600 text-white mb-2"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-white">{profileData.displayName}</h1>
                )}
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className="bg-purple-500/20 text-purple-300">Artist Pro</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPublic(!isPublic)}
                    className="text-gray-400 hover:text-white p-0 h-auto"
                  >
                    {isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span className="ml-1">{isPublic ? 'Public' : 'Private'}</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <Button onClick={onSave} className="bg-green-500 hover:bg-green-600">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              ) : (
                <Button onClick={onEdit} variant="outline" className="border-purple-500/30 text-purple-300">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button variant="outline" className="border-cyan-500/30 text-cyan-300">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-2">Biography</h3>
            {isEditing ? (
              <Textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white"
                rows={4}
              />
            ) : (
              <p className="text-gray-300">{profileData.bio}</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <Input
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      placeholder="Location"
                    />
                  ) : (
                    <span className="text-gray-300">{profileData.location}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <Input
                      value={profileData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      placeholder="Website"
                    />
                  ) : (
                    <a href={profileData.website} className="text-cyan-400 hover:text-cyan-300">
                      {profileData.website}
                    </a>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <Input
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      placeholder="Email"
                    />
                  ) : (
                    <span className="text-gray-300">{profileData.email}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <Input
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      placeholder="Phone"
                    />
                  ) : (
                    <span className="text-gray-300">{profileData.phone}</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Musical Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-sm">Genres</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profileData.genres.map((genre, index) => (
                      <Badge key={index} className="bg-purple-500/20 text-purple-300">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Influences</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profileData.influences.map((influence, index) => (
                      <Badge key={index} className="bg-blue-500/20 text-blue-300">
                        {influence}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements & Portfolio */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profileData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">{achievement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-400" />
              Fan Stats Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Streams</span>
                <span className="text-white font-semibold">2.3M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Monthly Listeners</span>
                <span className="text-white font-semibold">78.4K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Supporters</span>
                <span className="text-white font-semibold">1.2K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Label Interest</span>
                <span className="text-green-400 font-semibold">High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Portfolio */}
      <Card className="artist-metric-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Camera className="w-5 h-5 mr-2 text-cyan-400" />
            Media Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 flex items-center justify-center">
              <Camera className="w-8 h-8 text-purple-400" />
            </div>
            <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30 flex items-center justify-center">
              <Music className="w-8 h-8 text-blue-400" />
            </div>
            <div className="aspect-square bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg border border-green-500/30 flex items-center justify-center">
              <Upload className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}