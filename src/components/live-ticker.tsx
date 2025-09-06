import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface TickerData {
  artistName: string;
  change: number;
  price: number;
  volume: number;
}

export default function LiveTicker() {
  const [tickerData, setTickerData] = useState<TickerData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // DONNÉES STATIQUES SEULEMENT - Plus de mises à jour automatiques
    const staticData: TickerData[] = [
      { artistName: "Léo", change: 2.3, price: 45.67, volume: 8500 },
      { artistName: "Aria", change: -1.5, price: 38.92, volume: 6200 },
      { artistName: "Kofi", change: 4.1, price: 52.13, volume: 9800 },
      { artistName: "Luna", change: 0.8, price: 41.85, volume: 7300 },
      { artistName: "Yuki", change: -0.6, price: 47.29, volume: 5900 },
    ];
    setTickerData(staticData);
    setIsConnected(false); // Toujours déconnecté
  }, []);

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border-y border-cyan-400/20 py-3 overflow-hidden">
      <div className="flex items-center space-x-2 mb-2">
        <Activity className={`w-4 h-4 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
        <span className="text-xs text-gray-400">LIVE MARKET DATA</span>
      </div>
      
      <div className="flex animate-marquee space-x-8">
        {tickerData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
            <span className="text-white font-medium">{item.artistName}</span>
            <span className="text-cyan-400">${item.price.toFixed(2)}</span>
            <div className={`flex items-center space-x-1 ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="text-xs">{item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%</span>
            </div>
            <span className="text-gray-500 text-xs">Vol: {item.volume.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}