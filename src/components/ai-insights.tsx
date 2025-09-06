import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Brain, TrendingUp, Users, DollarSign, Music,
  Target, Globe, Heart, Clock, Award, Zap, Star
} from "lucide-react";

const ICONS: Record<string, any> = {
  Brain, TrendingUp, Users, DollarSign, Music,
  Target, Globe, Heart, Clock, Award, Zap, Star
};

interface Insight {
  id: number;
  type: string;
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  action: string;
  icon: keyof typeof ICONS;
  color: string;
}

interface Predictions {
  nextMonth: {
    streams: number;
    newFans: number;
    revenue: number;
    campaigns: number;
  };
  confidence: number;
  factors: string[];
}

export default function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [predictions, setPredictions] = useState<Predictions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch("/api/ai-insights");
        const data = await res.json();
        setInsights(data.insights || []);
        setPredictions(data.predictions || null);
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "low": return "bg-green-500/20 text-green-300 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  if (loading) {
    return <p className="text-white text-sm">Loading AI insights...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Brain className="w-6 h-6 mr-3 text-cyan-400" />
            AI Insights
          </h2>
          <p className="text-gray-400">AI-powered recommendations for your music career</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-300">
          <Zap className="w-3 h-3 mr-1" />
          {insights.length} new insights
        </Badge>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        {insights.map((insight) => {
          const Icon = ICONS[insight.icon] || Brain;
          return (
            <Card key={insight.id} className="artist-metric-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${insight.color} bg-opacity-20`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact} impact
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-300">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{insight.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-xs text-gray-400">AI Recommendation</span>
                  </div>
                  <Button size="sm" className={`bg-gradient-to-r ${insight.color}`}>
                    {insight.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Predictions */}
      {predictions && (
        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Star className="w-5 h-5 mr-2 text-cyan-400" />
              Next Month Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Metric label="Predicted Streams" value={`+${predictions.nextMonth.streams.toLocaleString()}`} icon={<TrendingUp className="w-8 h-8 text-green-400" />} />
                <Metric label="New Fans" value={`+${predictions.nextMonth.newFans.toLocaleString()}`} icon={<Users className="w-8 h-8 text-blue-400" />} />
                <Metric label="Potential Revenue" value={`€${predictions.nextMonth.revenue.toLocaleString()}`} icon={<DollarSign className="w-8 h-8 text-yellow-400" />} />
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{predictions.confidence}%</div>
                  <p className="text-gray-400 text-sm mb-4">Prediction Confidence</p>
                  <Progress value={predictions.confidence} className="h-3" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-white font-semibold">Based on:</h4>
                  {predictions.factors.map((factor, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                      <span className="text-gray-300 text-sm">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: JSX.Element }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
      <div>
        <span className="text-gray-400 text-sm">{label}</span>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      {icon}
    </div>
  );
}