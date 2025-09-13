  import InvestmentList from "@/components/InvestmentList";

export default function PortfolioPage() {
  return (
    <main className="p-6 pb-24">
      <h1 className="text-white text-2xl font-bold mb-6">Your Investments</h1>
      <InvestmentList />
    </main>
  );
}