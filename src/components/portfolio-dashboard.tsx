import { Wallet, TrendingUp, Music2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PortfolioChart from "@/components/charts/portfolio-chart";
import GenreChart from "@/components/charts/genre-chart";

interface PortfolioDashboardProps {
  userId: number;
}

export default function PortfolioDashboard({ userId }: PortfolioDashboardProps) {
  const { data: portfolioSummary } = useQuery({
    queryKey: ['/api/portfolio/summary', userId],
    enabled: !!userId,
  });

  const { data: investments = [] } = useQuery({
    queryKey: ['/api/investments/user', userId],
    enabled: !!userId,
  });

  if (!portfolioSummary) {
    return null;
  }

  return (
    <section id="portfolio" className="py-8 px-4 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold mb-6 text-cyan-400">Your Investment Dashboard</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Portfolio Stats Cards */}
          <div className="glass-effect-dark rounded-xl p-6 border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Invested</p>
                <p className="text-2xl font-bold text-white">
                  ${parseFloat(portfolioSummary.totalInvested).toLocaleString()}
                </p>
                <p className="text-green-400 text-sm">
                  {portfolioSummary.returnPercentage > 0 ? '+' : ''}
                  {parseFloat(portfolioSummary.returnPercentage).toFixed(1)}% return
                </p>
              </div>
              <Wallet className="text-cyan-400 text-2xl" />
            </div>
          </div>
          
          <div className="glass-effect-dark rounded-xl p-6 border border-pink-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Value</p>
                <p className="text-2xl font-bold text-white">
                  ${parseFloat(portfolioSummary.currentValue).toLocaleString()}
                </p>
                <p className="text-green-400 text-sm">
                  ${parseFloat(portfolioSummary.totalReturn).toLocaleString()} profit
                </p>
              </div>
              <TrendingUp className="text-pink-500 text-2xl" />
            </div>
          </div>
          
          <div className="glass-effect-dark rounded-xl p-6 border border-yellow-400/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Investments</p>
                <p className="text-2xl font-bold text-white">{portfolioSummary.activeInvestments}</p>
                <p className="text-yellow-400 text-sm">
                  {investments.filter((inv: any) => parseFloat(inv.returnPercentage) > 0).length} trending up
                </p>
              </div>
              <Music2 className="text-yellow-400 text-2xl" />
            </div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="glass-effect-dark rounded-xl p-4 border border-cyan-500/20">
            <h4 className="text-lg font-semibold mb-3 text-white">Portfolio Overview</h4>
            <PortfolioChart userId={userId} />
          </div>
        </div>
        
        <div className="glass-effect-dark rounded-xl p-4 border border-yellow-400/20">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-semibold text-white">Investment by Genre</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  // Export functionality would go here
                  alert('Export feature coming soon!');
                }}
                className="px-3 py-1 text-xs bg-slate-700 text-gray-300 rounded hover:bg-slate-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400/50"
                aria-label="Export portfolio data"
              >
                Export
              </button>
              <button
                onClick={() => {
                  // Refresh functionality would go here
                  window.location.reload();
                }}
                className="px-3 py-1 text-xs bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                aria-label="Refresh portfolio data"
              >
                Refresh
              </button>
            </div>
          </div>
          <GenreChart investments={investments} />
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => {
              const element = document.getElementById('discover');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            aria-label="Discover more artists to invest in"
          >
            Discover More Artists
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('analytics');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-6 py-3 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400/50"
            aria-label="View market analytics"
          >
            View Market Analytics
          </button>
        </div>
      </div>
    </section>
  );
}
