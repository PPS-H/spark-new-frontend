import { useState, useEffect } from "react";
import { Brain, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Artist } from "@/types/artist";

interface Recommendation {
  artist: Artist;
  score: number;
  reason: string;
}

interface AIRecommendationsProps {
  userId?: number;
  onInvest: (artist: Artist) => void;
  onMessage?: (artist: Artist) => void;
  onViewProfile?: (artist: Artist) => void;
}

export default function AIRecommendations({ userId, onInvest, onMessage, onViewProfile }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchRecommendations = async () => {
      try {
        setIsAnalyzing(true);
        const res = await fetch(`/api/ai-recommendations?userId=${userId}`);
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error("Failed to fetch AI recommendations", err);
      } finally {
        setIsAnalyzing(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  return (
    <div className="glass-effect-dark rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="text-purple-400 w-6 h-6" />
        <h3 className="text-xl font-bold text-white">AI Investment Recommendations</h3>
      </div>

      {isAnalyzing ? (
        <div className="text-center py-8">
          <div className="animate-pulse">
            <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-bounce" />
            <p className="text-gray-400">AI analyzing market trends...</p>
            <div className="mt-4 flex space-x-2 justify-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-0"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const { artist } = rec;
            const fundingPct = ((parseFloat(artist.currentFunding || "0") / parseFloat(artist.fundingGoal || "1")) * 100).toFixed(1);

            return (
              <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-purple-400/20">
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0">
                  <div className="flex items-center space-x-3 flex-1">
                    <img 
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20 hover:border-purple-400/50 transition-all cursor-pointer"
                      onClick={() => onViewProfile?.(artist)}
                    />
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-semibold text-white text-lg cursor-pointer hover:text-purple-300 transition-colors truncate"
                        onClick={() => onViewProfile?.(artist)}
                      >
                        {artist.name}
                      </h4>
                      <p className="text-gray-400 text-sm capitalize">{artist.genre} • {artist.country}</p>
                    </div>
                    <div className="hidden sm:flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-bold text-lg">{rec.score}</span>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3 space-y-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs uppercase">Listeners</p>
                        <p className="text-white font-bold">{artist.monthlyListeners?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase">Goal</p>
                        <p className="text-green-400 font-bold">€{artist.fundingGoal}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase">ROI</p>
                        <p className="text-purple-400 font-bold">{artist.expectedReturn}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase">Risk</p>
                        <p className={`font-bold ${
                          artist.riskLevel === 'Low' ? 'text-green-400' :
                          artist.riskLevel === 'Medium' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>{artist.riskLevel}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{fundingPct}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${Math.min(+fundingPct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <p className="text-purple-300 text-sm font-medium">AI Analysis:</p>
                    <p className="text-gray-300 text-sm mt-1">{rec.reason}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => {
                        const artistSlug = artist.name.toLowerCase().replace(/\s+/g, '-');
                        window.location.href = `/invest/${artistSlug}`;
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                    >
                      Invest Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onMessage?.(artist)}
                      className="flex-1 border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}