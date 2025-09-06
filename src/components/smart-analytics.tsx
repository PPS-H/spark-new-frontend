interface SmartAnalyticsProps {
  data: {
    growth: {
      daily: any;
      weekly: any;
      monthly: any;
    };
    geoData: any[];
    conversion: any;
    campaigns: any[];
    predictions: any;
  };
  timeframe: "daily" | "weekly" | "monthly";
  onTimeframeChange: (timeframe: "daily" | "weekly" | "monthly") => void;
}

export default function SmartAnalytics({ data, timeframe, onTimeframeChange }: SmartAnalyticsProps) {
  const currentData = data?.growth?.[timeframe] ?? null;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Streams</div>
          <div className="text-2xl font-bold">{currentData?.streams || 0}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Revenus</div>
          <div className="text-2xl font-bold">€{currentData?.revenue || 0}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Fans</div>
          <div className="text-2xl font-bold">{currentData?.fans || 0}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Engagement</div>
          <div className="text-2xl font-bold">{currentData?.engagement || 0}%</div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {['daily', 'weekly', 'monthly'].map((period) => (
          <button
            key={period}
            onClick={() => onTimeframeChange(period as any)}
            className={`px-3 py-1 rounded text-sm ${
              timeframe === period
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {period === 'daily' ? 'Jour' : period === 'weekly' ? 'Semaine' : 'Mois'}
          </button>
        ))}
      </div>
    </div>
  );
}