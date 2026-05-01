'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Zap, Loader2 } from 'lucide-react';

const premiumFeatures = [
  {
    name: 'No Ads',
    description: 'Enjoy a seamless, ad-free browsing experience across the platform.',
  },
  {
    name: 'Verified Listings',
    description: 'Get access to exclusive listings that have been verified by our team.',
  },
  {
    name: 'Free Verification Badge',
    description: 'Premium users get their listings verified for free, increasing buyer trust.',
  },
  {
    name: 'Priority Support',
    description: 'Jump the queue with dedicated, fast-tracked support from our team.',
  },
];

export default function PremiumPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      toast({
        variant: 'destructive',
        title: 'Phone Number Required',
        description: 'Please enter your mobile money phone number.',
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPhoneNumber('');
      toast({
        title: 'Payment Successful!',
        description: 'Welcome to Premium! Your benefits are now active.',
        className: 'bg-green-500 text-white',
      });
    }, 3000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/50">
        <div className="container flex justify-center py-8 md:py-16">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <Zap className="mx-auto h-12 w-12 text-premium" />
              <CardTitle className="mt-4 font-headline text-3xl text-primary">
                Upgrade to Premium
              </CardTitle>
              <CardDescription className="text-lg">
                Unlock exclusive benefits and sell your property faster.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 pt-2 md:grid-cols-2">
              <div className="flex flex-col justify-center space-y-6">
                <h3 className="font-headline text-xl font-semibold">What you get:</h3>
                <ul className="space-y-4">
                  {premiumFeatures.map((feature) => (
                    <li key={feature.name} className="flex items-start">
                      <CheckCircle className="mr-3 mt-1 h-5 w-5 shrink-0 text-green-500" />
                      <div>
                        <p className="font-semibold">{feature.name}</p>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col justify-center rounded-lg border bg-background p-6 shadow-inner">
                <h3 className="font-headline text-xl font-semibold">Make Payment</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Complete the payment to activate your premium membership.
                </p>
                <form onSubmit={handlePayment} className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="phone">Mobile Money Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="e.g., 0771234567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      disabled={isProcessing}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-premium text-white hover:bg-premium/90" disabled={isProcessing}>
                    {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isProcessing ? 'Processing...' : 'Pay 10,000 UGX via Mobile Money'}
                  </Button>
                </form>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  You will receive a prompt on your phone to complete the payment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
