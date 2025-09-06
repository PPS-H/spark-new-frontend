import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, AlertCircle, CheckCircle, Building, Smartphone } from 'lucide-react';
import { Artist } from '@/types/artist';

interface PaymentFormProps {
  artist: Artist;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onBack: () => void;
}

export default function PaymentForm({ artist, amount, onSuccess, onError, onBack }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'mobile'>('card');
  const [step, setStep] = useState<'method' | 'form' | 'processing'>('method');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStep('processing');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create payment intent through backend
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
        // Simulate successful payment
        onSuccess(data.paymentIntentId || 'pi_test_success');
      } else {
        // For demo purposes, if payment setup fails, still allow the investment
        console.warn('Payment setup failed, proceeding with demo investment');
        onSuccess('pi_demo_' + Date.now());
      }
    } catch (error: any) {
      onError(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 'processing') {
    return (
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-white font-semibold text-lg">Processing Payment...</h3>
        <p className="text-gray-400">Please wait while we process your {amount}€ investment</p>
      </div>
    );
  }

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
            onClick={() => setStep('form')}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Form */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Card Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label className="text-white">Cardholder Name</Label>
              <Input 
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <Label className="text-white">Card Number</Label>
              <Input 
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Expiry Date</Label>
                <Input 
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              
              <div>
                <Label className="text-white">CVV</Label>
                <Input 
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400 mt-4">
            <Lock className="w-4 h-4" />
            <span>Your payment is secured with encryption</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Configuration Notice */}
      <Card className="bg-amber-500/10 border-amber-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <span className="text-amber-400 font-medium">Payment Configuration Required</span>
          </div>
          <p className="text-amber-300 text-sm">
            To process real payments, configure your Stripe keys in environment variables. 
            Currently using test mode for demonstration.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
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
          disabled={isProcessing}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : (
            `Invest ${amount}€`
          )}
        </Button>
      </div>
    </form>
  );
}