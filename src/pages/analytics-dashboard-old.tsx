import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnalyticsNavigation } from '@/components/analytics-navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Music, 
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  artistId: string;
  totalStreams: number;
  totalRevenue: number;
  monthlyGrowth: number;
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
  investorMetrics: {
    totalInvestors: number;
    averageInvestment: number;
    totalInvestmentAmount: number;
    monthlyROI: number;
  };
}

interface PortfolioData {
  totalInvested: number;
  totalRevenue: number;
  totalROI: number;
  investments: Array<{
    artistId: string;
    artistName: string;
    invested: number;
    currentValue: number;
    roi: number;
    monthlyRevenue: number;
  }>;
}

interface Alert {
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

export function AnalyticsDashboard() {
  const [selectedArtist, setSelectedArtist] = useState<string>('1');
  const [userId] = useState<number>(1); // In real app, get from auth context

  // Query for artist analytics
  const { 
    data: artistAnalytics, 
    isLoading: loadingArtist, 
    error: artistError 
  } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics/artist', selectedArtist],
    enabled: !!selectedArtist
  });

  // Query for portfolio analytics (if investor)
  const { 
    data: portfolioData, 
    isLoading: loadingPortfolio, 
    error: portfolioError 
  } = useQuery<PortfolioData>({
    queryKey: ['/api/analytics/portfolio', userId]
  });

  // Query for alerts
  const { 
    data: alerts, 
    isLoading: loadingAlerts 
  } = useQuery<Alert[]>({
    queryKey: ['/api/analytics/alerts', userId]
  });

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatNumber = (num: number) => 
    new Intl.NumberFormat('fr-FR').format(num);

  return (
    <div className="min-h-screen bg-background">
      <AnalyticsNavigation />
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto">
      {/* Header - Mobile Optimized */}
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
      {(artistError || portfolioError) && (
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

      {/* Real-time Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Alertes Temps Réel
          </h3>
          {alerts.map((alert, index) => (
            <Alert key={index} className={`
              ${alert.type === 'success' ? 'border-green-200 bg-green-50' : ''}
              ${alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : ''}
              ${alert.type === 'info' ? 'border-blue-200 bg-blue-50' : ''}
            `}>
              <AlertDescription>
                <strong>{alert.title}:</strong> {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="artist" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="artist" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Analytics Artiste
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Portfolio Investisseur
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
        </TabsList>

        {/* Artist Analytics Tab */}
        <TabsContent value="artist" className="space-y-6">
          {/* Artist Selector - Mobile Optimized */}
          <Card>
            <CardHeader>
              <CardTitle>Sélectionner un Artiste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {[
                  { id: '1', name: 'Bad Bunny' },
                  { id: '2', name: 'The Weeknd' },
                  { id: '3', name: 'Taylor Swift' },
                  { id: '4', name: 'Drake' },
                  { id: '19', name: 'Ed Sheeran' },
                  { id: '32', name: 'Billie Eilish' },
                  { id: '33', name: 'Post Malone' },
                  { id: '41', name: 'Adele' }
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
              {/* Artist Metrics Cards - Mobile Optimized */}
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
                        <p className="text-lg md:text-02xl font-bold">{formatCurrency(artistAnalytics.totalRevenue)}</p>
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
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Configuration requise</p>
                  <p className="text-muted-foreground">Configurez vos clés API Spotify pour afficher les analytics</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          {loadingPortfolio ? (
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : portfolioData ? (
            <>
              {/* Portfolio Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Investi</p>
                        <p className="text-2xl font-bold">{formatCurrency(portfolioData.totalInvested)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Valeur Actuelle</p>
                        <p className="text-2xl font-bold">{formatCurrency(portfolioData.totalRevenue)}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ROI Total</p>
                        <p className={`text-2xl font-bold ${portfolioData.totalROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {portfolioData.totalROI >= 0 ? '+' : ''}{portfolioData.totalROI.toFixed(1)}%
                        </p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Portfolio Investments */}
              <Card>
                <CardHeader>
                  <CardTitle>Vos Investissements</CardTitle>
                  <CardDescription>Détail de votre portefeuille d'investissements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolioData.investments.map((investment) => (
                      <div key={investment.artistId} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {investment.artistName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">{investment.artistName}</p>
                            <p className="text-sm text-muted-foreground">
                              Investi: {formatCurrency(investment.invested)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(investment.currentValue)}</p>
                          <p className={`text-sm ${investment.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {investment.roi >= 0 ? '+' : ''}{investment.roi.toFixed(1)}% ROI
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Aucun investissement trouvé</p>
                  <p className="text-muted-foreground">Commencez à investir pour voir votre portfolio ici</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vue d'ensemble du Système</CardTitle>
              <CardDescription>État global de la plateforme SPARK</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Stripe Payments
                  </span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Configuré
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    Spotify API
                  </span>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                    Requis
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Base de données
                  </span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Opérationnel
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    KYC/AML Service
                  </span>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    Optionnel
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-semibold">Configuration suivante recommandée:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Configurer SPOTIFY_CLIENT_ID et SPOTIFY_CLIENT_SECRET</li>
                  <li>Ajouter SESSION_SECRET pour la sécurité des sessions</li>
                  <li>Optionnel: Configurer Sumsub pour KYC/AML</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}