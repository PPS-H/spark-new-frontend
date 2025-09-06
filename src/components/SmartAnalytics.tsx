import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface SmartAnalyticsProps {
  data: {
    growth: {
      daily: { value: number; change: number };
      weekly: { value: number; change: number };
      monthly: { value: number; change: number };
    };
    geoData: any[];
    conversion: any;
    campaigns: any[];
    predictions: any;
  };
  timeframe: "daily" | "weekly" | "monthly";
  onTimeframeChange: (timeframe: "daily" | "weekly" | "monthly") => void;
}

export default function SmartAnalytics({
  data,
  timeframe,
  onTimeframeChange,
}: SmartAnalyticsProps) {
  const [currentData, setCurrentData] = useState(data.growth[timeframe]);

  useEffect(() => {
    setCurrentData(data.growth[timeframe]);
  }, [timeframe, data]);

  const timeframes = ["daily", "weekly", "monthly"] as const;

  return (
    <Card className="bg-[#0d0d0d] border border-gray-800 text-white">
      <CardHeader>
        <CardTitle>Smart Analytics</CardTitle>
        <div className="flex space-x-2 mt-2">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              size="sm"
              variant={tf === timeframe ? "default" : "outline"}
              onClick={() => onTimeframeChange(tf)}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {currentData ? (
          <div>
            <p className="text-lg font-semibold mb-2">
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Growth
            </p>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-3xl font-bold">
                ${currentData.value.toLocaleString()}
              </span>
              <Badge
                variant={currentData.change >= 0 ? "success" : "destructive"}
              >
                {currentData.change >= 0 ? "+" : ""}
                {currentData.change}%
              </Badge>
            </div>
            <Progress
              value={Math.min(100, Math.abs(currentData.change))}
              className="h-2"
            />
          </div>
        ) : (
          <p className="text-gray-400">Aucune donnée disponible.</p>
        )}
      </CardContent>
    </Card>
  );
}