import InvestmentList from "@/components/InvestmentList";
import { useTranslation } from "react-i18next";

export default function PortfolioPage() {
  const { t } = useTranslation();
  
  return (
    <main className="p-6 pb-24">
      <h1 className="text-white text-2xl font-bold mb-6">{t('labelPortfolio.yourInvestments')}</h1>
      <InvestmentList />
    </main>
  );
}