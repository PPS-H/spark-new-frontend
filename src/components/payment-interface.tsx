import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Lock, AlertCircle, CheckCircle, Building, Smartphone } from 'lucide-react';
import { Artist } from '@/types/artist';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface PaymentInterfaceProps {
  artist: Artist;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onBack: () => void;
}

const PaymentForm = ({ artist, amount, onSuccess, onError, onBack }: PaymentInterfaceProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'mobile'>('card');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [step, setStep] = useState<'method' | 'form' | 'summary'>('method');

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: amount,
          artistId: artist.id,
          currency: 'eur'
        })
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStep('form');
      } else {
        throw new Error(data.error || 'Failed to create payment intent');
      }
    } catch (err: any) {
      onError(err.message || 'Payment setup failed');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `Investment in ${artist.name}`,
          },
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        onError(confirmError.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      onError(err.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: 'transparent',
        '::placeholder': {
          color: '#94a3b8',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

  if (step === 'method') {
    return (
      <div className="space-y-6">
        {/* Order Summary */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Artist:</span>
                <span className="text-white">{artist.name}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Investment:</span>
                <span className="text-white">{amount}€</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Processing Fee:</span>
                <span className="text-white">0€</span>
              </div>
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between text-white font-semibold">
                  <span>Total:</span>
                  <span>{amount}€</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold">Payment Method</h3>
          
          <Card 
            className={`cursor-pointer transition-all ${
              paymentMethod === 'card' 
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-gray-700 bg-slate-800/50 hover:bg-slate-700/50'
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Credit/Debit Card</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              paymentMethod === 'bank' 
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-gray-700 bg-slate-800/50 hover:bg-slate-700/50'
            }`}
            onClick={() => setPaymentMethod('bank')}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Bank Transfer</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              paymentMethod === 'mobile' 
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-gray-700 bg-slate-800/50 hover:bg-slate-700/50'
            }`}
            onClick={() => setPaymentMethod('mobile')}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Mobile Payment</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={paymentMethod === 'card' ? createPaymentIntent : () => setStep('summary')}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Invest {amount}€
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'form' && paymentMethod === 'card') {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Card Information
            </h3>
            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <CardElement options={cardElementOptions} />
            </div>
            
            {error && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-400 mt-3">
              <Lock className="w-4 h-4" />
              <span>Secured by Stripe</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setStep('method')}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </span>
            ) : (
              `Pay ${amount}€`
            )}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-400 font-medium">Erreur de Paiement</span>
          </div>
          <p className="text-red-300 text-sm mt-1">
            Échec du traitement du paiement. Veuillez réessayer.
          </p>
        </CardContent>
      </Card>

      {/* 100% Automated System */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-blue-400" />
            <span className="text-blue-400 font-medium">100% Automated System</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span className="text-blue-200">Automatic KYC/AML verification</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span className="text-blue-200">Smart contract generation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span className="text-blue-200">Automated revenue redistribution</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={() => setStep('method')}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Invest {amount}€
        </Button>
      </div>
    </div>
  );
};

export default function PaymentInterface(props: PaymentInterfaceProps) {
  const options = {
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#a855f7',
        colorBackground: '#1e293b',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        borderRadius: '8px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm {...props} />
    </Elements>
  );
}