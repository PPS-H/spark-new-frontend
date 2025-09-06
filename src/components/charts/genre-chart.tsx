import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface GenreChartProps {
  investments: {
    amount: number;
    artist: {
      genre: string;
    };
  }[];
}

export default function GenreChart({ investments }: GenreChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const genreDistribution = investments.reduce((acc: Record<string, number>, inv) => {
      const genre = inv.artist?.genre || "Unknown";
      const amount = Number(inv.amount);
      acc[genre] = (acc[genre] || 0) + amount;
      return acc;
    }, {});

    const labels = Object.keys(genreDistribution);
    const data = Object.values(genreDistribution);

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
              "#00FF99",
            ],
            borderColor: "#111827",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#ffffff",
              padding: 15,
              boxWidth: 20,
            },
          },
        },
      },
    });
  }, [investments]);

  return (
    <div className="w-full h-64">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
}