import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Lock, Shield, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuthRTK";

interface CheckoutData {
  artistId: number;
  artistName: string;
  amount: number;
}

function CheckoutForm({ data }: { data: CheckoutData }) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const isMountedRef = useRef(true);

  // Mock toast function
  const toast = (options: { title: string; description: string; variant?: string }) => {
    console.log(`Toast: ${options.title} - ${options.description}`);
    alert(`${options.title}: ${options.description}`);
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Mock payment intent creation
  useEffect(() => {
    let cancelled = false;

    const createMockIntent = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (cancelled || !isMountedRef.current) return;

        console.log("✅ MOCK PAYMENT INTENT CREATED for:", data.amount, "EUR");
      } catch (err: any) {
        if (!cancelled && isMountedRef.current) {
          setError(err.message);
        }
      }
    };

    createMockIntent();
    return () => {
      cancelled = true;
    };
  }, [data.amount, data.artistId, data.artistName]);

  // Mock card validation
  const validateCard = () => {
    const isCardNumberValid = cardNumber.replace(/\s/g, '').length >= 13;
    const isExpiryValid = cardExpiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/);
    const isCvcValid = cardCvc.length >= 3;
    
    return isCardNumberValid && isExpiryValid && isCvcValid;
  };

  useEffect(() => {
    setIsComplete(validateCard());
  }, [cardNumber, cardExpiry, cardCvc]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isComplete || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (!isMountedRef.current) return;

      // Mock payment success
      console.log("✅ MOCK PAYMENT SUCCESSFUL:", {
        amount: data.amount,
        artist: data.artistName,
        cardNumber: cardNumber.slice(-4)
      });

      // Mock investment creation
      const mockInvestmentData = {
        artistId: data.artistId,
        amount: data.amount,
        paymentIntentId: `pi_mock_${Date.now()}`,
        paymentMethod: "card",
      };

      console.log("💼 MOCK INVESTMENT CREATED:", mockInvestmentData);
      setIsSuccess(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        if (isMountedRef.current) {
          navigate("/");
        }
      }, 3000);

    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message);
        toast({
          title: "Payment Failed",
          description: err.message,
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsProcessing(false);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center space-y-6">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-400">
                You've successfully invested {data.amount}€ in {data.artistName}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Redirecting to dashboard in 3 seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Complete Payment
          </h1>
          <p className="text-gray-400">
            Invest {data.amount}€ in {data.artistName}
          </p>
        </div>

        {/* Payment Form */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Details
              </h3>
              <Lock className="w-4 h-4 text-green-400" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                {/* Mock Card Number Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Mock Expiry Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  {/* Mock CVC Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-400">
                <Shield className="w-4 h-4 mr-2" />
                <span>
                  Mock secure payment. This is a demo - no real charges will be made.
                </span>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="flex-1 bg-transparent border-slate-600 hover:bg-slate-700"
                  disabled={isProcessing}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isComplete || isProcessing}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : !isComplete ? (
                    "Complete card info"
                  ) : (
                    `Pay ${data.amount}€`
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Artist:</span>
                <span className="text-white">{data.artistName}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Investment:</span>
                <span className="text-white">{data.amount}€</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Processing Fee:</span>
                <span className="text-white">Free</span>
              </div>
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between text-white font-semibold">
                  <span>Total:</span>
                  <span>{data.amount}€</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { artistId, amount } = useParams();
  const navigate = useNavigate();

  // Mock artist data (replacing useQuery API call)
  const mockArtists = [
    {
      id: 52,
      name: "Ali Sampson",
      username: "Ali Sampson",
      email: "myluju@mailinator.com",
      genre: "indie",
      country: "France",
      bio: "Rem aut et qui quaer",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      fundingGoal: "50000",
      currentFunding: "9901",
      monthlyListeners: 14207,
      expectedReturn: 16,
      streamingLinks: {
        spotify: "https://open.spotify.com/artist/52",
        youtube: "https://youtube.com/@Ali Sampson",
      },
      socialLinks: {
        instagram: "Iusto aut illum vol",
        youtube: "Vel enim praesentium",
        spotify: "Proident inventore ",
      },
      isActive: true,
      createdAt: "2025-07-28T06:44:00.049Z",
    },
    {
      id: 1,
      name: "Rosé",
      genre: "K-Pop",
      country: "South Korea",
      bio: "K-Pop sensation with millions of followers worldwide.",
      fundingGoal: "150000",
      currentFunding: "110000",
      monthlyListeners: 5200000,
      expectedReturn: 25,
      isActive: true,
      createdAt: "2025-08-30T00:00:00.000Z",
    }
  ];

  if (!user) {
    navigate("/");
    return null;
  }

  if (!artistId || !amount) {
    navigate("/");
    return null;
  }

  // Find artist by ID or use first artist as fallback
  const artist = mockArtists.find((a: any) => a.id === parseInt(artistId)) || mockArtists[0];

  console.log("Mock artist data:", artist);

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              Artist Not Found
            </h2>
            <p className="text-gray-400 mb-4">
              The artist you're trying to invest in was not found.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const checkoutData: CheckoutData = {
    artistId: parseInt(artistId),
    artistName: artist.name,
    amount: parseInt(amount),
  };

  return <CheckoutForm data={checkoutData} />;
}
