import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Play } from "lucide-react";

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

export function RealTimeMetrics() {
  // DONNÉES STATIQUES SEULEMENT - Plus de temps réel
  const metrics: MetricCard[] = [
    {
      title: "Portfolio Total",
      value: "€24,156",
      change: "+12.3%",
      trend: 'up',
      icon: <DollarSign className="w-4 h-4" />,
      color: "text-green-400"
    },
    {
      title: "Active Investments",
      value: "18",
      change: "+2",
      trend: 'up',
      icon: <Users className="w-4 h-4" />,
      color: "text-blue-400"
    },
    {
      title: "Total Streams",
      value: "2.4M",
      change: "+156K",
      trend: 'up',
      icon: <Play className="w-4 h-4" />,
      color: "text-purple-400"
    },
    {
      title: "Monthly ROI",
      value: "8.7%",
      change: "-0.2%",
      trend: 'down',
      icon: <TrendingUp className="w-4 h-4" />,
      color: "text-orange-400"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header statique */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Portfolio Metrics</h3>
      </div>

      {/* Métriques statiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <span className={metric.color}>{metric.icon}</span>
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">
                {metric.value}
              </div>
              <div className={`text-sm flex items-center gap-1 ${
                metric.trend === 'up' ? 'text-green-400' : 
                metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : metric.trend === 'down' ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <Activity className="w-3 h-3" />
                )}
                {metric.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}

export default RealTimeMetrics;