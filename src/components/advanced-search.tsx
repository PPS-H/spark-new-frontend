import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SLogo from "@/components/s-logo";

interface SearchSuggestion {
  id: string;
  text: string;
  type: "artist" | "genre" | "country";
  count?: number;
}

interface AdvancedSearchProps {
  onSearch: (term: string) => void;
  onFilter: (filters: any) => void;
}

export default function AdvancedSearch({ onSearch, onFilter }: AdvancedSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
        const data: SearchSuggestion[] = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    if (searchTerm.length > 0) {
      fetchSuggestions();
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.text);
    onSearch(suggestion.text);
    setShowSuggestions(false);

    if (suggestion.type !== "artist") {
      const filter = `${suggestion.type}:${suggestion.text}`;
      if (!selectedFilters.includes(filter)) {
        const updated = [...selectedFilters, filter];
        setSelectedFilters(updated);
        onFilter(updated);
      }
    }
  };

  const removeFilter = (filter: string) => {
    const updated = selectedFilters.filter(f => f !== filter);
    setSelectedFilters(updated);
    onFilter(updated);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "artist": return "👤";
      case "genre": return <SLogo size={16} />;
      case "country": return "🌍";
      default: return "🔍";
    }
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search artists, genres, countries..."
          className="pl-10 pr-10 bg-slate-800 border-gray-600 text-white focus:border-cyan-400 transition-all duration-300"
          onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              onSearch("");
              setShowSuggestions(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
                <div>
                  <span className="text-white group-hover:text-cyan-400">{suggestion.text}</span>
                  <span className="text-gray-400 text-sm ml-2 capitalize">{suggestion.type}</span>
                </div>
              </div>
              {suggestion.count && (
                <span className="text-gray-500 text-sm">{suggestion.count} results</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      {selectedFilters.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="bg-cyan-500/20 text-cyan-300">
              {filter.split(':')[1]}
              <button
                onClick={() => removeFilter(filter)}
                className="ml-2 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}