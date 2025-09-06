import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Search, Filter, X, MapPin, Hash } from "lucide-react";
import SLogo from "@/components/s-logo";
import type { Artist } from "@/types/artist";

interface FunctionalSearchProps {
  onArtistSelect?: (artist: Artist) => void;
}

export default function FunctionalSearch({ onArtistSelect }: FunctionalSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data: artists = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/artists", { genre: selectedGenre, country: selectedCountry }],
    enabled: true
  });

  const filteredArtists = artists.filter((artist: Artist) =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const genres = ["all", "rap", "pop", "afrobeats", "k-pop", "j-pop", "indie", "rock", "jazz", "electronic"];
  const countries = ["all", "USA", "UK", "Canada", "Australia", "Germany", "France", "Japan", "South Korea", "Nigeria"];

  useEffect(() => {
    refetch();
  }, [selectedGenre, selectedCountry, refetch]);

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedGenre("all");
    setSelectedCountry("all");
    setShowFilters(false);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search artists, genres, countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-slate-700 text-white"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    <Hash className="w-4 h-4 inline mr-1" />
                    Genre
                  </label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                  >
                    {genres.map(genre => (
                      <option key={genre} value={genre}>
                        {genre === "all" ? "All Genres" : genre.charAt(0).toUpperCase() + genre.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                  >
                    {countries.map(country => (
                      <option key={country} value={country}>
                        {country === "all" ? "All Countries" : country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  {selectedGenre !== "all" && (
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                      {selectedGenre}
                      <button
                        onClick={() => setSelectedGenre("all")}
                        className="ml-1 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedCountry !== "all" && (
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                      {selectedCountry}
                      <button
                        onClick={() => setSelectedCountry("all")}
                        className="ml-1 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-white"
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {searchTerm ? `Search Results for "${searchTerm}"` : "Discover Artists"}
          </h3>
          <Badge variant="outline" className="border-slate-600 text-gray-300">
            {filteredArtists.length} {filteredArtists.length === 1 ? "artist" : "artists"}
          </Badge>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
                <CardContent className="p-4">
                  <div className="w-full h-32 bg-slate-700 rounded mb-3"></div>
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredArtists.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArtists.map((artist: Artist) => (
              <Card
                key={artist.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer"
                onClick={() => onArtistSelect?.(artist)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <SLogo className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{artist.name}</h4>
                      <p className="text-sm text-gray-400">{artist.genre}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Country</span>
                      <span className="text-white">{artist.country}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Funding Goal</span>
                      <span className="text-white">${artist.fundingGoal}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Streams</span>
                      <span className="text-white">{artist.monthlyStreams?.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (parseFloat(artist.currentFunding) / parseFloat(artist.fundingGoal)) * 100,
                            100
                          )}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>${artist.currentFunding} raised</span>
                      <span>
                        {Math.round(
                          (parseFloat(artist.currentFunding) / parseFloat(artist.fundingGoal)) * 100
                        )}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No artists found</h3>
              <p className="text-gray-400">
                Try adjusting your search terms or filters to find artists.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}