import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity,
  Music,
  DollarSign,
  TrendingUp,
  Users
} from "lucide-react";

interface AnalyticsData {
  totalStreams: number;
  totalRevenue: number;
  monthlyGrowth: number;
  investorMetrics: {
    totalInvestors: number;
    totalInvested: number;
    averageReturn: number;
  };
  topTracks: Array<{
    trackId: string;
    name: string;
    streams: number;
    revenue: number;
  }>;
  platformBreakdown: Array<{
    platform: string;
    percentage: number;
    revenue: number;
  }>;
}

export function AnalyticsDashboard() {
  const [selectedArtist, setSelectedArtist] = useState<string>('1');

  // Mock data for selected artist
  const mockAnalyticsData: Record<string, AnalyticsData> = {
    '1': {
      totalStreams: 15420000,
      totalRevenue: 82450,
      monthlyGrowth: 12.5,
      investorMetrics: {
        totalInvestors: 245,
        totalInvested: 450000,
        averageReturn: 8.7
      },
      topTracks: [
        { trackId: '1', name: 'Tití Me Preguntó', streams: 3450000, revenue: 18200 },
        { trackId: '2', name: 'Me Porto Bonito', streams: 2890000, revenue: 15300 },
        { trackId: '3', name: 'Ojitos Lindos', streams: 2120000, revenue: 11200 },
        { trackId: '4', name: 'Party', streams: 1850000, revenue: 9800 },
        { trackId: '5', name: 'Efecto', streams: 1420000, revenue: 7500 }
      ],
      platformBreakdown: [
        { platform: 'Spotify', percentage: 45, revenue: 37100 },
        { platform: 'Apple Music', percentage: 28, revenue: 23100 },
        { platform: 'YouTube Music', percentage: 15, revenue: 12400 },
        { platform: 'Deezer', percentage: 8, revenue: 6600 },
        { platform: 'Amazon Music', percentage: 4, revenue: 3300 }
      ]
    },
    '2': {
      totalStreams: 22350000,
      totalRevenue: 125600,
      monthlyGrowth: 18.2,
      investorMetrics: {
        totalInvestors: 398,
        totalInvested: 720000,
        averageReturn: 11.4
      },
      topTracks: [
        { trackId: '1', name: 'Blinding Lights', streams: 5200000, revenue: 28600 },
        { trackId: '2', name: 'Save Your Tears', streams: 4100000, revenue: 22500 },
        { trackId: '3', name: 'The Hills', streams: 3800000, revenue: 20900 },
        { trackId: '4', name: 'Can\'t Feel My Face', streams: 3200000, revenue: 17600 },
        { trackId: '5', name: 'Starboy', streams: 2850000, revenue: 15700 }
      ],
      platformBreakdown: [
        { platform: 'Spotify', percentage: 52, revenue: 65300 },
        { platform: 'Apple Music', percentage: 24, revenue: 30100 },
        { platform: 'YouTube Music', percentage: 14, revenue: 17600 },
        { platform: 'Deezer', percentage: 6, revenue: 7500 },
        { platform: 'Amazon Music', percentage: 4, revenue: 5000 }
      ]
    },
    '3': {
      totalStreams: 31800000,
      totalRevenue: 189400,
      monthlyGrowth: 22.8,
      investorMetrics: {
        totalInvestors: 512,
        totalInvested: 1200000,
        averageReturn: 15.2
      },
      topTracks: [
        { trackId: '1', name: 'Anti-Hero', streams: 7200000, revenue: 42800 },
        { trackId: '2', name: 'Lavender Haze', streams: 5800000, revenue: 34500 },
        { trackId: '3', name: 'Shake It Off', streams: 5100000, revenue: 30300 },
        { trackId: '4', name: 'Blank Space', streams: 4200000, revenue: 25000 },
        { trackId: '5', name: 'Bad Blood', streams: 3500000, revenue: 20800 }
      ],
      platformBreakdown: [
        { platform: 'Spotify', percentage: 48, revenue: 90900 },
        { platform: 'Apple Music', percentage: 26, revenue: 49200 },
        { platform: 'YouTube Music', percentage: 16, revenue: 30300 },
        { platform: 'Deezer', percentage: 6, revenue: 11400 },
        { platform: 'Amazon Music', percentage: 4, revenue: 7600 }
      ]
    },
    '4': {
      totalStreams: 28200000,
      totalRevenue: 158900,
      monthlyGrowth: 16.7,
      investorMetrics: {
        totalInvestors: 445,
        totalInvested: 890000,
        averageReturn: 13.1
      },
      topTracks: [
        { trackId: '1', name: 'God\'s Plan', streams: 6100000, revenue: 36400 },
        { trackId: '2', name: 'One Dance', streams: 5400000, revenue: 32200 },
        { trackId: '3', name: 'Hotline Bling', streams: 4800000, revenue: 28600 },
        { trackId: '4', name: 'In My Feelings', streams: 4200000, revenue: 25000 },
        { trackId: '5', name: 'Nice For What', streams: 3700000, revenue: 22000 }
      ],
      platformBreakdown: [
        { platform: 'Spotify', percentage: 46, revenue: 73100 },
        { platform: 'Apple Music', percentage: 29, revenue: 46100 },
        { platform: 'YouTube Music', percentage: 15, revenue: 23800 },
        { platform: 'Deezer', percentage: 7, revenue: 11100 },
        { platform: 'Amazon Music', percentage: 3, revenue: 4800 }
      ]
    }
  };

  const artistAnalytics = mockAnalyticsData[selectedArtist];

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatNumber = (num: number) => 
    new Intl.NumberFormat('fr-FR').format(num);

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Analytics SPARK</h1>
            <p className="text-sm md:text-base text-muted-foreground">Tableau de bord analytics temps réel</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-2 text-xs md:text-sm">
              <Activity className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
              Temps Réel
            </Badge>
          </div>
        </div>

        {/* Artist Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Sélectionner un Artiste</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {[
                { id: '1', name: 'Bad Bunny' },
                { id: '2', name: 'The Weeknd' },
                { id: '3', name: 'Taylor Swift' },
                { id: '4', name: 'Drake' }
              ].map(artist => (
                <Button
                  key={artist.id}
                  variant={selectedArtist === artist.id ? "default" : "outline"}
                  onClick={() => setSelectedArtist(artist.id)}
                  className="text-xs md:text-sm p-2 h-auto"
                >
                  {artist.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Artist Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Streams</p>
                  <p className="text-lg md:text-2xl font-bold">{formatNumber(artistAnalytics.totalStreams)}</p>
                </div>
                <Music className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Revenus Total</p>
                  <p className="text-lg md:text-2xl font-bold">{formatCurrency(artistAnalytics.totalRevenue)}</p>
                </div>
                <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Croissance Mensuelle</p>
                  <p className="text-lg md:text-2xl font-bold">+{artistAnalytics.monthlyGrowth}%</p>
                </div>
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Investisseurs</p>
                  <p className="text-lg md:text-2xl font-bold">{artistAnalytics.investorMetrics.totalInvestors}</p>
                </div>
                <Users className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Tracks */}
        <Card>
          <CardHeader>
            <CardTitle>Top Tracks</CardTitle>
            <CardDescription>Les 5 titres les plus performants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {artistAnalytics.topTracks.map((track, index) => (
                <div key={track.trackId} className="flex items-center justify-between p-2 md:p-3 rounded-lg border">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Badge variant="secondary" className="text-xs">#{index + 1}</Badge>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm md:text-base truncate">{track.name}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{formatNumber(track.streams)} streams</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm md:text-base">{formatCurrency(track.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Plateforme</CardTitle>
            <CardDescription>Revenus par plateforme de streaming</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {artistAnalytics.platformBreakdown.map((platform) => (
                <div key={platform.platform} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{platform.platform}</span>
                    <span>{platform.percentage}% • {formatCurrency(platform.revenue)}</span>
                  </div>
                  <Progress value={platform.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
