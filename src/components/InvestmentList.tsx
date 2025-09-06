import { useAuth } from "@/hooks/useAuthRTK";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function InvestmentList() {
  const { user } = useAuth();
  const userId = user?.id || 0;

  // Mock investment data (replacing useUserInvestments hook)
  const mockInvestments = [
    {
      id: 1,
      projectId: 1,
      amount: "500",
      sharePercentage: "2.5",
      status: "active",
      expectedReturn: "15-25%",
      paymentMethod: "card",
      jurisdiction: "US",
      project: {
        name: "Sophia Martinez - Pop Album",
        id: 1
      }
    },
    {
      id: 2,
      projectId: 2,
      amount: "1000",
      sharePercentage: "4.2",
      status: "active",
      expectedReturn: "20-30%",
      paymentMethod: "bank",
      jurisdiction: "UK",
      project: {
        name: "Marcus Thompson - R&B EP",
        id: 2
      }
    },
    {
      id: 3,
      projectId: 3,
      amount: "250",
      sharePercentage: "1.8",
      status: "pending",
      expectedReturn: "10-18%",
      paymentMethod: "card",
      jurisdiction: "FR",
      project: {
        name: "Elena Rodriguez - Electronic Singles",
        id: 3
      }
    },
    {
      id: 4,
      projectId: 4,
      amount: "750",
      sharePercentage: "3.1",
      status: "active",
      expectedReturn: "18-28%",
      paymentMethod: "mobile",
      jurisdiction: "DE",
      project: {
        name: "James Wilson - Hip Hop Mixtape",
        id: 4
      }
    }
  ];

  // Simulate loading state
  const isLoading = false;
  const isError = false;

  // Filter investments by user ID (in a real app, this would come from the API)
  const data = userId > 0 ? mockInvestments : [];

  if (isLoading) return <p className="text-white">Loading investments...</p>;
  if (isError || !data) return <p className="text-red-400">Failed to load investments.</p>;
  if (data.length === 0) return <p className="text-gray-400">You haven't made any investments yet.</p>;

  return (
    <div className="grid gap-4">
      {data.map((inv: any) => (
        <Card key={inv.id} className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold">{inv.project?.name || `Project #${inv.projectId}`}</h3>
              <Badge
                variant="outline"
                className={`${
                  inv.status === "active"
                    ? "border-green-500 text-green-400"
                    : inv.status === "pending"
                    ? "border-yellow-500 text-yellow-400"
                    : "border-red-500 text-red-400"
                }`}
              >
                {inv.status}
              </Badge>
            </div>

            <div className="text-sm text-gray-300">
              <p>
                <span className="text-gray-400">Amount:</span> ${inv.amount}
              </p>
              <p>
                <span className="text-gray-400">Share %:</span> {inv.sharePercentage}%
              </p>
              <p>
                <span className="text-gray-400">Return Expected:</span> {inv.expectedReturn}
              </p>
              <p>
                <span className="text-gray-400">Payment Method:</span>{" "}
                <span className="capitalize">{inv.paymentMethod || "N/A"}</span>
              </p>
              <p>
                <span className="text-gray-400">Jurisdiction:</span> {inv.jurisdiction}
              </p>
            </div>

            {/* Additional investment details */}
            <div className="mt-3 pt-3 border-t border-gray-600">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Investment Date:</span>
                <span>
                  {inv.status === "active" ? "2024-08-15" : "2024-08-28"}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Current Value:</span>
                <span className={`${inv.status === "active" ? "text-green-400" : "text-yellow-400"}`}>
                  ${inv.status === "active" ? (parseInt(inv.amount) * 1.05).toFixed(0) : inv.amount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
