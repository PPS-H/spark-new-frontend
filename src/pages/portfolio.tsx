import InvestmentList from "@/components/InvestmentList";
import { useTranslation } from "react-i18next";

export default function PortfolioPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Solid base layer to avoid white flash on initial paint/scroll */}
      <div className="fixed inset-0 bg-[#0B0B15] z-0" />
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(122,90,248,0.1)_0%,transparent_50%)] pointer-events-none transform-gpu [will-change:transform]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none transform-gpu [will-change:transform]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none transform-gpu [will-change:transform]" />
      
      <main className="relative z-10 p-4 sm:p-6 pb-24">
        {/* Premium Header */}
        <div 
          className="text-center space-y-4 pt-6 sm:pt-8 rounded-3xl mx-4 sm:mx-0 p-8 sm:p-12 relative overflow-hidden mb-8 md:backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, #0B0B15 0%, #141428 70%, rgba(122,90,248,0.08) 100%)',
            border: '1px solid rgba(122, 90, 248, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 animate-pulse transform-gpu [will-change:transform,opacity]" />
          <div className="absolute top-4 right-4 w-2 h-2 bg-[#7A5AF8] rounded-full animate-ping" />
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-[#FFD580] rounded-full animate-pulse" />
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white px-4 mb-4 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
            {t('labelPortfolio.yourInvestments')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 px-4 font-medium">
            Track and manage your investment portfolio
          </p>
        </div>
        
        <InvestmentList />
      </main>
    </div>
  );
}