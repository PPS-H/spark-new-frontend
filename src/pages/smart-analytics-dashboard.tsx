import SmartAnalytics from "@/components/smart-analytics";
import { useState } from "react";

export default function SmartAnalyticsDashboardPage() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("weekly");

  const dummyData = {
    growth: {
      daily: { fans: 120, streams: 4300, engagement: 7, revenue: 250 },
      weekly: { fans: 850, streams: 27800, engagement: 14, revenue: 1600 },
      monthly: { fans: 3200, streams: 113000, engagement: 11, revenue: 6700 },
    },
    geoData: [
      { country: "France", percentage: 36, streams: 40200, supporters: 180 },
      { country: "USA", percentage: 25, streams: 28000, supporters: 90 },
      { country: "UK", percentage: 20, streams: 22000, supporters: 60 },
      { country: "Germany", percentage: 19, streams: 19000, supporters: 40 },
    ],
    conversion: {
      listeners: 10000,
      supporters: 1200,
      buyers: 420,
      vipFans: 38,
      conversionRate: 12,
      supporterRate: 12,
      buyerRate: 4.2,
    },
    campaigns: [
      { name: "Album Launch", raised: 3400, goal: 5000, supporters: 160, performance: 68, timeLeft: "7 days" },
      { name: "European Tour", raised: 7800, goal: 10000, supporters: 240, performance: 78, timeLeft: "3 weeks" },
    ],
    predictions: {
      nextMonthStreams: 148000,
      nextMonthFans: 4200,
      potentialRevenue: 7200,
      raisingPotential: 9300,
      confidence: 88,
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <SmartAnalytics
        data={dummyData}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
      />
    </div>
  );
}