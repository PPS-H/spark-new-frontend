import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Activity,
  AlertCircle,
  CheckCircle,
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

interface Alert {
  type: 'success' | 'warning' | 'info';
  message: string;
}

export function AnalyticsUnified() {
  const [selectedArtist, setSelectedArtist] = useState<string>('1');

  // Query for artist analytics
  const { 
    data: artistAnalytics, 
    isLoading: loadingArtist, 
    error: artistError 
  } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics/artist', selectedArtist],
    enabled: !!selectedArtist
  });

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

        {/* Configuration Alert */}
        {artistError && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Configuration requise:</strong> Pour obtenir des données réelles, configurez vos clés API Spotify dans le fichier .env
              <div className="mt-2 text-sm">
                <code>SPOTIFY_CLIENT_ID</code> et <code>SPOTIFY_CLIENT_SECRET</code>
              </div>
            </AlertDescription>
          </Alert>
        )}

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

        {loadingArtist ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : artistAnalytics ? (
          <>
            {/* Artist Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
              
              '
              '        <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Streams</p>
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
          </>
        ) : null}
      </div>
    </div>
  );
}