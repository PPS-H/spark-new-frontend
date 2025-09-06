import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface PortfolioChartProps {
  userId: number;
}

export default function PortfolioChart({ userId }: PortfolioChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const { data: portfolioHistory = [] } = useQuery({
    queryKey: ["/api/portfolio/history", userId],
    queryFn: async () => {
      const res = await fetch(`/api/portfolio/history?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch portfolio history");
      return await res.json();
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (!chartRef.current || !portfolioHistory.length) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = portfolioHistory.map((entry: any) => entry.date);
    const data = portfolioHistory.map((entry: any) => entry.value);

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Portfolio Value",
            data,
            borderColor: "#00ffcc",
            backgroundColor: "rgba(0, 255, 204, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#ffffff",
            },
          },
        },
        scales: {
          y: {
            ticks: {
              color: "#ffffff",
              callback: (value: number) => "$" + value.toLocaleString(),
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          x: {
            ticks: {
              color: "#ffffff",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
      },
    });
  }, [portfolioHistory]);

  return <canvas ref={chartRef} className="w-full h-64" />;
}