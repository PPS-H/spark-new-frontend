import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Settings
} from 'lucide-react';

export function AnalyticsNavigation() {
  const [location] = useLocation();

  const navItems = [
    {
      path: '/analytics-dashboard',
      label: 'Analytics Complètes',
      icon: BarChart3,
      description: 'Tableau de bord complet'
    },
    {
      path: '/analytics',
      label: 'Analytics Basiques',
      icon: TrendingUp,
      description: 'Vue d\'ensemble simple'
    },
    {
      path: '/portfolio',
      label: 'Portfolio',
      icon: PieChart,
      description: 'Investissements'
    }
  ];

  return (
    <div className="flex items-center gap-2 p-4 border-b">
      <div className="flex items-center gap-2 mr-4">
        <Activity className="h-5 w-5 text-green-500" />
        <span className="font-semibold">SPARK Analytics</span>
        <Badge variant="outline" className="text-green-600">
          Temps Réel
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>
      
      <div className="ml-auto">
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}