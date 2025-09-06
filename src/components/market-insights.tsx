import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertCircle, Activity, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketInsight {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  trend: "up" | "down" | "stable";
  percentage: number;
  category: "market" | "genre" | "region";
}

interface PredictionModel {
  artistId: number;
  artistName: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  timeframe: string;
  factors: string[];
}

export default function MarketInsights() {
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [predictions, setPredictions] = useState<PredictionModel[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateInsights = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const mockInsights: MarketInsight[] = [
        {
          id: "1",
          title: "Afrobeats Genre Surge",
          description: "Afrobeats investments are up 45% this month, driven by global streaming growth",
          impact: "high",
          trend: "up",
          percentage: 45,
          category: "genre"
        },
        {
          id: "2", 
          title: "French Rap Market Expansion",
          description: "French rap artists showing 32% increase in international appeal",
          impact: "medium",
          trend: "up",
          percentage: 32,
          category: "region"
        },
        {
          id: "3",
          title: "K-Pop Stabilization",
          description: "K-Pop investments maintaining steady growth after previous boom",
          impact: "medium",
          trend: "stable",
          percentage: 8,
          category: "genre"
        },
        {
          id: "4",
          title: "Indie Market Opportunity",
          description: "Indie folk artists undervalued, potential for 25% returns",
          impact: "high",
          trend: "up",
          percentage: 25,
          category: "genre"
        }
      ];

      const mockPredictions: PredictionModel[] = [
        {
          artistId: 1,
          artistName: "Léo",
          currentPrice: 45.67,
          predictedPrice: 58.12,
          confidence: 87,
          timeframe: "3 months",
          factors: ["Viral TikTok growth", "Festival bookings", "Streaming velocity"]
        },
        {
          artistId: 3,
          artistName: "Kofi",
          currentPrice: 52.13,
          predictedPrice: 71.89,
          confidence: 92,
          timeframe: "6 months", 
          factors: ["Global expansion", "Label interest", "Cross-genre appeal"]
        }
      ];

      setInsights(mockInsights);
      setPredictions(mockPredictions);
      setIsAnalyzing(false);
    }, 2500);
  };

  useEffect(() => {
    generateInsights();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-400 border-red-400/30 bg-red-400/10";
      case "medium": return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      case "low": return "text-green-400 border-green-400/30 bg-green-400/10";
      default: return "text-gray-400 border-gray-400/30 bg-gray-400/10";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "down": return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Market Insights */}
      <div className="glass-effect-dark rounded-xl p-6 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-cyan-400 w-6 h-6" />
            <h3 className="text-xl font-bold text-white">Real-Time Market Insights</h3>
          </div>
          <Button
            onClick={generateInsights}
            disabled={isAnalyzing}
            size="sm"
            className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-400/30"
          >
            {isAnalyzing ? "Analyzing..." : "Refresh Insights"}
          </Button>
        </div>

        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="flex space-x-2 justify-center mb-4">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-0"></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
            </div>
            <p className="text-gray-400">Analyzing market trends...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-lg border ${getImpactColor(insight.impact)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(insight.trend)}
                    <h4 className="font-semibold text-white">{insight.title}</h4>
                  </div>
                  <span className="text-sm font-bold">
                    {insight.trend === "up" ? "+" : insight.trend === "down" ? "-" : ""}{insight.percentage}%
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{insight.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded-full capitalize">
                    {insight.category}
                  </span>
                  <span className="text-xs font-medium uppercase">
                    {insight.impact} Impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Predictive Analytics */}
      <div className="glass-effect-dark rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="text-purple-400 w-6 h-6" />
          <h3 className="text-xl font-bold text-white">AI Price Predictions</h3>
        </div>

        <div className="space-y-4">
          {predictions.map((prediction) => (
            <div key={prediction.artistId} className="bg-slate-800/50 rounded-lg p-4 border border-purple-400/20">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-white">{prediction.artistName}</h4>
                  <p className="text-gray-400 text-sm">{prediction.timeframe} outlook</p>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">
                    +{((prediction.predictedPrice / prediction.currentPrice - 1) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">{prediction.confidence}% confidence</div>
                </div>
              </div>
              
              <div className="flex justify-between mb-3">
                <div>
                  <span className="text-gray-400 text-sm">Current: </span>
                  <span className="text-white font-medium">${prediction.currentPrice}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Predicted: </span>
                  <span className="text-green-400 font-medium">${prediction.predictedPrice}</span>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-2">Key Factors:</p>
                <div className="flex flex-wrap gap-1">
                  {prediction.factors.map((factor, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}